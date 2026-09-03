import { createClient } from '@supabase/supabase-js';

// Supabase URL & ANON Key (supporting Vite & Next environment variable names)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eywhwmdazsnfjkhdxwls.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_1p7EXhlrnfXsdQkDZy6XQQ_YR7pjMpW';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
