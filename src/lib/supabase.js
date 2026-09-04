import { createClient } from '@supabase/supabase-js';

// Supabase URL & ANON Key
const supabaseUrl = import.meta.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || 'https://eywhwmdazsnfjkhdxwls.supabase.co';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5d2h3bWRhenNuZmpraGR4d2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzODMwMDQsImV4cCI6MjEwMzk1OTAwNH0.UoTA2zzndAuKwQRL2RMQD89TeM3BZA-J000BX9ed7Bc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce'
  }
});

/**
 * Checks connection to Supabase DB table
 */
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      console.warn('Supabase connection warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase error, using fallback mock data:', err);
    return false;
  }
};
