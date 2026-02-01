import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic'; // Ensure not cached

export async function GET() {
    try {
        // 1. Total Queries Count
        const queriesSnapshot = await db.collection('queries').count().get();
        const totalQueries = queriesSnapshot.data().count;

        // 2. Language Stats (Aggregated manually for now, better to use counters in real scalable app)
        // Note: 'count()' aggregation is efficient but doesn't support 'group by' easily in client SDK without aggregation queries support enabled
        // We will do a simple approximation by fetching a sample or just returning hardcoded structure for now if DB is empty

        // For this MVP, we return simple stats
        const stats = {
            totalQueries,
            activeUsers: 42, // Placeholder or need user counting
            popularCrops: ['Soyabean', 'Cotton', 'Maize'], // Could be derived from text analysis
            languageDistribution: {
                'hi-IN': 60,
                'mr-IN': 40
            }
        };

        return NextResponse.json(stats);

    } catch (error) {
        console.error('API Error /api/analytics:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
