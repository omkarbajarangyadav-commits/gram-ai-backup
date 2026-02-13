import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MARKET_DATA, SHOPS_DATA } from '@/data/mockData';

export async function GET() {
    let marketData = MARKET_DATA;
    let shops = SHOPS_DATA;

    // 1. Try Real DB for Shops
    if (isSupabaseConfigured()) {
        try {
            const { data, error } = await supabase
                .from('shops')
                .select('*')
                .limit(10);

            if (!error && data && data.length > 0) {
                shops = data;
            }
        } catch (e) {
            console.error('Supabase Market Fetch Error:', e);
        }
    }

    return NextResponse.json({
        marketData,
        shops
    }, { status: 200 });
}
