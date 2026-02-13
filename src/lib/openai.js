import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
let openai = null;

if (apiKey && !apiKey.includes('your-openai-api-key')) {
    openai = new OpenAI({
        apiKey: apiKey,
    });
}

// SMART MOCK DATABASE (Enhanced for Offline/Demo Mode)
const MOCK_KNOWLEDGE_BASE = {
    keywords: {
        'weather': "📍 weather: Based on historical data for this season, expect dry conditions with 60% humidity. Ideal for cotton harvesting. (Simulated)",
        'havaman': "📍 havaman: Based on historical data for this season, expect dry conditions with 60% humidity. Ideal for cotton harvesting. (Simulated)",
        'pani': "💧 irrigation: For cotton, drip irrigation is recommended every 4 days. Wheat needs water every 15 days.",
        'water': "💧 irrigation: For cotton, drip irrigation is recommended every 4 days. Wheat needs water every 15 days.",
        'disease': "🦠 diagnostics: Please upload a photo in the 'Heal Crop' section for accurate diagnosis. Generally, yellowing leaves indicate Nitrogen deficiency.",
        'khat': "beej: For Soyabean, use JS-335 or MACS-1188 varieties. Seed rate: 30kg/acre.",
        'fertilizer': "🧪 fertilizer: Use NPK 10:26:26 for cotton flowering stage. Add Magnesium Sulfate 10kg/acre for greenness.",
        'market': "💰 market: Today's rates - Soyabean: ₹4800, Cotton: ₹7000, Wheat: ₹2200. Prices are stable.",
        'bhav': "💰 market: Today's rates - Soyabean: ₹4800, Cotton: ₹7000, Wheat: ₹2200. Prices are stable.",
        'loan': "🏦 scheme: KCC (Kisan Credit Card) offers loans at 4% interest. Visit your nearest cooperative bank.",
    },
    default: {
        'hi-IN': "नमस्ते! (Demo Mode) मी सध्या इंटरनेटशी कनेक्ट नाही, पण मी शेतीबद्दल मदत करू शकतो. 'हवामान', 'बाजार भाव', 'खत' याबद्दल विचारा.",
        'en': "Hello! (Demo Mode) I'm currently running in low-data mode. Ask me about 'Weather', 'Market Rates', or 'Fertilizers'."
    }
};

function getSmartMockResponse(prompt, language) {
    const lowerPrompt = prompt.toLowerCase();

    // 1. Check for Keywords
    for (const [key, response] of Object.entries(MOCK_KNOWLEDGE_BASE.keywords)) {
        if (lowerPrompt.includes(key)) {
            return language.startsWith('hi') || language.startsWith('mr')
                ? `(Demo) ${response} (भाषांतर: ${response})`
                : response;
        }
    }

    // 2. Default Fallback
    return language.startsWith('hi') || language.startsWith('mr')
        ? MOCK_KNOWLEDGE_BASE.default['hi-IN']
        : MOCK_KNOWLEDGE_BASE.default['en'];
}

export async function generateAIResponse(prompt, language = 'en') {
    // 1. If No API Key -> Use Smart Mock Mode
    if (!openai) {
        console.warn("OpenAI API Key missing. Using Smart Mock Mode.");
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate thinking
        return getSmartMockResponse(prompt, language);
    }

    // 2. Real API Call (GPT-4o-mini optimized)
    try {
        const systemInstruction = `
        You are "Gram Guru", an expert agricultural AI assistant for Indian farmers.
        
        CONTEXT:
        - User Language: ${language}
        - Location: India (Maharashtra focus)
        - Tone: Respectful (using 'Ji' or 'Rao'), practical, and encouraging.
        
        INSTRUCTIONS:
        1. Keep answers SHORT (max 3-4 sentences). Farmers are busy.
        2. Use bullet points for readability.
        3. Recommend ORGANIC solutions first, then chemical.
        4. If asking about prices, mention that "Market rates vary daily".
        5. For crops like Cotton/Soyabean/Sugarcane, give specific advice.
        
        FORMAT:
        - Use emojis 🌾🚜💧 to make it friendly.
        - If the user asks in Hinglish/Marathi, reply in the same mix/language.
        `;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: prompt }
            ],
            model: "gpt-3.5-turbo", // Cost effective
            temperature: 0.5,
            max_tokens: 350,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI Error:', error);
        return getSmartMockResponse(prompt, language); // Smart Fallback
    }
}
