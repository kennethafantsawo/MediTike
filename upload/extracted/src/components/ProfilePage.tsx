import { useState } from 'react';
import { supabase } from '../supabase';
import { UserProfile } from '../types';
import { User, Phone, MapPin, Building, LogOut, CheckCircle, Save, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { normalizeTogoPhone, getFetchErrorExplanation } from '../utils/togoHelpers';

interface ProfilePageProps {
  profile: UserProfile;
  onProfileUpdate: (updated: UserProfile) => void;
  onLogout: () => void;
}

export function ProfilePage({ profile, onProfileUpdate, onLogout }: ProfilePageProps) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [pharmacyName, setPharmacyName] = useState(profile.pharmacyName || '');
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber || '');
  const [address, setAddress] = useState(profile.address || '');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setErrorMsg(null);

    try {
      const cleanPhone = normalizeTogoPhone(phoneNumber);
      const payload = {
        fullName,
        full_name: fullName,
        pharmacyName: profile.role === 'pharmacist' ? pharmacyName : undefined,
        pharmacy_name: profile.role === 'pharmacist' ? pharmacyName : undefined,
        phoneNumber: cleanPhone,
        phone_number: cleanPhone,
        address: profile.role === 'pharmacist' ? address : undefined,
        address_text: profile.role === 'pharmacist' ? address : undefined,
      };

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', profile.id);

      if (error) throw error;

      // Update state in App
      onProfileUpdate({
        ...profile,
        fullName,
        pharmacyName: profile.role === 'pharmacist' ? pharmacyName : undefined,
        phoneNumber: cleanPhone,
        address: profile.role === 'pharmacist' ? address : undefined,
      });

      setPhoneNumber(cleanPhone);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(getFetchErrorExplanation(err));
    } finally {
      setSaving(false);
    }
  };

  const verifyLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          alert('Géolocalisation autorisée avec succès !');
        },
        (error) => {
          console.error(error);
          alert('Erreur ou refus de la géolocalisation.');
        }
      );
    } else {
      alert('La géolocalisation n’est pas supportée par votre navigateur.');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
      >
        {/* Profile Card Header */}
        <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-10 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center font-bold text-2xl uppercase shadow-md">
              {fullName ? fullName.charAt(0) : 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{fullName || 'Profil utilisateur'}</h2>
              <span className="inline-block mt-1 px-3 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                {profile.role === 'pharmacist' ? 'Professionnel (Pharmacien)' : 'Patient (Client)'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details body */}
        <div className="p-6 space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Informations Personnelles</h3>

          {errorMsg && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-r-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Vos modifications ont été enregistrées avec succès !
            </div>
          )}

          <div className="space-y-4">
            {/* Nom complet */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nom Complet</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Numéro de téléphone */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Numéro de Téléphone (WhatsApp)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  placeholder="Ex: +33 6 12 34 56"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Si Pharmacien : Officine & adresse */}
            {profile.role === 'pharmacist' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-sans">
                    Nom de l'Officine
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Building className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={pharmacyName}
                      onChange={(e) => setPharmacyName(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-sans">
                    Adresse Complète de la Pharmacie
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      className="block w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Settings & Extras */}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <button
              onClick={verifyLocation}
              className="w-full bg-slate-100 text-slate-700 py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4 text-emerald-600 animate-spin-slow" />
              Tester la Géolocalisation PWA
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Enregistrement...' : 'Enregistrer les Modifications'}
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={onLogout}
              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Se Déconnecter
            </button>
          </div>
        </div>
      </motion.div>
      <div className="mt-6 text-center text-[10px] text-slate-400 uppercase tracking-widest font-black">
        MediTike v1.0.0
      </div>
    </div>
  );
}
