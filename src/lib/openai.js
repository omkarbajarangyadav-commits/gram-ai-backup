import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
let openai = null;

if (apiKey && !apiKey.includes('your-openai-api-key')) {
    openai = new OpenAI({
        apiKey: apiKey,
    });
}

// Mock Responses for Demo Mode (Expanded for "Hinglish" / Romanized inputs)
const MOCK_RESPONSES = {
    'hi-IN': {
        default: "नमस्ते! (Demo Mode). खऱ्या उत्तरांसाठी API Key जोडा. \nमी 'सोयाबीन', 'कापूस', 'हवामान', 'बाजार भाव' याबद्दल माहिती देऊ शकतो.",
        keywords: {
            'नमस्ते': "राम राम! कसे आहात?",
            'hello': "नमस्ते! मी स्मार्ट फार्म असिस्टंट आहे.",
            'weather': "आजचे हवामान कोरडे राहील. (28°C).",
            'havaman': "आजचे हवामान कोरडे राहील. (28°C).",
            'हवामान': "आजचे हवामान कोरडे राहील. (28°C).",
            'soyabean': "सोयाबीन टीप: \n- 15 दिवसांनी निंबोळी अर्काची फवारणी करा.\n- तण काढणे आवश्यक आहे.",
            'soya': "सोयाबीन पिकासाठी ओलावा टिकवून ठेवणे गरजेचे आहे.",
            'सोयाबीन': "सोयाबीन टीप: \n- 15 दिवसांनी निंबोळी अर्काची फवारणी करा.",
            'cotton': "कापूस पिकावर बोंडअळीचा प्रादुर्भाव होऊ शकतो. कामगंध सापळे वापरा.",
            'kapus': "कापूस पिकावर बोंडअळीचा प्रादुर्भाव होऊ शकतो. कामगंध सापळे वापरा.",
            'कापूस': "कापूस पिकावर बोंडअळीचा प्रादुर्भाव होऊ शकतो.",
            'khad': "सेंद्रिय खत (शेणखत) सर्वोत्तम आहे.",
            'fertilizer': "सेंद्रिय खत (शेणखत) सर्वोत्तम आहे.",
            'market': "आजचे बाजार भाव:\n- सोयाबीन: ₹4,800\n- कापूस: ₹6,950",
            'bhav': "आजचे बाजार भाव:\n- सोयाबीन: ₹4,800\n- कापूस: ₹6,950"
        }
    },
    'hi-en': {
        default: "Namaste! (Demo Mode). Main 'Soyabean', 'Cotton', 'Weather', 'Market rate' ke baare mein bata sakta hoon.",
        keywords: {
            'namaste': "Ram Ram! Kaise ho aap?",
            'hello': "Namaste! Main aapka Krushi Mitra hoon.",
            'weather': "Aaj mausam saaf rahega. (28°C).",
            'mausam': "Aaj mausam saaf rahega. (28°C).",
            'barish': "Agale 2 din baarish ki sambhavna nahi hai.",
            'rain': "Agale 2 din baarish ki sambhavna nahi hai.",
            'soyabean': "Soyabean tips:\n- 15 din baad Nimboli ark ka spray karein.\n- Tan (weeds) nikalna zaroori hai.",
            'soya': "Soyabean ke liye nami (moisture) zaroori hai.",
            'cotton': "Cotton (Kapas) me pink bollworm ka khatra ho sakta hai. Pheromone traps lagayein.",
            'kapas': "Cotton (Kapas) me pink bollworm ka khatra ho sakta hai. Pheromone traps lagayein.",
            'fertilizer': "Organic khad (Cow dung) sabse best hai.",
            'khad': "Organic khad (Cow dung) sabse best hai.",
            'market': "Aaj ke Market Rates:\n- Soyabean: ₹4,800\n- Cotton: ₹6,950",
            'bhav': "Aaj ke Market Rates:\n- Soyabean: ₹4,800\n- Cotton: ₹6,950",
            'rate': "Aaj ke Market Rates:\n- Soyabean: ₹4,800\n- Cotton: ₹6,950"
        }
    }
};

function getMockResponse(prompt, language) {
    const lowerPrompt = prompt.toLowerCase();

    // Determine language key
    let langKey = 'hi-IN'; // Default
    if (language === 'mr-IN') langKey = 'mr-IN';
    if (language === 'hi-en') langKey = 'hi-en';

    const langData = MOCK_RESPONSES[langKey];

    // Check keywords
    for (const [key, value] of Object.entries(langData.keywords)) {
        if (lowerPrompt.includes(key)) return value;
    }

    return langData.default;
}

export async function generateAIResponse(prompt, language = 'hi-IN') {
    // 1. If No API Key -> Use Mock Mode
    if (!openai) {
        console.warn("OpenAI API Key missing. Using Mock Mode.");
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1s delay for realism
        return getMockResponse(prompt, language);
    }

    // 2. Real API Call
    try {
        const systemInstruction = `
        You are "Gram Guru", a friendly agricultural advisor.
        - Language: ${language === 'mr-IN' ? 'Marathi' : (language === 'hi-en' ? 'Hinglish' : 'Hindi')}.
        - Role: Village Elder / Agri Expert.
        - Rules: Concise, bullet points, organic first.
        `;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: prompt }
            ],
            model: "gpt-3.5-turbo",
            temperature: 0.7,
            max_tokens: 300,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI Error:', error);
        return getMockResponse(prompt, language); // Fallback to mock on error
    }
}
