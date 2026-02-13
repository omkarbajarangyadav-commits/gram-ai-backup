import { NextResponse } from 'next/server';

import { generateAIResponse } from '@/lib/openai';
import { logQuery } from '@/lib/supabase';

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, text, language = 'hi-IN', inputType = 'text' } = body;

        if (!text || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Generate AI Response
        const aiAnswer = await generateAIResponse(text, language);

        // 2. Store Query & Response in Supabase (Async logging)
        // We don't await this to keep the API fast
        logQuery(userId, text, language, aiAnswer);

        return NextResponse.json({
            answer: aiAnswer,
            queryId: Date.now().toString() // Simple ID for frontend
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
