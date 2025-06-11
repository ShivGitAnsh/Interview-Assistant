import { QUESTIONS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
    const { jobPosition, jobDescription, Duration, type } = await req.json();

    const FINAL_PROMPT = QUESTIONS_PROMPT
    .replace('{{jobTitle}}', jobPosition)
    .replace('{{jobDescription}}', jobDescription)
    .replace('{{Duration}}', Duration)
    .replace('{{type}}', type)

    try{
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
    })

    const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
            { role: "user", content: FINAL_PROMPT }
        ],
        
    })
return NextResponse.json({ content: completion.choices[0].message.content })
}catch(e){
    console.log(e);
    return NextResponse.json(e);
}
}