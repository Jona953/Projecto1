// Supabase client initialization
// Uses environment variables for security - never hardcode keys!
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://missing-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'missing-key';

if (!import.meta.env.VITE_SUPABASE_URL) {
    console.warn('⚠️ [Supabase] Missing VITE_SUPABASE_URL');
}
if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn('⚠️ [Supabase] Missing VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
