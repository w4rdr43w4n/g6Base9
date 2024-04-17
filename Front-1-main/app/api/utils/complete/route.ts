import { NextResponse } from "next/server";
import axios from "axios";


const API_BASE_URL = 'https://api.chatg6.ai';
export async function POST(request: Request) {
    const { textTocomplete } = await request.json();
    const statement = textTocomplete
    const response = await axios.post(`${API_BASE_URL}/complete/`, { statement});
    console.log(response);
    return NextResponse.json({ aiPrompt: response.data });}