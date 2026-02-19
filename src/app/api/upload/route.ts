import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const conversationId = formData.get("conversation_id") as string;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  const fileExt = file.name.split(".").pop();
  const uniqueName = `${conversationId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("design-uploads")
    .upload(uniqueName, file);

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from("design-uploads")
    .getPublicUrl(uniqueName);

  return NextResponse.json({
    file_url: urlData.publicUrl,
    file_name: file.name,
    file_type: file.type,
  });
}
