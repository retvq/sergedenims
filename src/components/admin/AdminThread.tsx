"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Message, Conversation } from "@/lib/types";
import MessageBubble from "@/components/user/MessageBubble";
import ChatInput from "@/components/ui/ChatInput";
import ReviewForm from "./ReviewForm";
import { markConversationRead } from "./ConversationList";

interface AdminThreadProps {
  conversation: Conversation;
  onBack: () => void;
}

export default function AdminThread({ conversation, onBack }: AdminThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [convStatus, setConvStatus] = useState(conversation.status);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const res = await fetch(`/api/messages?conversation_id=${conversation.id}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    markConversationRead(conversation.id);
    fetchMessages();

    const supabase = createClient();
    const msgChannel = supabase
      .channel(`admin-messages-${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === (payload.new as Message).id);
            if (exists) return prev;
            return [...prev, payload.new as Message];
          });
          markConversationRead(conversation.id);
        }
      )
      .subscribe();

    const convChannel = supabase
      .channel(`admin-conv-status-${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `id=eq.${conversation.id}`,
        },
        (payload) => {
          const updated = payload.new as Conversation;
          setConvStatus(updated.status);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(convChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasExistingReview = messages.some((m) => m.message_type === "review");
  const orderDecided = convStatus === "order_accepted" || convStatus === "order_declined";

  const statusLabel = {
    open: "Open",
    order_accepted: "Order Accepted",
    order_declined: "Order Declined",
  }[convStatus];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-sdn-teal hover:underline"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to list
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-sdn-black/50">
          {statusLabel}
        </span>
      </div>

      {/* Customer info */}
      <div className="border border-sdn-gray-border bg-sdn-gray p-4 mb-4">
        <p className="font-semibold text-sdn-black">{conversation.user?.name}</p>
        <p className="text-xs text-sdn-black/50">{conversation.user?.email}</p>
        <p className="text-xs text-sdn-black/40 mt-1">
          Conversation started {new Date(conversation.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Messages */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-sdn-teal border-t-transparent animate-spin" style={{ borderRadius: "50%" }} />
        </div>
      ) : (
        <div className="space-y-1 py-4 min-h-[200px]">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} perspective="admin" />
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Order status banner */}
      {convStatus === "order_accepted" && (
        <div className="border-2 border-sdn-teal bg-sdn-teal-light p-4 mb-4">
          <p className="text-sm font-semibold text-sdn-teal">
            Customer has confirmed the order
          </p>
          <p className="text-xs text-sdn-teal/70 mt-1">
            This customer has agreed to proceed. Please coordinate next steps for their custom design.
          </p>
        </div>
      )}
      {convStatus === "order_declined" && (
        <div className="border border-sdn-gray-border bg-sdn-gray p-4 mb-4">
          <p className="text-sm font-semibold text-sdn-black/60">
            Customer has declined the order
          </p>
          <p className="text-xs text-sdn-black/40 mt-1">
            The customer chose not to proceed at this time. The conversation remains open for future requests.
          </p>
        </div>
      )}

      {/* Review form - only when order is not decided */}
      {!orderDecided && (
        <div className="mb-4">
          <ReviewForm
            conversationId={conversation.id}
            hasExistingReview={hasExistingReview}
            onReviewSent={fetchMessages}
          />
        </div>
      )}

      {/* Plain chat input - always shown (with attach) */}
      {orderDecided && (
        <ChatInput
          conversationId={conversation.id}
          senderRole="admin"
          onMessageSent={fetchMessages}
          placeholder="Send a message..."
        />
      )}
    </div>
  );
}
