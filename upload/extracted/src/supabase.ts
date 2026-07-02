import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.NEXT_PUBLIC_SUPABASE_URL || metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY || metaEnv.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[MediTike Warning] Keys are missing from environment!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const hasSupabaseCreds = !!(supabaseUrl && supabaseAnonKey);
