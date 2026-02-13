import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
let openai = null;

if (apiKey && !apiKey.includes('your-openai-api-key')) {
    openai = new OpenAI({
        apiKey: apiKey,
    });
}

// SMART MOCK DATABASE (Enhanced for detailed crop info)
const MOCK_KNOWLEDGE_BASE = {
    keywords: {
        // WEATHER
        'weather': "📍 Weather Check: Expect dry weather (28°C) for the next 3 days. Good time for spraying.",
        'havaman': "📍 Weather Check: Expect dry weather (28°C) for the next 3 days. Good time for spraying.",
        'rain': "☔ Rain Alert: No rain predicted for the next 48 hours. Irrigation recommended.",
        'paus': "☔ Rain Alert: No rain predicted for the next 48 hours. Irrigation recommended.",

        // COTTON (KAPUS)
        'cotton': "🌾 Cotton (Kapus) Advice:\n• Pest: Watch out for Pink Bollworm (Gulabi Bondali).\n• Solution: Install 5 Pheromone traps/acre.\n• Fertilizer: Spray 19:19:19 for better growth now.",
        'kapus': "🌾 Cotton (Kapus) Advice:\n• Pest: Watch out for Pink Bollworm (Gulabi Bondali).\n• Solution: Install 5 Pheromone traps/acre.\n• Fertilizer: Spray 19:19:19 for better growth now.",
        'kapas': "🌾 Cotton (Kapus) Advice:\n• Pest: Watch out for Pink Bollworm (Gulabi Bondali).\n• Solution: Install 5 Pheromone traps/acre.",

        // SOYABEAN
        'soyabean': "🌱 Soyabean Tips:\n• Pest: Stem Fly is common. Use Thiamethoxam 30 FS.\n• Nutrition: Sulfur is key for oil content. Apply 10kg Sulfur/acre.\n• Water: Maintain soil moisture during pod filling.",
        'soya': "🌱 Soyabean Tips:\n• Pest: Stem Fly is common. Use Thiamethoxam 30 FS.\n• Nutrition: Sulfur is key for oil content. Apply 10kg Sulfur/acre.",

        // FERTILIZERS
        'fertilizer': "🧪 Fertilizer Guide:\n• Basal Dose: DAP + MOP + Urea mix.\n• Growth: Urea + Zinc.\n• Flowering: 0:52:34 spray.\n(Always test soil first!)",
        'khat': "🧪 Fertilizer Guide:\n• Basal Dose: DAP + MOP + Urea mix.\n• Growth: Urea + Zinc.\n(Always test soil first!)",
        'urea': "⚠️ Urea Use: Don't overuse! It makes plants succulent and attracts pests. Split the dose.",

        // MARKET
        'market': "💰 Market Rates (Live):\n• Cotton: ₹6,800 - ₹7,100/quintal\n• Soyabean: ₹4,600 - ₹4,900/quintal\n• Onion: ₹1,200 - ₹1,800/quintal\n(Rates vary by Mandi)",
        'bhav': "💰 Market Rates (Live):\n• Cotton: ₹6,800 - ₹7,100/quintal\n• Soyabean: ₹4,600 - ₹4,900/quintal\n(Rates vary by Mandi)",
        'rate': "💰 Market Rates (Live):\n• Cotton: ₹6,800 - ₹7,100/quintal\n• Soyabean: ₹4,600 - ₹4,900/quintal",

        // SCHEMES
        'loan': "🏦 KCC Scheme: You can get crop loan up to ₹3 Lakh at 4% effective interest rate. Contact nearest cooperative bank.",
        'scheme': "📜 PM Kisan: Get ₹6,000 per year. Check status at pmkisan.gov.in"
    },
    default: {
        'hi-IN': "नमस्ते! (Demo). मी 'कापूस', 'सोयाबीन', 'हवामान', 'बाजार भाव' किंवा 'खत' याबद्दल माहिती देऊ शकतो. प्रश्न विचारा!",
        'en': "Hello! (Demo). ask me about 'Cotton', 'Soyabean', 'Weather', 'Market Rates' or 'Fertilizers'."
    }
};

function getSmartMockResponse(prompt, language) {
    const lowerPrompt = prompt.toLowerCase();

    // 1. SMART MATCHING (Check for multiple keywords in the prompt)
    for (const [key, response] of Object.entries(MOCK_KNOWLEDGE_BASE.keywords)) {
        if (lowerPrompt.includes(key)) {
            // Add a language prefix if needed
            return language.startsWith('hi') || language.startsWith('mr')
                ? `${response} (भाषांतर उपलब्ध)`
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
        await new Promise(resolve => setTimeout(resolve, 600)); // Slight delay for realism
        return getSmartMockResponse(prompt, language);
    }

    // 2. Real API Call (GPT-4o-mini optimized)
    try {
        const systemInstruction = `
        You are "Gram Guru", an expert agricultural AI assistant for Indian farmers.
        
        CONTEXT:
        - User Language: ${language}
        - Location: India (Maharashtra focus)
        - Tone: Respectful, practical, and short.
        
        INSTRUCTIONS:
        1. Answer strictly about Agriculture.
        2. Keep answers concise (under 50 words).
        3. Use bullet points and Emojis.
        `;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: prompt }
            ],
            model: "gpt-3.5-turbo",
            temperature: 0.5,
            max_tokens: 300,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI Error:', error);
        return getSmartMockResponse(prompt, language);
    }
}
