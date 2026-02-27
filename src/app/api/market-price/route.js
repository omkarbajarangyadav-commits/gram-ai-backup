import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

// Enable Edge Caching
export const runtime = 'edge';
export const revalidate = 3600; // Cache for 1 hour

export async function GET(request) {
    const isAllowed = await rateLimit(request);
    if (!isAllowed) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // Generate dynamic "real-world" simulation data based on current hour
    // In a production app, we would fetch from agmarknet.gov.in or similar API
    const date = new Date();
    const hourMultiplier = (date.getHours() % 24) * 0.01;

    const baselines = [
        { crop: 'Soybean', price: 4850, volatility: 0.03 },
        { crop: 'Cotton', price: 6920, volatility: 0.05 },
        { crop: 'Onion', price: 1400, volatility: 0.08 },
        { crop: 'Wheat', price: 2320, volatility: 0.02 },
        { crop: 'Rice', price: 3100, volatility: 0.01 },
    ];

    const marketData = baselines.map(base => {
        // Create an organic fluctuation algorithm
        const fluctuation = Math.sin(date.getHours() + base.price) * base.volatility;
        const currentPrice = Math.round(base.price + (base.price * fluctuation));
        const difference = currentPrice - base.price;
        const percentage = ((difference / base.price) * 100).toFixed(1);

        return {
            crop: base.crop,
            price: currentPrice,
            trend: difference > 0 ? 'up' : difference < 0 ? 'down' : 'stable',
            percentage: Math.abs(percentage)
        };
    });

    return NextResponse.json(marketData, {
        status: 200,
        headers: {
            'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
