import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request) {
    try {
        const body = await request.json();
        const { type, message, device } = body;

        await db.collection('logs').add({
            type: type || 'unknown',
            message: message || 'No message',
            device: device || 'unknown',
            timestamp: Timestamp.now(),
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('API Error /api/log:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
