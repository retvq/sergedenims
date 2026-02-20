import { createClient } from "@/lib/supabase/server";
import { getAIProvider } from "@/lib/ai/provider";
import { buildSamplePrompt, buildCustomPrompt, appendRegenerationFeedback } from "@/lib/ai/prompts";
import { NextRequest, NextResponse } from "next/server";
import type { StyleKey, PathType } from "@/lib/types";

// Allow up to 120s for image generation pipeline
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      pathType,
      sampleKey,
      customInstructions,
      customReferenceUrl,
      regenerationFeedback,
    } = body as {
      sessionId: string;
      pathType: PathType;
      sampleKey?: StyleKey;
      customInstructions?: string;
      customReferenceUrl?: string;
      regenerationFeedback?: string;
    };

    if (!sessionId || !pathType) {
      return NextResponse.json({ error: "sessionId and pathType required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }

    const supabase = await createClient();

    const { data: session, error: fetchError } = await supabase
      .from("design_sessions")
      .select()
      .eq("id", sessionId)
      .single();

    if (fetchError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.generation_count >= 5) {
      return NextResponse.json({ error: "Maximum generations reached (5)" }, { status: 400 });
    }

    if (!session.detected_category || !session.clothing_description) {
      return NextResponse.json({ error: "Detection not completed" }, { status: 400 });
    }

    let prompt: string;
    if (pathType === "sample" && sampleKey) {
      prompt = buildSamplePrompt(session.detected_category, session.clothing_description, sampleKey);
    } else if (pathType === "custom" && customInstructions) {
      prompt = buildCustomPrompt(
        session.detected_category,
        session.clothing_description,
        customInstructions,
        !!customReferenceUrl
      );
    } else {
      return NextResponse.json({ error: "Invalid generation parameters" }, { status: 400 });
    }

    // Append regeneration feedback if provided
    prompt = appendRegenerationFeedback(prompt, regenerationFeedback);

    const ai = getAIProvider();
    const result = await ai.generateDesign({
      clothingImageUrl: session.clothing_image_url,
      clothingDescription: session.clothing_description,
      garmentType: session.detected_category,
      pathType,
      stylePrompt: prompt,
      customReferenceUrl,
      previousDesignUrl: regenerationFeedback ? (session.current_design_url || undefined) : undefined,
    });

    // Upload the generated image to Supabase Storage
    const base64Data = result.imageUrl.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");
    const fileName = `generated/${sessionId}/${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from("design-assets")
      .upload(fileName, imageBuffer, { contentType: "image/png" });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("design-assets")
      .getPublicUrl(fileName);

    const generatedImageUrl = urlData.publicUrl;
    const newCount = session.generation_count + 1;

    await supabase.from("generations").insert({
      session_id: sessionId,
      attempt_number: newCount,
      prompt_used: prompt,
      result_image_url: generatedImageUrl,
    });

    const pricingCategory = pathType === "sample" ? sampleKey : "custom";
    await supabase
      .from("design_sessions")
      .update({
        path_type: pathType,
        selected_sample_key: pathType === "sample" ? sampleKey : null,
        custom_instructions: pathType === "custom" ? customInstructions : null,
        custom_reference_url: pathType === "custom" ? (customReferenceUrl || null) : null,
        current_design_url: generatedImageUrl,
        generation_count: newCount,
        pricing_category: pricingCategory,
        status: "generating",
      })
      .eq("id", sessionId);

    return NextResponse.json({
      imageUrl: generatedImageUrl,
      generationCount: newCount,
      maxGenerations: 5,
    });
  } catch (err: unknown) {
    console.error("Generate error:", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
