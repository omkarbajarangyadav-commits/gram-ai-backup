import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
let openai = null;

if (apiKey && !apiKey.includes('your-openai-api-key')) {
    openai = new OpenAI({
        apiKey: apiKey,
    });
}

// Mock Responses for Demo Mode
const MOCK_RESPONSES = {
    'hi-IN': {
        default: "नमस्ते! मी तुमचा ग्राम गुरु आहे. (Demo Mode: OpenAI Key not found). खऱ्या उत्तरांसाठी कृपया API Key जोडा. तोपर्यंत मी तुम्हाला मूलभूत माहिती देऊ शकतो.",
        keywords: {
            'नमस्ते': "राम राम! कसे आहात आपण?",
            'हवामान': "आजचे हवामान कोरडे राहील. पाऊस पडण्याची शक्यता कमी आहे.",
            'सोयाबीन': "सोयाबीनसाठी हे महत्वाचे: \n- वेळोवेळी तण काढणे आवश्यक आहे.\n- 15 दिवसांनी निंबोळी अर्काची फवारणी करा.",
            'कापूस': "कापूस पिकावर बोंडअळीचा प्रादुर्भाव होऊ शकतो. कामगंध सापळे वापरा.",
            'खत': "शेणखत आणि गांडूळ खत जमिनीचा पोत सुधारण्यासाठी उत्तम आहेत."
        }
    },
    'mr-IN': {
        default: "नमस्कार! मी आपला ग्राम गुरु (डेमो मोड). कृपया अचूक माहितीसाठी API Key सेट करा.",
        keywords: {
            'नमस्कार': "राम राम मंडळी! बोला, काय मदत करू?",
            'पाऊस': "पुढील २ दिवस पावसाची शक्यता नाही. पेरणीसाठी ही योग्य वेळ आहे.",
            'खत': "जमिनीची सुपीकता वाढवण्यासाठी सेंद्रिय खतांचा वापर करा.",
            'कीड': "कीड नियंत्रणासाठी निंबोळी अर्क ५% फवारणी करा."
        }
    }
};

function getMockResponse(prompt, language) {
    const langData = MOCK_RESPONSES[language] || MOCK_RESPONSES['hi-IN'];

    // Simple keyword matching
    for (const [key, value] of Object.entries(langData.keywords)) {
        if (prompt.includes(key)) return value;
    }

    return langData.default;
}

export async function generateAIResponse(prompt, language = 'hi-IN') {
    // 1. If No API Key -> Use Mock Mode
    if (!openai) {
        console.warn("OpenAI API Key missing. Using Mock Mode.");
        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 1500));
        return getMockResponse(prompt, language);
    }

    // 2. Real API Call
    try {
        const systemInstruction = `
        You are "Gram Guru", a friendly agricultural advisor.
        - Language: ${language === 'mr-IN' ? 'Marathi' : 'Hindi'}.
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
        return language === 'mr-IN'
            ? 'क्षमा करा, मला संपर्क साधता आला नाही. पुन्हा प्रयत्न करा.'
            : 'माफ़ क्षमा करें, संपर्क स्थापित नहीं हो सका। कृपया पुनः प्रयास करें।';
    }
}
