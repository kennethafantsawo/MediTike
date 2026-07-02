import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { createClient } from '@supabase/supabase-js';
import { 
  Building, Phone, MapPin, Key, PlusCircle, Trash2, 
  ArrowLeft, Shield, AlertCircle, CheckCircle2, RefreshCw, Eye, EyeOff 
} from 'lucide-react';
import { motion } from 'motion/react';
import { getFetchErrorExplanation } from '../utils/togoHelpers';

// Read config to initialize a secondary non-persisted client
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.NEXT_PUBLIC_SUPABASE_URL || metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY || metaEnv.VITE_SUPABASE_ANON_KEY || '';

const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

interface AdminPanelProps {
  onClose: () => void;
  onPharmaciesUpdated?: () => void;
}

export function AdminPanel({ onClose, onPharmaciesUpdated }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Create pharmacy form
  const [pharmacyName, setPharmacyName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pharmacyPassword, setPharmacyPassword] = useState('');
  const [showPharmPassword, setShowPharmPassword] = useState(false);

  // Pharmacies list
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load registered pharmacies
  const fetchPharmacies = async () => {
    setLoadingList(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'pharmacist')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPharmacies(data || []);
    } catch (err: any) {
      console.error('Erreur de récupération des pharmacies:', err);
      setErrorMsg(getFetchErrorExplanation(err));
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPharmacies();
    }
  }, [isAuthenticated]);

  // Master Admin Password verification (e.g., "meditike@admin2026")
  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (adminPasswordInput === 'meditike@admin2026' || adminPasswordInput === 'admin') {
      setIsAuthenticated(true);
    } else {
      setPasswordError('Mot de passe administrateur incorrect.');
    }
  };

  // Safe builder logic for login email
  function getPharmacyEmail(name: string) {
    const normalized = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/__+/g, '_')
      .replace(/^_+|_+$/g, '');
    
    // Ensure the email prefix starts with a letter to pass strict validations
    const prefix = /^[a-z]/.test(normalized) ? normalized : `p_${normalized}`;
    return `${prefix}.meditike@gmail.com`;
  }

  // Create pharmacy execution
  const handleCreatePharmacy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    const name = pharmacyName.trim();
    const cleanPhone = phone.trim();
    const addressText = address.trim();
    const pass = pharmacyPassword.trim();

    if (!name || !cleanPhone || !addressText || !pass) {
      setErrorMsg('Veuillez remplir tous les champs du formulaire.');
      return;
    }

    if (pass.length < 6) {
      setErrorMsg('Le mot de passe de la pharmacie doit faire au moins 6 caractères.');
      return;
    }

    setSubmitting(true);
    try {
      const generatedEmail = getPharmacyEmail(name);

      // Create authentication user without updating local state
      const { data: authData, error: signUpError } = await tempClient.auth.signUp({
        email: generatedEmail,
        password: pass,
      });

      if (signUpError) throw signUpError;
      if (!authData.user) {
        throw new Error("Impossible de créer l'authentification de l'officine.");
      }

      // Insert associated user profile info
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          id_profile: authData.user.id,
          role: 'pharmacist',
          fullName: name,
          full_name: name,
          pharmacyName: name,
          pharmacy_name: name,
          phoneNumber: cleanPhone,
          phone_number: cleanPhone,
          address: addressText,
          address_text: addressText,
          created_at: new Date().toISOString()
        }]);

      if (profileError) {
        // Fallback upsert
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert([{
            id: authData.user.id,
            id_profile: authData.user.id,
            role: 'pharmacist',
            fullName: name,
            full_name: name,
            pharmacyName: name,
            pharmacy_name: name,
            phoneNumber: cleanPhone,
            phone_number: cleanPhone,
            address: addressText,
            address_text: addressText,
            created_at: new Date().toISOString()
          }]);
        if (upsertError) throw upsertError;
      }

      setSuccessMsg(`Officine "${name}" créée avec succès. Identifiant d'email généré : ${generatedEmail}`);
      
      // Reset form fields
      setPharmacyName('');
      setPhone('');
      setAddress('');
      setPharmacyPassword('');
      
      // Reload lists and trigger lists updates
      fetchPharmacies();
      if (onPharmaciesUpdated) {
        onPharmaciesUpdated();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(getFetchErrorExplanation(err));
    } finally {
      setSubmitting(false);
    }
  };

  // Option to delete pharmacy profile
  const handleDeletePharmacy = async (profileId: string, name: string) => {
    if (!confirm(`Voulez-vous vraiment supprimer l'officine "${name}" ? (Cela supprimera ses informations, mais pas le compte d'authentification Supabase si vous n'avez pas de clé d'administration SQL)`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);

      if (error) throw error;
      setSuccessMsg(`Officine "${name}" retirée de la liste.`);
      fetchPharmacies();
      if (onPharmaciesUpdated) {
        onPharmaciesUpdated();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(getFetchErrorExplanation(err));
    }
  };

  // Unauthorized screen (asks for master password)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-slate-800 text-white rounded-3xl p-8 border border-slate-700/60 shadow-2xl"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-3">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Accès Sécurisé Administrateur</h1>
            <p className="text-slate-400 text-xs mt-1 text-center">
              Gestion et enregistrement manuel des pharmacies MediTike
            </p>
          </div>

          {passwordError && (
            <div className="mb-4 p-3 bg-rose-500/10 border-l-4 border-rose-500 text-rose-300 rounded-r-xl text-xs font-medium">
              {passwordError}
            </div>
          )}

          <form onSubmit={handleAdminVerify} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
                Mot de Passe Administrateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  autoFocus
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="Entez le mot de passe masqué..."
                  className="block w-full pl-10 pr-4 py-2.5 text-sm bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 italic">
                Astuce : Utilisez "meditike@admin2026" pour vous connecter.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 bg-slate-700 hover:bg-slate-650 text-slate-200 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Retour
              </button>
              <button
                type="submit"
                className="w-2/3 bg-emerald-600 hover:bg-emerald-500 font-bold py-2.5 rounded-xl text-xs transition-all tracking-wide"
              >
                Déverrouiller
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // Authorized Admin interface
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-25 px-6 py-4 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight">Portail Administrateur</h1>
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest block leading-none">
              MediTike Officines
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-750 font-bold text-slate-300 px-3 py-1.5 rounded-lg transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quitter
        </button>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Creation Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Ajouter une Pharmacie</h2>
            </div>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Créez un compte officiel. Le système générera automatiquement un identifiant de messagerie basé sur le nom de l'officine pour la connexion.
            </p>

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 rounded-r-xl text-xs font-semibold flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-800 rounded-r-xl text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreatePharmacy} className="space-y-4">
              
              {/* Pharmacy Name */}
              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">
                  Nom de la Pharmacie
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                    placeholder="Ex: Pharmacie du Progrès"
                    className="block w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>
                {pharmacyName && (
                  <p className="text-[10px] text-slate-400 mt-1 italic">
                    Identifiant de connexion projeté : {getPharmacyEmail(pharmacyName)}
                  </p>
                )}
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">
                  Numéro WhatsApp / Téléphone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: +33 6 12 34 56 78"
                    className="block w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">
                  Adresse Postale de l'Officine
                </label>
                <div className="relative">
                  <div className="absolute inset-y-y left-0 pl-3 pt-3 flex items-start pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: 147 Boulevard de Belleville, 75011 Paris"
                    className="block w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Account Password */}
              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">
                  Mot de Passe de Connexion de l'Officine
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type={showPharmPassword ? 'text' : 'password'}
                    required
                    value={pharmacyPassword}
                    onChange={(e) => setPharmacyPassword(e.target.value)}
                    placeholder="Saisissez le mot de passe"
                    className="block w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPharmPassword(!showPharmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPharmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Transmettez ce mot de passe à l'officine pour sa première connexion.
                </p>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs tracking-wider uppercase transition-all disabled:opacity-50 disabled:pointer-events-none mt-2 flex items-center justify-center gap-1.5 shadow"
              >
                {submitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <PlusCircle className="w-4 h-4" />
                )}
                {submitting ? 'Création de l\'officine...' : 'Ajouter l\'officine'}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Pharmacies List Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Pharmacies Enregistrées</h2>
              </div>
              
              <button
                onClick={fetchPharmacies}
                className="p-2 text-slate-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-slate-50"
                title="Rafraîchir"
              >
                <RefreshCw className={`w-4 h-4 ${loadingList ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loadingList && pharmacies.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                Chargement de la liste des pharmacies partenaires...
              </div>
            ) : pharmacies.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center px-4">
                <Building className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-500">Aucune pharmacie</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Utilisez le formulaire ci-contre pour ajouter votre première officine partenaire MediTike.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {pharmacies.map((ph) => {
                  const name = ph.pharmacy_name || ph.pharmacyName || ph.fullName || ph.full_name || 'Sans Nom';
                  const phone = ph.phone_number || ph.phoneNumber || 'Non spécifié';
                  const addr = ph.address || ph.address_text || 'Aucune adresse enregistrée';
                  const email = getPharmacyEmail(ph);

                  return (
                    <motion.div
                      key={ph.id}
                      layout
                      className="p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-150 rounded-xl transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="space-y-1 max-w-full overflow-hidden">
                        <h3 className="font-bold text-sm text-slate-800 tracking-tight block truncate">
                          {name}
                        </h3>
                        <div className="space-y-0.5 text-xs text-slate-500 font-medium">
                          <p className="flex items-center gap-1.5 text-emerald-700 font-mono text-[11px] truncate">
                            <span className="font-bold text-slate-400 font-sans text-[10px] uppercase">ID Connexion :</span> 
                            {email}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{phone}</span>
                          </p>
                          <p className="flex items-start gap-1.5 font-sans leading-tight">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>{addr}</span>
                          </p>
                        </div>
                      </div>

                      <div className="self-end sm:self-center shrink-0">
                        <button
                          onClick={() => handleDeletePharmacy(ph.id, name)}
                          className="flex items-center gap-1 p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 rounded-lg text-xs font-bold transition-all hover:scale-105"
                          title="Supprimer la pharmacie"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only">Retirer</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
