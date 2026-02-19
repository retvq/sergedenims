"use client";

import { useEffect, useState, useCallback } from "react";
import { Conversation, Message } from "@/lib/types";
import ConversationCard from "./ConversationCard";

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
}

function getAdminReadTimestamps(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem("sdn_admin_read") || "{}");
  } catch {
    return {};
  }
}

export function markConversationRead(conversationId: string) {
  const timestamps = getAdminReadTimestamps();
  timestamps[conversationId] = new Date().toISOString();
  localStorage.setItem("sdn_admin_read", JSON.stringify(timestamps));
}

export default function ConversationList({ onSelectConversation }: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [neverOpened, setNeverOpened] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchConversations = useCallback(async () => {
    const res = await fetch("/api/conversations");
    if (!res.ok) { setLoading(false); return; }
    const convs: Conversation[] = await res.json();
    setConversations(convs);

    // Fetch unread counts for each conversation
    const readTimestamps = getAdminReadTimestamps();
    const counts: Record<string, number> = {};
    const isNew: Record<string, boolean> = {};

    await Promise.all(
      convs.map(async (conv) => {
        const msgRes = await fetch(`/api/messages?conversation_id=${conv.id}`);
        if (!msgRes.ok) return;
        const messages: Message[] = await msgRes.json();

        const lastRead = readTimestamps[conv.id];
        const hasAdminMessages = messages.some((m) => m.sender_role === "admin");

        // "New" only when admin has never responded to this conversation
        isNew[conv.id] = !hasAdminMessages;

        if (!lastRead) {
          counts[conv.id] = messages.filter((m) => m.sender_role === "user").length;
        } else {
          counts[conv.id] = messages.filter(
            (m) => m.sender_role === "user" && new Date(m.created_at) > new Date(lastRead)
          ).length;
        }
      })
    );

    setUnreadCounts(counts);
    setNeverOpened(isNew);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  const handleSelect = (conv: Conversation) => {
    markConversationRead(conv.id);
    onSelectConversation(conv);
  };

  const filtered = conversations.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.user?.name?.toLowerCase().includes(q) ||
      c.user?.email?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-sdn-teal border-t-transparent animate-spin" style={{ borderRadius: "50%" }} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-lg font-bold tracking-wide text-sdn-black uppercase mb-4">
        Design Requests
      </h2>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        className="w-full px-3 py-2.5 border border-sdn-black/20 bg-white text-sm text-sdn-black placeholder:text-sdn-black/30 focus:outline-none focus:border-sdn-teal transition-colors mb-4"
      />

      {/* List */}
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-sdn-black/40 py-12">
          {conversations.length === 0
            ? "No design requests yet. Waiting for customers..."
            : "No results matching your search."}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((conv) => (
            <ConversationCard
              key={conv.id}
              conversation={conv}
              unreadCount={unreadCounts[conv.id] || 0}
              isNew={neverOpened[conv.id] || false}
              onClick={() => handleSelect(conv)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
