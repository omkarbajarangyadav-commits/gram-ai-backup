import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rateLimit';

export async function GET(request) {
    try {
        const isAllowed = await rateLimit(request);
        if (!isAllowed) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }

        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        // Typically you would verify user role === 'admin' here

        // Call the Postgres aggregation function for job density 
        const { data, error } = await supabase.rpc('get_job_heatmap');

        if (error) throw error;

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Heatmap API Error:', error);
        return NextResponse.json({ error: "Failed to fetch heatmap data" }, { status: 500 });
    }
}
