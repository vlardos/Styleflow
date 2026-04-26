import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      groq: !!process.env.GROQ_API_KEY,
      weather: true, // open-meteo requires no API key
      products: true,
    },
    version: "1.0.0",
  });
}
