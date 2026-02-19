"use client";

import { useState } from "react";
import FileDropzone from "@/components/ui/FileDropzone";

interface UploadFormProps {
  conversationId: string;
  onMessageSent: () => void;
}

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function UploadForm({ conversationId, onMessageSent }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasFile = !!file;
  const hasLink = linkUrl.trim().length > 0;
  const hasMessage = message.trim().length >= 50;
  const canSubmit = hasFile || (hasLink && isValidUrl(linkUrl.trim())) || hasMessage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasFile && !hasLink && !message.trim()) {
      setError("Please upload a file, share a link, or write a message (min 50 characters)");
      return;
    }
    if (hasLink && !isValidUrl(linkUrl.trim())) {
      setError("Please enter a valid URL (e.g. https://example.com)");
      return;
    }
    if (!hasFile && !hasLink && message.trim().length > 0 && message.trim().length < 50) {
      setError(`Message must be at least 50 characters (currently ${message.trim().length})`);
      return;
    }
    if (message.trim().length > 500) {
      setError(`Message must be 500 characters or less (currently ${message.trim().length})`);
      return;
    }

    setError("");
    setLoading(true);

    try {
      let fileData = { file_url: null as string | null, file_name: null as string | null, file_type: null as string | null };

      // Upload file if present
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

      // Determine message type
      const hasAttachment = file || linkUrl.trim();
      const messageType = hasAttachment ? "design_upload" : "user_text";

      // Create message
      const msgRes = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          sender_role: "user",
          message_type: messageType,
          body: message.trim() || null,
          file_url: fileData.file_url,
          file_name: fileData.file_name,
          file_type: fileData.file_type,
          link_url: linkUrl.trim() || null,
        }),
      });

      if (!msgRes.ok) {
        const data = await msgRes.json();
        throw new Error(data.error || "Failed to send message");
      }

      // Reset form
      setFile(null);
      setMessage("");
      setLinkUrl("");
      onMessageSent();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-sdn-gray-border bg-white p-4 space-y-3">
      <FileDropzone
        onFileSelect={setFile}
        selectedFile={file}
        onClear={() => setFile(null)}
      />

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-sdn-black/50 mb-1">
          Reference Link <span className="normal-case font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://example.com/design-reference"
          className={`w-full px-3 py-2 border bg-white text-sm text-sdn-black placeholder:text-sdn-black/30 focus:outline-none transition-colors ${
            hasLink && !isValidUrl(linkUrl.trim())
              ? "border-sdn-red focus:border-sdn-red"
              : "border-sdn-black/20 focus:border-sdn-teal"
          }`}
        />
        {hasLink && !isValidUrl(linkUrl.trim()) && (
          <p className="text-xs text-sdn-red mt-1">Enter a valid URL starting with http:// or https://</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-sdn-black/50">
            Message <span className="normal-case font-normal">(optional, 50-500 chars)</span>
          </label>
          <span className={`text-xs ${
            message.trim().length > 500
              ? "text-sdn-red"
              : message.trim().length > 0 && message.trim().length < 50
                ? "text-sdn-amber"
                : "text-sdn-black/40"
          }`}>
            {message.trim().length}/500
          </span>
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your design idea, preferred colors, materials... (min 50 characters)"
          rows={3}
          className={`w-full px-3 py-2 border bg-white text-sm text-sdn-black placeholder:text-sdn-black/30 focus:outline-none transition-colors resize-none ${
            message.trim().length > 500
              ? "border-sdn-red focus:border-sdn-red"
              : "border-sdn-black/20 focus:border-sdn-teal"
          }`}
        />
      </div>

      {error && <p className="text-sm text-sdn-red">{error}</p>}

      <button
        type="submit"
        disabled={loading || !canSubmit}
        className="w-full py-2.5 bg-sdn-teal text-white font-semibold uppercase tracking-wider text-sm hover:bg-sdn-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Sending..." : "Submit Design Idea"}
      </button>
    </form>
  );
}
