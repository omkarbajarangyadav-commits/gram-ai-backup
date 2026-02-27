import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request) {
    try {
        const isAllowed = await rateLimit(request);
        if (!isAllowed) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }

        const body = await request.json();
        const { latitude, longitude, is_online = true } = body;

        if (isNaN(latitude) || isNaN(longitude)) {
            return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
        }

        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Upsert into realtime worker_locations table. 
        // The PostGIS trigger handles the Point() geometry compilation automatically.
        const { error } = await supabase.from('worker_locations').upsert({
            worker_id: user.id,
            latitude,
            longitude,
            is_online,
            last_updated: new Date().toISOString()
        });

        if (error) throw error;

        return NextResponse.json({ status: "success", location_updated: true });
    } catch (error) {
        console.error("Worker Tracking API Error:", error);
        return NextResponse.json({ error: "Failed to update location" }, { status: 500 });
    }
}
