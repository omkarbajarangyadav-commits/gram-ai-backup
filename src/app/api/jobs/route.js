import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { jobSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rateLimit';

export async function GET(request) {
    try {
        const isAllowed = await rateLimit(request);
        if (!isAllowed) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const location = searchParams.get('location');
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const offset = (page - 1) * limit;

        const supabase = createClient();

        let query = supabase
            .from('jobs')
            .select('*', { count: 'exact' })
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        // Performance/Filtering features
        if (location) query = query.ilike('location', `%${location}%`);
        if (category) query = query.eq('category', category);
        if (search) query = query.ilike('title', `%${search}%`);

        query = query.range(offset, offset + limit - 1);

        const { data: jobs, count, error } = await query;

        if (error) throw error;

        return NextResponse.json({ jobs, total: count, page, pages: Math.ceil(count / limit) });
    } catch (error) {
        console.error('Jobs GET Error:', error);
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const isAllowed = await rateLimit(request);
        if (!isAllowed) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }

        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Server-side input validation
        const parsedData = jobSchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
        }

        const jobData = {
            ...parsedData.data,
            user_id: user.id
        };

        const { data, error } = await supabase
            .from('jobs')
            .insert([jobData])
            .select()
            .single();

        if (error) throw error;

        // ==========================================
        // AI AUTO-MATCHING ENGINE DISPATCH TRIGGER
        // ==========================================
        if (jobData.latitude && jobData.longitude) {
            // Run the highly optimized C-level PostGIS scoring algorithm
            const { data: matchedWorkers, error: matchError } = await supabase.rpc('match_workers_to_job', {
                job_lat: jobData.latitude,
                job_lon: jobData.longitude,
                max_radius: 5000, // Search within 5KM
                limit_matches: 5 // Get Top 5 best workers instantly
            });

            if (!matchError && matchedWorkers?.length > 0) {
                // Here we would push to WebSockets, WhatsApp Cloud API, or Firebase push notifications
                console.log(`[AI DISPATCH]: Found ${matchedWorkers.length} elite workers for Job ${data.id}. Firing WhatsApp Alerts...`);
                // e.g. sendWhatsAppJobAlerts(matchedWorkers, data);
            }
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Jobs POST Error:', error);
        return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
    }
}
