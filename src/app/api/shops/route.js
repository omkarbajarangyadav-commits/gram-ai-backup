import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SHOPS_DATA } from '@/data/mockData';

// GET all shops
export async function GET() {
    // 1. Try Real DB
    if (isSupabaseConfigured()) {
        try {
            const { data, error } = await supabase
                .from('shops')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                return NextResponse.json({ shops: data, source: 'database' });
            }
        } catch (e) {
            console.error('Supabase Error:', e);
        }
    }

    // 2. Fallback to Mock
    return NextResponse.json({ shops: SHOPS_DATA, source: 'mock' });
}

// POST new shop
export async function POST(request) {
    try {
        const body = await request.json();

        // Validate
        if (!body.name || !body.contact) {
            return NextResponse.json({ error: 'Missing Name/Contact' }, { status: 400 });
        }

        // 1. Try Real DB
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('shops')
                .insert([{
                    name: body.name,
                    contact_number: body.contact,
                    location: body.location,
                    category: body.category,
                    // Demo Owner ID (In real app, get from session)
                    owner_id: '00000000-0000-0000-0000-000000000000',
                    is_verified: false
                }])
                .select();

            if (!error) {
                return NextResponse.json({ success: true, shop: data[0] });
            } else {
                console.error('Registration DB Error:', error);
                // Fallback to mock success if DB fails (e.g. RLS issues)
            }
        }

        // 2. Mock Success
        return NextResponse.json({ success: true, shop: { id: Date.now(), ...body } });

    } catch (error) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
