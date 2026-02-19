import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const userId = request.nextUrl.searchParams.get("user_id");

  if (userId) {
    // Get single conversation for a user
    const { data, error } = await supabase
      .from("conversations")
      .select("*, user:users(*)")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  }

  // Get all conversations (admin view)
  const { data, error } = await supabase
    .from("conversations")
    .select("*, user:users(*)")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { user_id } = await request.json();

  if (!user_id) {
    return NextResponse.json({ error: "user_id is required" }, { status: 400 });
  }

  // Check if conversation already exists for this user
  const { data: existing } = await supabase
    .from("conversations")
    .select("*, user:users(*)")
    .eq("user_id", user_id)
    .single();

  if (existing) {
    return NextResponse.json(existing);
  }

  // Create new conversation
  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id, status: "open" })
    .select("*, user:users(*)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { id, status } = await request.json();

  if (!id || !status) {
    return NextResponse.json({ error: "id and status are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("conversations")
    .update({ status })
    .eq("id", id)
    .select("*, user:users(*)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
