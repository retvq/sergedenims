import { createClient } from "@/lib/supabase/server";
import { getAIProvider } from "@/lib/ai/provider";
import { NextRequest, NextResponse } from "next/server";

// Allow up to 60s for image detection
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { sessionId, imageUrl } = await request.json();

    if (!sessionId || !imageUrl) {
      return NextResponse.json({ error: "sessionId and imageUrl required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }

    const supabase = await createClient();
    const ai = getAIProvider();

    const detection = await ai.detectClothing(imageUrl);

    const { error } = await supabase
      .from("design_sessions")
      .update({
        detected_category: detection.category,
        clothing_description: detection.description,
        status: "browsing",
      })
      .eq("id", sessionId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(detection);
  } catch (err: unknown) {
    console.error("Detect error:", err);
    const message = err instanceof Error ? err.message : "Detection failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
