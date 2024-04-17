import { NextResponse } from "next/server";
import axios from "axios";
import { resolve } from "path";


export async function POST(request: Request) {
    const { textToParaphrase } = await request.json();
    //console.log(request)
    const open_ai_key = process.env.NEXT_PUBLIC_OPEN_AI_KEY
    //console.log(suggest)
    // Corrected the URL and removed unnecessary quotes
    const options = {
        method: "POST",
        url: "https://api.openai.com/v1/chat/completions",
        data: {
            model: 'gpt-4',
            messages: [
                {'role': 'system', 'content': 'You are a helpful assistant.'},
                {'role': 'user', 'content': `Rephrase the following paragraph:\n${textToParaphrase}`}
            ]
        },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${open_ai_key}`
        },
    };

    try {
        const response = await axios(options);

        // Corrected the response handling based on the expected structure
        const rephrasedText = response.data.choices[0].message.content;
        //console.log(rephrasedText);
        return NextResponse.json({ aiPrompt: rephrasedText });
    } catch (error) {
        console.error(error);
        // Return a generic error message or handle the error as needed
        return NextResponse.json({ error: "An error occurred while rephrasing the text." });
    }
}

