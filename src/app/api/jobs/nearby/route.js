import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rateLimit';

export async function GET(request) {
    try {
        const isAllowed = await rateLimit(request);
        if (!isAllowed) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }

        const { searchParams } = new URL(request.url);
        const lat = parseFloat(searchParams.get('lat'));
        const lon = parseFloat(searchParams.get('lon'));
        let radius = parseInt(searchParams.get('radius') || '5000'); // Default 5KM

        if (isNaN(lat) || isNaN(lon)) {
            return NextResponse.json({ error: "Invalid coordinates provided" }, { status: 400 });
        }

        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        // Check subscriber status for radius extending logic
        if (radius > 5000) {
            // Free users capped at 5KM. Premium up to 10KM.
            const { data: profile } = await supabase
                .from('worker_profiles')
                .select('subscriber_level')
                .eq('id', user?.id)
                .single();

            if (!profile || profile.subscriber_level !== 'premium') {
                radius = 5000; // Force free limit
            } else if (radius > 10000) {
                radius = 10000; // Cap premium limit at 10KM
            }
        }

        // Call PostGIS ST_DWithin RPC Function
        const { data, error } = await supabase.rpc('get_nearby_jobs', {
            user_lat: lat,
            user_lon: lon,
            radius_meters: radius,
            max_results: 100
        });

        if (error) throw error;

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Job Radius RPC Error:', error);
        return NextResponse.json({ error: "Failed to fetch nearby jobs" }, { status: 500 });
    }
}
