import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body?.message ?? "").trim();

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    // Very small mock responder: echo + helpful hint
    const reply = `Assistant: I received your message "${message}". How can I help further?`;

    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
