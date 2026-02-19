"use client";

import { Conversation } from "@/lib/types";

interface ConversationCardProps {
  conversation: Conversation;
  unreadCount: number;
  isNew: boolean;
  onClick: () => void;
}

export default function ConversationCard({ conversation, unreadCount, isNew, onClick }: ConversationCardProps) {
  const statusConfig = {
    open: { label: "Open", color: "bg-sdn-teal" },
    order_accepted: { label: "Accepted", color: "bg-sdn-teal" },
    order_declined: { label: "Declined", color: "bg-sdn-black/40" },
  };

  const status = statusConfig[conversation.status];
  const time = new Date(conversation.updated_at).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <button
      onClick={onClick}
      className={`w-full text-left border bg-white p-4 hover:shadow-md transition-shadow ${
        unreadCount > 0 ? "border-sdn-teal" : "border-sdn-gray-border"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div>
            <p className="font-semibold text-sdn-black">
              {conversation.user?.name || "Unknown User"}
            </p>
            <p className="text-xs text-sdn-black/50 mt-0.5">
              {conversation.user?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isNew && (
            <span className="px-2 py-0.5 text-xs font-bold text-white uppercase tracking-wider bg-sdn-amber">
              New
            </span>
          )}
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-xs font-bold text-white bg-sdn-red">
              {unreadCount}
            </span>
          )}
          <span className={`px-2 py-0.5 text-xs font-semibold text-white uppercase tracking-wider ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>
      <p className="text-xs text-sdn-black/40 mt-2">
        Last activity: {time}
      </p>
    </button>
  );
}
