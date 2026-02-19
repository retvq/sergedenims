"use client";

import { Message } from "@/lib/types";
import Badge from "@/components/ui/Badge";

interface MessageBubbleProps {
  message: Message;
  perspective?: "user" | "admin";
}

export default function MessageBubble({ message, perspective = "user" }: MessageBubbleProps) {
  // "self" = the person viewing the chat sent this message
  const isSelf =
    (perspective === "user" && message.sender_role === "user") ||
    (perspective === "admin" && message.sender_role === "admin");

  const time = new Date(message.created_at).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const senderLabel =
    message.sender_role === "user" ? "Customer" : "Serge De Nimes";

  return (
    <div className={`flex ${isSelf ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] ${
          isSelf
            ? "bg-sdn-black text-white"
            : "bg-sdn-gray text-sdn-black border border-sdn-gray-border"
        }`}
      >
        {/* Review verdict */}
        {message.message_type === "review" && message.verdict && (
          <div className="px-4 pt-4 pb-2">
            <Badge verdict={message.verdict} />
          </div>
        )}

        {/* File preview */}
        {message.file_url && (
          <div className="px-4 pt-4">
            {message.file_type?.startsWith("image/") ? (
              <a href={message.file_url} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={message.file_url}
                  alt={message.file_name || "Design reference"}
                  className="max-w-full max-h-64 object-contain border border-sdn-gray-border"
                />
              </a>
            ) : (
              <a
                href={message.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-3 py-2 border ${
                  isSelf ? "border-white/20 hover:bg-white/10" : "border-sdn-gray-border bg-white hover:bg-sdn-gray"
                } transition-colors`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-sm truncate">{message.file_name}</span>
              </a>
            )}
          </div>
        )}

        {/* Link reference */}
        {message.link_url && (
          <div className="px-4 pt-3">
            <a
              href={message.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm underline ${isSelf ? "text-sdn-teal-light" : "text-sdn-teal"}`}
            >
              {message.link_url}
            </a>
          </div>
        )}

        {/* Text body */}
        {message.body && (
          <p className="px-4 pt-3 text-sm whitespace-pre-wrap">{message.body}</p>
        )}

        {/* Timestamp */}
        <p className={`px-4 py-2 text-xs ${isSelf ? "text-white/50" : "text-sdn-black/40"}`}>
          {isSelf ? "You" : senderLabel} &middot; {time}
        </p>
      </div>
    </div>
  );
}
