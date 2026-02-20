import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  // Upload to design-assets bucket
  const fileExt = file.name.split(".").pop();
  const uniqueName = `clothing/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("design-assets")
    .upload(uniqueName, file);

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from("design-assets")
    .getPublicUrl(uniqueName);

  const clothingImageUrl = urlData.publicUrl;

  // Create design session
  const { data: session, error: sessionError } = await supabase
    .from("design_sessions")
    .insert({ clothing_image_url: clothingImageUrl, status: "uploading" })
    .select()
    .single();

  if (sessionError) {
    return NextResponse.json({ error: sessionError.message }, { status: 500 });
  }

  return NextResponse.json({
    sessionId: session.id,
    clothingImageUrl,
  });
}
