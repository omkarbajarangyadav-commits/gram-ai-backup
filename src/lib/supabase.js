import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase: Missing environment variables. DB features will be disabled.');
}

// Helper to validate URL
const isValidUrl = (urlString) => {
    try {
        return Boolean(new URL(urlString));
    }
    catch (e) {
        return false;
    }
}

const urlToUse = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co';
const keyToUse = supabaseAnonKey || 'placeholder';

export const supabase = createClient(urlToUse, keyToUse);

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-supabase-url');

// Logger helper
export const logQuery = async (userId, text, language, answer) => {
    if (!isSupabaseConfigured()) {
        console.log('Skipping DB Log (Supabase not configured)');
        return;
    }

    try {
        const { error } = await supabase
            .from('interactions') // We will use a single 'interactions' table for simplicity and scale
            .insert({
                user_id: userId,
                question: text,
                answer: answer,
                language: language,
                created_at: new Date().toISOString()
            });

        if (error) console.error('Supabase Log Error:', error);
    } catch (e) {
        console.error('Supabase Exception:', e);
    }
};
