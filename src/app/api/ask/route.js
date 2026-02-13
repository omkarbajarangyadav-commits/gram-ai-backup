import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { generateAIResponse } from '@/lib/openai';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, text, language = 'hi-IN', inputType = 'text' } = body;

        if (!text || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Generate AI Response
        const aiAnswer = await generateAIResponse(text, language);

        // 2. Store Query in Firestore
        const queryRef = db.collection('queries').doc();
        const queryId = queryRef.id;

        await queryRef.set({
            queryId,
            userId,
            question: text,
            inputType,
            language,
            timestamp: Timestamp.now(),
        });

        // 3. Store Response in Firestore
        const responseRef = db.collection('responses').doc();
        await responseRef.set({
            responseId: responseRef.id,
            queryId,
            answer: aiAnswer,
            model: 'gpt-3.5-turbo',
            confidence: 0.9, // Placeholder as Gemini API doesn't always return this simply
            timestamp: Timestamp.now(),
        });

        return NextResponse.json({
            answer: aiAnswer,
            queryId
        });

    } catch (error) {
        console.error('API Error /api/ask:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
