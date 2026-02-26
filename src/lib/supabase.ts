// Supabase client initialization
import { createClient } from '@supabase/supabase-js';

// Hardcoded for immediate fix in Vercel - ensures app works right away
const supabaseUrl = 'https://vljdgamhlrqncsmxurms.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsamRnYW1obHJxbmNzbXh1cm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NjAyMzIsImV4cCI6MjA4NzUzNjIzMn0.JjbBG5siiY3qQo59Nuiug_Oyg0-UoXIins00dA9jsho';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
