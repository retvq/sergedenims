import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const conversationId = request.nextUrl.searchParams.get("conversation_id");

  if (!conversationId) {
    return NextResponse.json({ error: "conversation_id is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const {
    conversation_id,
    sender_role,
    message_type,
    body: messageBody,
    file_url,
    file_name,
    file_type,
    link_url,
    verdict,
  } = body;

  if (!conversation_id || !sender_role || !message_type) {
    return NextResponse.json(
      { error: "conversation_id, sender_role, and message_type are required" },
      { status: 400 }
    );
  }

  // Validate review messages
  if (message_type === "review") {
    if (!verdict) {
      return NextResponse.json({ error: "Verdict is required for reviews" }, { status: 400 });
    }
    if (verdict === "depends" && (!messageBody || messageBody.trim().length === 0)) {
      return NextResponse.json(
        { error: "Message is mandatory when verdict is 'Depends'" },
        { status: 400 }
      );
    }
    if (messageBody && messageBody.length > 500) {
      return NextResponse.json(
        { error: "Review message must be 500 characters or less" },
        { status: 400 }
      );
    }
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id,
      sender_role,
      message_type,
      body: messageBody || null,
      file_url: file_url || null,
      file_name: file_name || null,
      file_type: file_type || null,
      link_url: link_url || null,
      verdict: verdict || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Only bump conversation's updated_at for user messages
  // so admin replies don't make the conversation appear "new" to admin
  if (sender_role === "user") {
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversation_id);
  }

  return NextResponse.json(data);
}
