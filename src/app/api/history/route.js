import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        // Fetch last 20 queries for the user
        const queriesSnapshot = await db.collection('queries')
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .limit(20)
            .get();

        const history = [];

        // For each query, try to find its response (simplification: in real app, might denormalize)
        for (const doc of queriesSnapshot.docs) {
            const queryData = doc.data();

            // Fetch corresponding response
            const responseSnapshot = await db.collection('responses')
                .where('queryId', '==', queryData.queryId)
                .limit(1)
                .get();

            let answer = null;
            if (!responseSnapshot.empty) {
                answer = responseSnapshot.docs[0].data().answer;
            }

            history.push({
                ...queryData,
                answer,
                timestamp: queryData.timestamp.toDate().toISOString() // Serializable date
            });
        }

        return NextResponse.json({ history });

    } catch (error) {
        console.error('API Error /api/history:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
