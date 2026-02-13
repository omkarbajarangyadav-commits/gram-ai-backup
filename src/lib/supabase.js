import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Optional: For admin tasks

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder'
);

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
    return supabaseUrl &&
        supabaseKey &&
        !supabaseUrl.includes('your-supabase-url');
};

// Logger helper
export const logQuery = async (userId, text, language, answer) => {
    if (!isSupabaseConfigured()) {
        console.log('Skipping DB Log (Supabase not configured)');
        return;
    }

    try {
        const { error } = await supabase
            .from('ai_logs') // Updated table name from schema
            .insert({
                user_id: userId, // Note: This might fail RLS if userId is not auth.uid()
                query_text: text,
                response_text: answer,
                created_at: new Date().toISOString()
            });

        if (error) console.error('Supabase Log Error:', error);
    } catch (e) {
        console.error('Supabase Exception:', e);
    }
};

// Admin client (bypasses RLS) - Use carefully in API routes only
export const getServiceSupabase = () => {
    if (serviceKey) {
        return createClient(supabaseUrl, serviceKey);
    }
    return null;
};
