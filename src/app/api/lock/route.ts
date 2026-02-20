import { createClient } from "@/lib/supabase/server";
import { getPrice, getPricingLabel } from "@/lib/samples/pricing";
import { NextRequest, NextResponse } from "next/server";
import type { ClothingCategory, StyleKey } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: session, error } = await supabase
      .from("design_sessions")
      .select()
      .eq("id", sessionId)
      .single();

    if (error || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const pricingKey = (session.pricing_category || "custom") as StyleKey | "custom";
    const garmentType = session.detected_category as ClothingCategory;
    const price = getPrice(pricingKey, garmentType);
    const label = getPricingLabel(pricingKey);

    await supabase
      .from("design_sessions")
      .update({ is_locked: true, status: "priced" })
      .eq("id", sessionId);

    return NextResponse.json({
      pricingCategory: pricingKey,
      price,
      label,
      description: `${label} customization on your ${garmentType.replace("_", " ")}`,
    });
  } catch (err: unknown) {
    console.error("Lock error:", err);
    const message = err instanceof Error ? err.message : "Lock failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
