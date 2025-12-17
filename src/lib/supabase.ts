import { createClient } from '@supabase/supabase-js';

// Access environment variables using Vite's import.meta.env
const supabaseUrl = import.meta.env.VITE_INTEGRACLINIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_INTEGRACLINIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase credentials. Please check your .env file.");
}

export const supabase = createClient(
    supabaseUrl || "",
    supabaseAnonKey || ""
);
