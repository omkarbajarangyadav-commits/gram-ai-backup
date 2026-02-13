import { NextResponse } from 'next/server';
import { MARKET_DATA, SHOPS_DATA } from '@/data/mockData';

export async function GET() {
    // Return all data to allow client-side filtering and dropdown population
    return NextResponse.json({
        marketData: MARKET_DATA,
        shops: SHOPS_DATA
    }, { status: 200 });
}
