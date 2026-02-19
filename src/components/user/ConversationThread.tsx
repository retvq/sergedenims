"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Message, ConversationStatus } from "@/lib/types";
import MessageBubble from "./MessageBubble";
import OrderDecision from "./OrderDecision";
import ChatInput from "@/components/ui/ChatInput";

interface ConversationThreadProps {
  conversationId: string;
  conversationStatus: ConversationStatus;
  onStatusChange: (status: ConversationStatus) => void;
}

export default function ConversationThread({
  conversationId,
  conversationStatus,
  onStatusChange,
}: ConversationThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const res = await fetch(`/api/messages?conversation_id=${conversationId}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
  };

  useEffect(() => {
    fetchMessages();

    const supabase = createClient();
    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === (payload.new as Message).id);
            if (exists) return prev;
            return [...prev, payload.new as Message];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasPossibleVerdict = messages.some(
    (m) => m.message_type === "review" && m.verdict === "possible"
  );

  return (
    <div className="flex flex-col">
      {/* Messages */}
      <div className="space-y-1 py-4 min-h-[200px]">
        {messages.length === 0 && (
          <p className="text-center text-sm text-sdn-black/40 py-12">
            No messages yet. Share your first design idea below.
          </p>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} perspective="user" />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Order decision */}
      {hasPossibleVerdict && (
        <div className="mb-4">
          <OrderDecision
            conversationId={conversationId}
            currentStatus={conversationStatus}
            onStatusChange={onStatusChange}
          />
        </div>
      )}

      {/* Chat input with attach */}
      <ChatInput
        conversationId={conversationId}
        senderRole="user"
        onMessageSent={fetchMessages}
        placeholder="Type a message or attach a design..."
      />
    </div>
  );
}
