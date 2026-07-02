import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { UserProfile, ProductRequest, ProductResponse } from '../types';
import { 
  Plus, Clipboard, MapPin, 
  CheckCircle2, XCircle, Clock, Send, MessageCircle, AlertCircle, ShoppingBag, Landmark, Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  SupportedCurrency, 
  convertPrice, 
  formatPrice, 
  formatTogoPhone, 
  getWhatsAppNumber,
  getFetchErrorExplanation
} from '../utils/togoHelpers';

interface RequestsPageProps {
  profile: UserProfile;
}

export function RequestsPage({ profile }: RequestsPageProps) {
  const [productName, setProductName] = useState('');
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [responses, setResponses] = useState<Record<string, ProductResponse[]>>({});
  
  // Multi-currency display and input states
  const [displayCurrency, setDisplayCurrencyState] = useState<SupportedCurrency>(() => {
    return (localStorage.getItem('meditike_currency') as SupportedCurrency) || 'XOF';
  });
  const [inputCurrency, setInputCurrency] = useState<SupportedCurrency>('XOF');

  const setDisplayCurrency = (curr: SupportedCurrency) => {
    setDisplayCurrencyState(curr);
    localStorage.setItem('meditike_currency', curr);
  };
  
  // Pharmacist response builder state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [available, setAvailable] = useState(true);
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch helper
  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // 1. Fetch Requests
      let reqQuery = supabase.from('requests').select('*');
      if (profile.role === 'client') {
        reqQuery = reqQuery.eq('clientUid', profile.id);
      }
      
      const { data: reqData, error: reqError } = await reqQuery.order('createdAt', { ascending: false });
      if (reqError) throw reqError;

      const mappedReqs = (reqData || []).map((item: any) => ({
        id: item.id,
        clientUid: item.clientUid || item.client_uid || item.clientUuid,
        productName: item.productName || item.product_name,
        normalizedProductName: item.normalizedProductName || item.normalized_product_name,
        status: item.status || 'pending',
        createdAt: item.createdAt || item.created_at || new Date().toISOString(),
      })) as ProductRequest[];

      setRequests(mappedReqs);

      // 2. Fetch Responses for these requests
      if (mappedReqs.length > 0) {
        const reqIds = mappedReqs.map(r => r.id);
        const { data: respData, error: respError } = await supabase
          .from('responses')
          .select('*')
          .in('requestId', reqIds);

        if (respError) throw respError;

        const grouped: Record<string, ProductResponse[]> = {};
        (respData || []).forEach((item: any) => {
          const rId = item.requestId || item.request_id || item.requestUuid;
          if (!grouped[rId]) {
            grouped[rId] = [];
          }
          grouped[rId].push({
            id: item.id,
            requestId: rId,
            pharmacistUid: item.pharmacistUid || item.pharmacist_uid,
            pharmacyName: item.pharmacyName || item.pharmacy_name,
            pharmacyPhone: item.pharmacyPhone || item.pharmacy_phone,
            pharmacyAddress: item.pharmacyAddress || item.pharmacy_address,
            available: item.available === true,
            price: item.price !== null ? Number(item.price) : undefined,
            note: item.note || '',
            createdAt: item.createdAt || item.created_at,
          } as ProductResponse);
        });

        setResponses(grouped);
      } else {
        setResponses({});
      }
    } catch (err: any) {
      console.error('[Fetch Requests Error]', err);
      // Let's use getFetchErrorExplanation for clear network error mapping
      setErrorMsg(getFetchErrorExplanation(err));
    } finally {
      setLoading(false);
    }
  };

  // Subscription setup for real-time
  useEffect(() => {
    fetchData();

    // Subscribe to both public channels in real-time
    const requestsSubscription = supabase
      .channel('realtime-meditike')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'responses' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(requestsSubscription);
    };
  }, [profile.role, profile.id]);

  // Handle patient client creating new drug search
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      if (!currentUser) throw new Error("Veuillez vous reconnecter.");

      const payload = {
        clientUid: currentUser.id,
        client_uid: currentUser.id,
        productName: productName.trim(),
        product_name: productName.trim(),
        normalizedProductName: productName.trim().toLowerCase(),
        normalized_product_name: productName.trim().toLowerCase(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('requests').insert([payload]);
      if (error) throw error;

      setProductName('');
      // Visual feedback
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.85 },
        colors: ['#059669', '#10b981', '#34d399']
      });

      fetchData();
    } catch (err: any) {
      console.error(err);
      alert(getFetchErrorExplanation(err));
    }
  };

  // Handle pharmacist submitting response
  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingToId) return;

    setSubmittingReply(true);
    try {
      // Convert submitted price in selected inputCurrency to base database currency (XOF / FCFA)
      const basePriceInXOF = available && price ? convertPrice(parseFloat(price), inputCurrency, 'XOF') : null;

      const payload = {
        requestId: replyingToId,
        request_id: replyingToId,
        pharmacistUid: profile.id,
        pharmacist_uid: profile.id,
        pharmacyName: profile.pharmacyName || 'Pharmacie Partenaire',
        pharmacy_name: profile.pharmacyName || 'Pharmacie Partenaire',
        pharmacyPhone: profile.phoneNumber || '',
        pharmacy_phone: profile.phoneNumber || '',
        pharmacyAddress: profile.address || '',
        pharmacy_address: profile.address || '',
        available,
        price: basePriceInXOF,
        note: note.trim() || null,
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('responses').insert([payload]);
      if (error) throw error;

      // Reset
      setReplyingToId(null);
      setPrice('');
      setNote('');
      setAvailable(true);

      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        colors: ['#059669', '#10b981']
      });

      fetchData();
    } catch (err: any) {
      console.error(err);
      alert(getFetchErrorExplanation(err));
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 font-sans">
      {/* 1. Dashboard Heading */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Tableau de Bord
            <span className="p-1 px-2.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg uppercase tracking-wider">
              {profile.role === 'client' ? 'Dépôt médicament' : 'Vérification en direct'}
            </span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {profile.role === 'client' 
              ? 'Publiez un produit de santé et attendez les offres des officines locales.'
              : 'Consultez les demandes actives des patients et déclarez votre stock.'}
          </p>
        </div>

        {profile.role === 'pharmacist' && (
          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600 font-medium">
            <Landmark className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="font-bold text-slate-800">{profile.pharmacyName || 'Officine non configurée'}</p>
              <p className="opacity-80 text-[10px]">{profile.phoneNumber ? formatTogoPhone(profile.phoneNumber) : 'Pas de numéro'}</p>
            </div>
          </div>
        )}
      </div>

      {/* 1b. Togo Multi-Currency Converter Card */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Affichage Multi-Devise</h4>
            <p className="text-[10px] text-slate-400">Voir les prix en monnaie locale ou internationale.</p>
          </div>
        </div>
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
          {(['XOF', 'EUR', 'USD'] as SupportedCurrency[]).map((curr) => (
            <button
              key={curr}
              type="button"
              onClick={() => setDisplayCurrency(curr)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                displayCurrency === curr 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-700 bg-transparent border-none'
              }`}
            >
              {curr === 'XOF' ? '🌍 XOF (FCFA)' : curr === 'EUR' ? '🇪🇺 EUR (€)' : '🇺🇸 USD ($)'}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-2xl text-orange-850 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* 2. Client / Patient Product Request Drawer/Form */}
      {profile.role === 'client' && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 mb-8"
        >
          <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            Rechercher un produit ou médicament
          </h3>
          <form onSubmit={handleCreateRequest} className="flex gap-2">
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ex : Doliprane 1000mg, Gaviscon, Ventoline, ..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Lancer la recherche
            </button>
          </form>
        </motion.div>
      )}

      {/* 3. Main Live Stream Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400 animate-pulse" />
          {profile.role === 'client' ? 'Mes Recherches Actuelles' : 'Demandes de Médicaments à Proximité'}
        </h3>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin mb-3"></div>
            <p className="text-sm">Mise à jour en temps réel...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clipboard className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-700">Aucune demande trouvée</h4>
            <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
              {profile.role === 'client' 
                ? 'Vous n’avez aucune recherche en cours. Saisissez un produit ci-dessus pour notifier les pharmacies.'
                : 'Aucune demande active de patient n\'est disponible pour le moment. Gardez cette page ouverte pour les alertes.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {requests.map((req) => {
                const reqResponses = responses[req.id] || [];
                const isReplying = replyingToId === req.id;

                return (
                  <motion.div
                    key={req.id}
                    layoutId={`req-card-${req.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:border-emerald-100 transition-all"
                  >
                    {/* Header line of request card */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                          {new Date(req.createdAt).toLocaleDateString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <h4 className="text-lg font-black text-slate-800 mt-0.5 leading-tight">
                          {req.productName}
                        </h4>
                      </div>

                      {profile.role === 'client' ? (
                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg uppercase ${
                          reqResponses.length > 0 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                            : 'bg-amber-50 text-amber-800'
                        }`}>
                          {reqResponses.length === 1 
                            ? '1 Offre de pharmacie' 
                            : reqResponses.length > 1 
                              ? `${reqResponses.length} Offres reçues` 
                              : 'En attente d’offres'}
                        </span>
                      ) : (
                        // Pharmacist View action
                        <button
                          onClick={() => setReplyingToId(isReplying ? null : req.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isReplying 
                              ? 'bg-slate-100 text-slate-600' 
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                          }`}
                        >
                          {isReplying ? 'Fermer' : 'Répondre au Patient'}
                        </button>
                      )}
                    </div>

                    {/* Pharmacist Reply Inline Form */}
                    {profile.role === 'pharmacist' && isReplying && (
                      <motion.form
                        onSubmit={handleReplySubmit}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-slate-100 space-y-4"
                      >
                        {/* Selector for Availability status */}
                        <div>
                          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">
                            Disponibilité en Officine
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setAvailable(true)}
                              className={`py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold border-2 transition-all cursor-pointer ${
                                available 
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                                  : 'border-slate-200 text-slate-500'
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Disponible en rayon
                            </button>
                            <button
                              type="button"
                              onClick={() => setAvailable(false)}
                              className={`py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold border-2 transition-all cursor-pointer ${
                                !available 
                                  ? 'border-rose-500 bg-rose-50 text-rose-700' 
                                  : 'border-slate-200 text-slate-500'
                              }`}
                            >
                              <XCircle className="w-4 h-4" />
                              Rupture de Stock
                            </button>
                          </div>
                        </div>

                        {available && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-1.5"
                          >
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider">
                              Prix unitaire (TTC) & Devise
                            </label>
                            <div className="flex gap-2">
                              <select
                                value={inputCurrency}
                                onChange={(e) => setInputCurrency(e.target.value as SupportedCurrency)}
                                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer text-slate-700"
                              >
                                <option value="XOF">FCFA (Togo)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="USD">USD ($)</option>
                              </select>
                              <input
                                type="number"
                                step="any"
                                required
                                placeholder={inputCurrency === 'XOF' ? "Ex : 4500" : "Ex : 7.50"}
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                          </motion.div>
                        )}

                        <div>
                          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                            Note or indications pour le patient (Ex: Posologie, générique, durée de réservation...)
                          </label>
                          <textarea
                            placeholder="Optionnel..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={2}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submittingReply}
                          className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          {submittingReply ? "Envoi..." : "Envoyer mon Offre"}
                        </button>
                      </motion.form>
                    )}

                    {/* Patient / Client View response matches */}
                    {reqResponses.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                        <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Offres reçues des pharmacies</h5>
                        {reqResponses.map((resp) => (
                          <div 
                            key={resp.id} 
                            className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                              resp.available 
                                ? 'bg-emerald-50/50 border-emerald-100' 
                                : 'bg-slate-50 border-slate-100'
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <h6 className="font-bold text-slate-800 text-sm">{resp.pharmacyName}</h6>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md ${
                                  resp.available 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-slate-200 text-slate-700'
                                }`}>
                                  {resp.available ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                  {resp.available ? 'En Stock' : 'Épuisé'}
                                </span>
                              </div>

                              {resp.pharmacyPhone && (
                                <p className="text-[11px] text-slate-500 font-medium">
                                  WhatsApp : <span className="font-mono text-slate-700">{formatTogoPhone(resp.pharmacyPhone)}</span>
                                </p>
                              )}

                              {resp.pharmacyAddress && (
                                <p className="text-slate-500 text-xs flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  {resp.pharmacyAddress}
                                </p>
                              )}

                              {resp.note && (
                                <p className="text-slate-600 text-xs bg-white/60 p-2 rounded-lg italic border border-slate-100">
                                  "{resp.note}"
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between md:flex-col md:items-end gap-2 pr-1 pt-1 md:pt-0 shrink-0">
                              {resp.available && resp.price !== undefined && (
                                <div className="text-right">
                                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">Prix proposé</span>
                                  <span className="text-lg font-black text-slate-800 block">
                                    {formatPrice(convertPrice(resp.price, 'XOF', displayCurrency), displayCurrency)}
                                  </span>
                                  {displayCurrency !== 'XOF' && (
                                    <span className="text-[10px] text-slate-400 block font-mono">
                                      Equivalent : {formatPrice(resp.price, 'XOF')}
                                    </span>
                                  )}
                                </div>
                              )}

                              {resp.available && (
                                <a
                                  href={`https://wa.me/${getWhatsAppNumber(resp.pharmacyPhone || '')}?text=Bonjour%20${encodeURIComponent(resp.pharmacyName)},%20je%20vous%20contacte%20via%20MediTike%20car%20vous%2520avez%2520indiqu%C3%A9%20la%20disponibilit%C3%A9%20de%20%3A%20${encodeURIComponent(req.productName)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-[#25D366] text-white font-extrabold text-xs rounded-xl hover:bg-[#20ba59] transition-all flex items-center gap-1.5 shadow-sm shadow-[#25D366]/10"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  Commander / WhatsApp
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
