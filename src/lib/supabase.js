import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Optional: For admin tasks

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder'
);

export const isSupabaseConfigured = () => {
    return supabaseUrl &&
        supabaseKey &&
        !supabaseUrl.includes('your-supabase-url');
};

// Admin client (bypasses RLS) - Use carefully in API routes only
export const getServiceSupabase = () => {
    if (serviceKey) {
        return createClient(supabaseUrl, serviceKey);
    }
    return null;
};
