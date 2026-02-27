import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request) {
    try {
        const isAllowed = await rateLimit(request);
        if (!isAllowed) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }

        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
        }

        // Mock Payment Gateway Processing Delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update the worker_profiles to Premium
        // PostGIS Matching Engine relies on subscriber_level = 'premium'
        const { error } = await supabase
            .from('worker_profiles')
            .upsert({
                id: user.id,
                subscriber_level: 'premium',
                rating: 5.0, // Give them a 5-star rating boost for the prototype demo
                available: true
            });

        if (error) {
            console.error("Subscription DB Error:", error);
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: "Successfully upgraded to Premium! Radar AI Boost and 10KM radius activated."
        }, { status: 200 });

    } catch (error) {
        console.error('Subscription Endpoint Error:', error);
        return NextResponse.json({ error: "Checkout failed." }, { status: 500 });
    }
}
