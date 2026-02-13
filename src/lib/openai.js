import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
let openai = null;

if (apiKey) {
    openai = new OpenAI({
        apiKey: apiKey,
    });
}

export async function generateAIResponse(prompt, language = 'hi-IN') {
    if (!openai) {
        console.warn("OpenAI API Key missing.");
        return "System Check: Backend is active, but OpenAI API Key is missing. Please check .env.local and add OPENAI_API_KEY.";
    }

    try {
        const systemInstruction = `You are "Smart Farm", an expert agricultural advisor for Indian farmers.
        - **Language:** Always reply in strict ${language === 'mr-IN' ? 'Marathi (मराठी)' : 'Hindi (हिंदी)'}.
        - **Tone:** Respectful, simple, and encouraging (like a wise village elder).
        - **Content:** Provide actionable advice on crops, fertilizers, pest control, and government schemes (PM-Kisan, Fasal Bima).
        - **Currency:** Use Indian Rupees (₹).
        - **Context:** Assume the user has limited resources. Suggest cost-effective organic alternatives where possible.
        - **Safety:** If asked about dangerous chemicals, warn about safety gear.
        - **Unknowns:** If unsure, ask clarifying questions instead of guessing.`;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: prompt }
            ],
            model: "gpt-3.5-turbo",
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI Error:', error);
        return 'क्षमा करा, मला सध्या उत्तर देण्यात अडचण येत आहे. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.';
    }
}
