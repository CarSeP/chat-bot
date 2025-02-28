import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { API_TOKEN, API_URL } from "@/config";

const temp = 0.1;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const prompt = searchParams.get("prompt");

  if (!prompt) {
    return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
  }

  const data = {
    inputs: prompt,
    parameters: {
      temperature: temp,
    },
  };

  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({ data: response.data[0].generated_text }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
