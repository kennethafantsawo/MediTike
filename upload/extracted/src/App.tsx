import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { UserProfile } from './types';
import { Auth } from './components/Auth';
import { RequestsPage } from './components/RequestsPage';
import { HistoryPage } from './components/HistoryPage';
import { ProfilePage } from './components/ProfilePage';
import { ClipboardList, Clock, User, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TabType = 'dashboard' | 'history' | 'profile';

export function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Authenticate & load profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile, attempting to provision fallback:', error);
        // Fallback or provision profile if missing
        const fallbackProfile: UserProfile = {
          id: userId,
          role: 'client',
          fullName: 'Utilisateur MediTike',
          phoneNumber: '',
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: userId,
              id_profile: userId,
              fullName: fallbackProfile.fullName,
              full_name: fallbackProfile.fullName,
              role: fallbackProfile.role,
              phone_number: '',
              created_at: new Date().toISOString(),
            },
          ]);

        if (insertError) {
          console.error("Failed to provision profile:", insertError);
        }
        setProfile(fallbackProfile);
        return;
      }

      setProfile({
        id: data.id,
        role: data.role || 'client',
        fullName: data.fullName || data.full_name || 'Utilisateur',
        pharmacyName: data.pharmacyName || data.pharmacy_name || '',
        phoneNumber: data.phoneNumber || data.phone_number || '',
        address: data.address || data.address_text || '',
      });
    } catch (err: any) {
      console.error('Erreur lors du chargement de de profil:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Initial lookup
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // 2. Auth state subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-4">
        <Heart className="w-10 h-10 text-emerald-600 animate-pulse mb-3" />
        <h2 className="text-lg font-black text-slate-800 tracking-tight">Connexion à MediTike...</h2>
        <p className="text-slate-500 text-xs mt-1 animate-pulse">Vérification en temps réel</p>
      </div>
    );
  }

  // Offer login page if unauthenticated
  if (!session || !profile) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-24">
      {/* Dynamic Header */}
      <header className="bg-white border-b border-slate-100 shadow-sm px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <Heart className="w-5 h-5 fill-emerald-500 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">MediTike</h1>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5 inline-block">
              {profile.role === 'pharmacist' ? 'Mode Officine' : 'Mode Patient'}
            </span>
          </div>
        </div>

        {/* Short profile brief */}
        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-100 text-xs">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-700">
            {profile.role === 'pharmacist' ? (profile.pharmacyName || 'Pharmacien') : profile.fullName}
          </span>
        </div>
      </header>

      {/* Render selected view */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              <RequestsPage profile={profile} />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              <HistoryPage profile={profile} />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              <ProfilePage 
                profile={profile} 
                onProfileUpdate={(updated) => setProfile(updated)} 
                onLogout={handleLogout} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Responsive Mobile Bottom Navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3.5 shadow-2x z-20 flex items-center justify-around md:max-w-md md:mx-auto md:bottom-4 md:rounded-2xl md:border">
        {/* Dashboard Tab */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === 'dashboard' ? 'text-emerald-600 scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] font-bold">Tableau</span>
        </button>

        {/* History Tab */}
        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === 'history' ? 'text-emerald-600 scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] font-bold">Historique</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === 'profile' ? 'text-emerald-600 scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Mon Compte</span>
        </button>
      </nav>
    </div>
  );
}
