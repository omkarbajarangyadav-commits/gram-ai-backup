'use server';

import openai from '@/lib/openai';
import { createClient } from '@/lib/supabase/server';

export async function submitDiseaseImage(base64Image) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error("Unauthorized access. Please log in.");
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "You are an expert agronomist. Identify the disease from this crop image. Respond strictly in JSON format matching this schema: { disease: string, confidence: number (0-100), severity: 'Low' | 'Moderate' | 'High', treatment: string[] }" },
                        {
                            type: "image_url",
                            image_url: {
                                url: base64Image,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 300,
        });

        const aiResult = JSON.parse(response.choices[0].message.content);

        // Save scan to DB
        await supabase.from('disease_scans').insert([
            {
                farmer_id: user.id,
                image_url: "uploaded-image-url", // Ideally upload to S3/Supabase Storage first
                ai_prediction: aiResult
            }
        ]);

        return { success: true, data: aiResult };
    } catch (error) {
        console.error("AI Scan Error:", error);
        return { success: false, error: "Failed to scan image. Ensure you are on the Pro plan." };
    }
}
