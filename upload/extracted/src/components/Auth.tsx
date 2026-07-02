import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Lock, User, Phone, Building, Activity, ChevronDown, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { AdminPanel } from './AdminPanel';
import { normalizeTogoPhone, getFetchErrorExplanation } from '../utils/togoHelpers';

interface AuthProps {
  onAuthSuccess: () => void;
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loginRole, setLoginRole] = useState<'client' | 'pharmacist'>('client');
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  
  // Registration / Client state
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  
  // Pharmacist dynamic selected state
  const [selectedPharmacyId, setSelectedPharmacyId] = useState('');
  const [pharmaciesList, setPharmaciesList] = useState<any[]>([]);
  const [loadingPharmacies, setLoadingPharmacies] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load pharmacies for the pharmacist dropdown list
  const loadPharmacies = async () => {
    setLoadingPharmacies(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, pharmacyName, pharmacy_name, fullName, full_name, phone_number, phoneNumber, address')
        .eq('role', 'pharmacist');
      
      if (error) throw error;
      if (data) {
        // Keep only rows with valid pharmacy names or fallback names
        const validPharmacies = data.filter(
          p => p.pharmacy_name || p.pharmacyName || p.fullName || p.full_name
        );
        setPharmaciesList(validPharmacies);
        if (validPharmacies.length > 0) {
          setSelectedPharmacyId(prev => {
            return validPharmacies.some(p => p.id === prev) ? prev : validPharmacies[0].id;
          });
        }
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des officines:', err);
      setErrorMessage(getFetchErrorExplanation(err));
    } finally {
      setLoadingPharmacies(false);
    }
  };

  useEffect(() => {
    loadPharmacies();
  }, []);

  if (showAdminPortal) {
    return (
      <AdminPanel 
        onClose={() => {
          setShowAdminPortal(false);
          loadPharmacies();
        }} 
      />
    );
  }

  function getPharmacyEmail(profile: any) {
    if (profile.email) return profile.email;
    // Normalized fallback format
    const name = profile.pharmacyName || profile.pharmacy_name || profile.fullName || profile.full_name || '';
    const normalized = name
      .toLowerCase()
      .normalize('NFD') // decompose to separate accents
      .replace(/[\u0300-\u036f]/g, '') // remove accent marks
      .replace(/[^a-z0-9]/g, '_') // non-alphanumeric to underscores
      .replace(/__+/g, '_') // collapse multiples
      .replace(/^_+|_+$/g, ''); // trim borders
    
    // Ensure the email prefix starts with a letter to pass strict validations
    const prefix = /^[a-z]/.test(normalized) ? normalized : `p_${normalized}`;
    return `${prefix}.meditike@gmail.com`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      if (isLogin) {
        let loginEmail = '';
        
        if (loginRole === 'client') {
          // Patient login using phone number (normalized with Togo +228)
          const cleanPhone = normalizeTogoPhone(phoneNumber);
          if (!cleanPhone) {
            throw new Error('Veuillez saisir un numéro de téléphone valide.');
          }
          // Remove '+' from prefix for Supabase Auth email formatting
          // Prepend 'c' so the local part starts with a letter and is fully valid.
          const emailPrefix = cleanPhone.replace(/^\+/, '');
          loginEmail = `client_${emailPrefix}.meditike@gmail.com`;
        } else {
          // Pharmacist dropdown selection login
          const selectedPharmacy = pharmaciesList.find(p => p.id === selectedPharmacyId);
          if (!selectedPharmacy) {
            throw new Error('Veuillez séléctionner une officine dans la liste.');
          }
          loginEmail = getPharmacyEmail(selectedPharmacy);
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password,
        });
        
        if (error) throw error;
        onAuthSuccess();
      } else {
        // Client Sign Up (Phone number based normalized with Togo +228)
        const cleanPhone = normalizeTogoPhone(phoneNumber);
        if (!cleanPhone) {
          throw new Error('Veuillez saisir un numéro de téléphone valide.');
        }
        if (!fullName.trim()) {
          throw new Error('Veuillez saisir votre nom complet.');
        }

        // Remove '+' from prefix for Supabase Auth email formatting
        // Prepend 'c' so the local part starts with a letter and is fully valid.
        const emailPrefix = cleanPhone.replace(/^\+/, '');
        const clientEmail = `client_${emailPrefix}.meditike@gmail.com`;

        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: clientEmail,
          password,
        });

        if (signUpError) throw signUpError;
        if (!authData.user) {
          throw new Error("Erreur d'inscription - utilisateur non créé.");
        }

        // Create Profile in Supabase public "profiles" table
        const profileData = {
          id: authData.user.id,
          role: 'client',
          id_profile: authData.user.id,
          full_name: fullName.trim(),
          fullName: fullName.trim(),
          pharmacy_name: null,
          pharmacyName: null,
          phone_number: cleanPhone,
          phoneNumber: cleanPhone,
          address: null,
          address_text: null,
          created_at: new Date().toISOString(),
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([profileData]);

        if (profileError) {
          console.error("Erreur de création du profil:", profileError);
          const { error: upsertError } = await supabase
            .from('profiles')
            .upsert([profileData]);
          if (upsertError) throw upsertError;
        }

        onAuthSuccess();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(getFetchErrorExplanation(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-white/50 backdrop-blur-sm"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-3 shadow-inner">
            <Activity className="w-9 h-9" />
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700 tracking-tight">
            MediTike
          </h1>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase mt-1 text-center">
            Disponibilité Médicaments en Temps Réel
          </p>
        </div>

        {/* Global tab manager: Login vs SignUp */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrorMessage(null); }}
            className={`py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
              isLogin 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Se Connecter
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrorMessage(null); }}
            className={`py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
              !isLogin 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            S'Inscrire (Patient)
          </button>
        </div>

        {/* Sub role tabs: only show during connection */}
        {isLogin && (
          <div className="grid grid-cols-2 gap-2 mb-6 border-b border-slate-100 pb-4">
            <button
              type="button"
              onClick={() => { setLoginRole('client'); setErrorMessage(null); }}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 border ${
                loginRole === 'client'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              Patient / Client
            </button>
            <button
              type="button"
              onClick={() => { setLoginRole('pharmacist'); setErrorMessage(null); }}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 border ${
                loginRole === 'pharmacist'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Building className="w-4 h-4" />
              Officine Officielle
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-r-xl text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* signup fields (patient client only) */}
          {!isLogin && (
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase mb-1.5">
                  Nom Complet
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Paul Martin"
                    className="block w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Client phone field (visible on signup OR patient-login) */}
          {(!isLogin || (isLogin && loginRole === 'client')) && (
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase mb-1.5">
                Numéro WhatsApp (Togo / International)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Ex : 90 12 34 56"
                  className="block w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Les 8 chiffres du Togo seront automatiquement convertis au format international <span className="font-semibold text-slate-500">+228</span>.
              </p>
            </div>
          )}

          {/* Pharmacist Dropdown Selection field (visible only on login with role = pharmacist) */}
          {isLogin && loginRole === 'pharmacist' && (
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase mb-1.5">
                Sélectionnez votre Officine / Pharmacie
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building className="w-4 h-4" />
                </div>
                
                {loadingPharmacies ? (
                  <div className="block w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-405 font-medium animate-pulse">
                    Chargement des officines partenaires...
                  </div>
                ) : pharmaciesList.length === 0 ? (
                  <div className="block w-full pl-10 pr-4 py-2.5 text-xs bg-orange-50 border border-orange-200 text-orange-700 rounded-xl font-medium">
                    Aucune pharmacie trouvée dans la base de données.
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedPharmacyId}
                      onChange={(e) => setSelectedPharmacyId(e.target.value)}
                      className="block w-full pl-11 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium appearance-none cursor-pointer"
                    >
                      {pharmaciesList.map((ph) => {
                        const displayName = ph.pharmacy_name || ph.pharmacyName || ph.fullName || ph.full_name;
                        return (
                          <option key={ph.id} value={ph.id}>
                            {displayName}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Password field (Always required) */}
          <div>
            <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase mb-1.5">
              Mot de Passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || (isLogin && loginRole === 'pharmacist' && pharmaciesList.length === 0)}
            className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl hover:from-emerald-700 hover:to-teal-750 font-bold text-sm tracking-wide shadow-lg hover:shadow-emerald-500/20 focus:outline-none transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
            ) : isLogin ? (
              'Se Connecter'
            ) : (
              'Créer mon Compte'
            )}
          </button>
        </form>

        {isLogin && (
          <div className="mt-6 text-center text-[11px] text-slate-400">
            En vous connectant, vous accédez au réseau d'officines <span className="font-semibold text-slate-500">MediTike</span>.
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center">
          <button 
            type="button"
            onClick={() => setShowAdminPortal(true)}
            className="text-[11px] text-slate-400 hover:text-emerald-600 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent border-0 outline-none"
          >
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            Portail Administrateur (Gestion Officines)
          </button>
        </div>
      </motion.div>
    </div>
  );
}
