import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { UserProfile, ProductRequest, ProductResponse } from '../types';
import { ChevronDown, ChevronUp, Clock, AlertCircle, RefreshCw, Tag, MapPin, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SupportedCurrency, convertPrice, formatPrice, formatTogoPhone, getFetchErrorExplanation } from '../utils/togoHelpers';

interface HistoryPageProps {
  profile: UserProfile;
}

export function HistoryPage({ profile }: HistoryPageProps) {
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [responses, setResponses] = useState<Record<string, ProductResponse[]>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Read preferred currency
  const [displayCurrency, setDisplayCurrencyState] = useState<SupportedCurrency>(() => {
    return (localStorage.getItem('meditike_currency') as SupportedCurrency) || 'XOF';
  });

  const setDisplayCurrency = (curr: SupportedCurrency) => {
    setDisplayCurrencyState(curr);
    localStorage.setItem('meditike_currency', curr);
  };

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchHistoryAndResponses = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      if (!currentUser) return;

      let queryBuilder = supabase.from('requests').select('*');
      if (profile.role === 'client') {
        queryBuilder = queryBuilder.eq('clientUid', currentUser.id);
      }

      const { data: reqData, error: reqError } = await queryBuilder.order('createdAt', { ascending: false });
      if (reqError) throw reqError;

      if (reqData) {
        const mappedReqs = reqData.map(item => ({
          id: item.id,
          clientUid: item.clientUid || item.client_uid,
          productName: item.productName || item.product_name,
          normalizedProductName: item.normalizedProductName || item.normalized_product_name,
          status: item.status,
          createdAt: item.createdAt || item.created_at || new Date().toISOString()
        })) as ProductRequest[];
        setRequests(mappedReqs);

        // Fetch responses for these requests
        const reqIds = mappedReqs.map(r => r.id);
        if (reqIds.length > 0) {
          const { data: respData, error: respError } = await supabase
            .from('responses')
            .select('*')
            .in('requestId', reqIds)
            .order('createdAt', { ascending: false });

          if (respError) throw respError;

          if (respData) {
            const grouped: Record<string, ProductResponse[]> = {};
            respData.forEach(item => {
              const reqId = item.requestId || item.request_id;
              if (!grouped[reqId]) {
                grouped[reqId] = [];
              }
              grouped[reqId].push({
                id: item.id,
                requestId: reqId,
                pharmacistUid: item.pharmacistUid || item.pharmacist_uid,
                pharmacyName: item.pharmacyName || item.pharmacy_name,
                pharmacyPhone: item.pharmacyPhone || item.pharmacy_phone,
                pharmacyAddress: item.pharmacyAddress || item.pharmacy_address,
                available: item.available,
                price: item.price !== null ? Number(item.price) : undefined,
                note: item.note || '',
                createdAt: item.createdAt || item.created_at || new Date().toISOString()
              } as ProductResponse);
            });
            setResponses(grouped);
          }
        } else {
          setResponses({});
        }
      }
    } catch (err: any) {
      console.error('Error fetching history:', err);
      setErrorMsg(getFetchErrorExplanation(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryAndResponses();
  }, [profile.role]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 font-sans">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Historique complet
          </h2>
          <p className="text-slate-500 text-sm">
            {profile.role === 'client' 
              ? 'Consultez l’ensemble de vos anciennes recherches de médicaments.' 
              : 'Liste globale des demandes de produits.'}
          </p>
        </div>
        
        <button 
          onClick={fetchHistoryAndResponses}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Togo Multi-Currency Converter Card */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Affichage Multi-Devise</h4>
            <p className="text-[10px] text-slate-400">Voir les prix selon vos préférences de devise.</p>
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
                  : 'text-slate-500 hover:text-slate-705 bg-transparent border-none'
              }`}
            >
              {curr === 'XOF' ? '🌍 XOF' : curr === 'EUR' ? '🇪🇺 EUR (€)' : '🇺🇸 USD ($)'}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-xl text-orange-850 flex items-center gap-2 mb-4 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin mb-3"></div>
          <p className="text-xs font-semibold">Chargement...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-700">Aucun historique d'activité</h4>
          <p className="text-slate-400 text-xs mt-1">Vous n'avez pas encore d'historique de recherche.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const reqResponses = responses[req.id] || [];
            const isExpanded = expandedId === req.id;

            return (
              <motion.div
                key={req.id}
                layout
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
              >
                <div
                  onClick={() => toggleExpand(req.id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Recherche lancée le {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <h4 className="text-base font-bold text-slate-800 leading-tight">
                      {req.productName}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className={`px-2 py-0.5 text-[11px] font-bold rounded-lg ${
                      reqResponses.length > 0 
                        ? 'bg-emerald-50 text-emerald-800' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {reqResponses.length} {reqResponses.length > 1 ? 'offres' : 'offre'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-slate-100 bg-slate-50/30 px-5 pb-5 pt-3"
                    >
                      {reqResponses.length === 0 ? (
                        <p className="text-slate-400 text-xs py-2 italic text-center">Aucun pharmacien n’a encore répondu à cette demande.</p>
                      ) : (
                        <div className="space-y-3 mt-2">
                          {reqResponses.map((res) => (
                            <div key={res.id} className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <h5 className="text-sm font-bold text-slate-800">{res.pharmacyName}</h5>
                                  {res.pharmacyAddress && (
                                    <span className="text-[11px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                                      {res.pharmacyAddress}
                                    </span>
                                  )}
                                  {res.pharmacyPhone && (
                                    <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">
                                      WhatsApp : <span className="font-mono text-slate-750">{formatTogoPhone(res.pharmacyPhone)}</span>
                                    </span>
                                  )}
                                </div>
                                <span className={`px-1.5 py-0.5 text-[10px] uppercase font-bold rounded ${
                                  res.available ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {res.available ? 'En Stock' : 'Épuisé'}
                                </span>
                              </div>

                              {res.available && res.price !== undefined && (
                                <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 flex-wrap">
                                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                                  Prix indiqué : <span className="text-slate-850 font-extrabold">{formatPrice(convertPrice(res.price, 'XOF', displayCurrency), displayCurrency)}</span>
                                  {displayCurrency !== 'XOF' && (
                                    <span className="text-[10px] text-slate-450 block font-normal">
                                      ({formatPrice(res.price, 'XOF')})
                                    </span>
                                  )}
                                </div>
                              )}

                              {res.note && (
                                <div className="p-2 bg-slate-50 text-[11px] italic text-slate-605 border-l-2 border-slate-300 rounded">
                                  "{res.note}"
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
