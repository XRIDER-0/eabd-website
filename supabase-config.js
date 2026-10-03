// ================================
// EABD SUPABASE CONFIGURATION
// ================================

const SUPABASE_URL = "https://uhplyldrcgqeynhkdelx.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable__QxRUkHGQRy3DkAhd5MPOw_fJMRm2jH";

const eabdSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);