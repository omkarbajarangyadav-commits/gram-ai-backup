import OpenAI from "openai";

// Server-side only
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
