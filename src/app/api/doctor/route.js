import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Ensure this environment variable is set
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Configure the route to handle larger payloads since base64 strings get big
export const maxDuration = 30; // 30 seconds timeout for OpenAI

export async function POST(req) {
    try {
        const body = await req.json();
        const { imageBase64 } = body;

        if (!imageBase64) {
            return NextResponse.json({ error: "Missing image data" }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your-openai-api-key')) {
            return NextResponse.json({
                disease: "API Key Required",
                confidence: "0%",
                treatment: ["Please add your OPENAI_API_KEY to .env.local to use real-world crop analysis."],
                severity: "High"
            }, { status: 200 }); // Mock response if no key is set so the UI doesn't crash completely.
        }

        // Call the OpenAI Vision API
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `You are an expert agronomist AI specializing in crop pathology. Analyze the user's plant image and return a JSON object containing the disease diagnosis and treatment plan. 
                    Format EXACTLY like this:
                    {
                        "disease": "Name of the disease or 'Healthy Plant'",
                        "confidence": "XX%", 
                        "treatment": [
                            "Step 1 to treat or prevent",
                            "Step 2",
                            "Step 3"
                        ],
                        "severity": "Low/Moderate/High/Critical"
                    }
                    If the image is not a plant, return disease as "Not a Plant".`
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Please analyze this crop image." },
                        {
                            type: "image_url",
                            image_url: {
                                "url": imageBase64,
                                "detail": "auto"
                            },
                        },
                    ],
                },
            ],
            max_tokens: 500,
        });

        const jsonResult = JSON.parse(response.choices[0].message.content);
        return NextResponse.json(jsonResult, { status: 200 });

    } catch (error) {
        console.error("OpenAI API Error:", error);
        return NextResponse.json(
            { error: "Failed to process image analysis." },
            { status: 500 }
        );
    }
}
