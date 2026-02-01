import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY;
let genAI = null;

if (apiKey) {
    try {
        genAI = new GoogleGenerativeAI(apiKey);
    } catch (e) {
        console.error("Gemini Init Error:", e);
    }
}

export async function generateAIResponse(prompt, language = 'hi-IN') {
    if (!genAI) {
        console.warn("Gemini API Key missing.");
        return "System Check: Backend is active, but Google API Key is missing. Please check .env.local.";
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        let systemInstruction = `You are "GramAI", an expert agricultural advisor for Indian farmers.
        - **Language:** Always reply in strict ${language === 'mr-IN' ? 'Marathi (मराठी)' : 'Hindi (हिंदी)'}.
        - **Tone:** Respectful, simple, and encouraging (like a wise village elder).
        - **Content:** Provide actionable advice on crops, fertilizers, pest control, and government schemes (PM-Kisan, Fasal Bima).
        - **Currency:** Use Indian Rupees (₹).
        - **Context:** Assume the user has limited resources. Suggest cost-effective organic alternatives where possible.
        - **Safety:** If asked about dangerous chemicals, warn about safety gear.
        - **Unknowns:** If unsure, ask clarifying questions instead of guessing.`;

        const result = await model.generateContent([systemInstruction, prompt]);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini AI Error:', error);
        return 'क्षमा करा, मला सध्या उत्तर देण्यात अडचण येत आहे. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.';
    }
}
