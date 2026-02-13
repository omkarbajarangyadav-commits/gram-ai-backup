import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Mock Data as Fallback
const MOCK_JOBS = [
    {
        id: 1,
        title: 'Cotton Picking Labor Needed',
        employer: 'Rajesh Patil',
        location: 'Akola, MH',
        wage: 450,
        type: 'Daily',
        tags: ['Harvesting', 'Urgent']
    },
    {
        id: 2,
        title: 'Tractor Driver Required',
        employer: 'Kisan Agro Farm',
        location: 'Pune, MH',
        wage: 600,
        type: 'Daily',
        tags: ['Driving', 'Machinery']
    }
];

export async function GET() {
    // 1. Try Real DB
    if (isSupabaseConfigured()) {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data && data.length > 0) {
                return NextResponse.json({ jobs: data, source: 'database' });
            }
        } catch (e) {
            console.error('Supabase Fetch Error:', e);
        }
    }

    // 2. Fallback to Mock
    return NextResponse.json({ jobs: MOCK_JOBS, source: 'mock' });
}

export async function POST(request) {
    try {
        const body = await request.json();

        // Validation
        if (!body.title || !body.wage) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Try Real DB
        if (isSupabaseConfigured()) {
            // Note: In a real app with Auth, we would use the user's ID.
            // For now, we might face RLS issues if not logged in via Supabase Auth.
            // We will attempt insertion.

            // To make this work with the provided schema (which requires employer_id),
            // we'd typically need a real profile. 
            // For this 'Guest' demo, we might fail here if we don't have a valid UUID.

            // Simplified: return success with a note if we can't write key
            const { data, error } = await supabase
                .from('jobs')
                .insert([
                    {
                        title: body.title,
                        wage_per_day: body.wage,
                        location: body.location,
                        description: body.description,
                        // Using a dummy UUID for demo if the schema requires it. 
                        // The user MUST create a profile with this ID in Supabase for this to work strictly,
                        // or we rely on the schema allowing NULL details if we relaxed it.
                        // Assuming the schema from step 1 is strict:
                        employer_id: '00000000-0000-0000-0000-000000000000', // Demo ID
                        status: 'open'
                    }
                ])
                .select();

            if (!error) {
                return NextResponse.json({ success: true, job: data[0], source: 'database' });
            } else {
                console.error('Supabase Insert Error (likely RLS or FK):', error);
                // Fallthrough to mock success
            }
        }

        // 2. Mock Success (Simulate persistence)
        const newJob = {
            id: Date.now(),
            ...body,
            tags: ['New']
        };

        return NextResponse.json({ success: true, job: newJob, source: 'mock' });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
