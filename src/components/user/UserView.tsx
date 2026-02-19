"use client";

import { useState, useEffect, useCallback } from "react";
import { User, Conversation, ConversationStatus } from "@/lib/types";
import IdentifyForm from "./IdentifyForm";
import ConversationThread from "./ConversationThread";

export default function UserView() {
  const [user, setUser] = useState<User | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("sdn_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem("sdn_user");
      }
    }
    setLoading(false);
  }, []);

  const initConversation = useCallback(async (userId: string) => {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });

    if (res.ok) {
      const conv = await res.json();
      setConversation(conv);
    }
  }, []);

  useEffect(() => {
    if (user) {
      initConversation(user.id);
    }
  }, [user, initConversation]);

  const handleIdentified = (identifiedUser: User) => {
    setUser(identifiedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("sdn_user");
    setUser(null);
    setConversation(null);
  };

  const handleStatusChange = (status: ConversationStatus) => {
    if (conversation) {
      setConversation({ ...conversation, status });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-sdn-teal border-t-transparent animate-spin" style={{ borderRadius: "50%" }} />
      </div>
    );
  }

  if (!user) {
    return <IdentifyForm onIdentified={handleIdentified} />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* User info bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-semibold text-sdn-black">{user.name}</p>
          <p className="text-xs text-sdn-black/50">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-sdn-black/50 hover:text-sdn-black underline"
        >
          Not you?
        </button>
      </div>

      {/* Conversation thread with built-in chat input */}
      {conversation && (
        <ConversationThread
          conversationId={conversation.id}
          conversationStatus={conversation.status}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
