"use client";

import { useState, useRef } from "react";

interface ChatInputProps {
  conversationId: string;
  senderRole: "user" | "admin";
  onMessageSent: () => void;
  placeholder?: string;
}

export default function ChatInput({
  conversationId,
  senderRole,
  onMessageSent,
  placeholder = "Type a message...",
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasContent = text.trim().length > 0 || file !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasContent || sending) return;

    setSending(true);
    try {
      let fileData = { file_url: null as string | null, file_name: null as string | null, file_type: null as string | null };

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("conversation_id", conversationId);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const data = await uploadRes.json();
          throw new Error(data.error || "Failed to upload file");
        }

        fileData = await uploadRes.json();
      }

      const messageType = file
        ? "design_upload"
        : senderRole === "user"
          ? "user_text"
          : "admin_text";

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          sender_role: senderRole,
          message_type: messageType,
          body: text.trim() || null,
          file_url: fileData.file_url,
          file_name: fileData.file_name,
          file_type: fileData.file_type,
        }),
      });

      if (res.ok) {
        setText("");
        setFile(null);
        onMessageSent();
      }
    } catch {
      // silently fail for demo
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      {/* File preview strip */}
      {file && (
        <div className="flex items-center gap-2 px-3 py-2 bg-sdn-gray border border-b-0 border-sdn-gray-border">
          <svg className="w-4 h-4 text-sdn-teal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <span className="text-xs text-sdn-black truncate flex-1">{file.name}</span>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="text-xs text-sdn-red hover:underline shrink-0"
          >
            Remove
          </button>
        </div>
      )}

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-0 border border-sdn-gray-border">
        {/* Pin/Attach button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2.5 text-sdn-black/40 hover:text-sdn-teal transition-colors"
          title="Attach file"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setFile(f);
            e.target.value = "";
          }}
        />

        {/* Text input */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-2 py-2.5 bg-transparent text-sm text-sdn-black placeholder:text-sdn-black/30 focus:outline-none"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={sending || !hasContent}
          className="px-4 py-2.5 bg-sdn-teal text-white text-sm font-semibold uppercase tracking-wider hover:bg-sdn-teal/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {sending ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
