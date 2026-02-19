"use client";

import { useState } from "react";
import { ReviewVerdict } from "@/lib/types";
import { VERDICT_CONFIG, MAX_REVIEW_MESSAGE_LENGTH } from "@/lib/constants";

interface ReviewFormProps {
  conversationId: string;
  hasExistingReview: boolean;
  onReviewSent: () => void;
}

export default function ReviewForm({ conversationId, hasExistingReview, onReviewSent }: ReviewFormProps) {
  const [verdict, setVerdict] = useState<ReviewVerdict | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verdictRequired = !hasExistingReview;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (verdictRequired && !verdict) {
      setError("Please select a verdict for your first review");
      return;
    }
    if (verdict === "depends" && !message.trim()) {
      setError("Message is mandatory when selecting 'Depends'");
      return;
    }
    if (message.length > MAX_REVIEW_MESSAGE_LENGTH) {
      setError(`Message must be ${MAX_REVIEW_MESSAGE_LENGTH} characters or less`);
      return;
    }
    if (!verdict && !message.trim()) {
      setError("Please select a label or write a message");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const msgType = verdict ? "review" : "admin_text";

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          sender_role: "admin",
          message_type: msgType,
          verdict: verdict || null,
          body: message.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send");
      }

      setVerdict(null);
      setMessage("");
      onReviewSent();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const verdicts: ReviewVerdict[] = ["possible", "depends", "not_possible"];
  const canSubmit = verdict || message.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="border border-sdn-gray-border bg-white p-4 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-sdn-black/50">
        {verdictRequired ? "Send Review (verdict required)" : "Reply"}
      </p>

      {/* Verdict buttons */}
      <div className="grid grid-cols-3 gap-2">
        {verdicts.map((v) => {
          const config = VERDICT_CONFIG[v];
          const isSelected = verdict === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => setVerdict(isSelected ? null : v)}
              className={`py-2.5 px-2 text-xs font-semibold uppercase tracking-wider border-2 transition-colors ${
                isSelected
                  ? `${config.color} ${config.textColor} ${config.borderColor}`
                  : `bg-white text-sdn-black/70 border-sdn-gray-border hover:${config.borderColor}`
              }`}
            >
              {config.label}
            </button>
          );
        })}
      </div>
      {!verdictRequired && (
        <p className="text-xs text-sdn-black/40">Label is optional for follow-up replies. Click again to deselect.</p>
      )}

      {/* Message */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-sdn-black/50">
            Message{" "}
            {verdict === "depends" ? (
              <span className="text-sdn-red normal-case font-normal">(required)</span>
            ) : verdictRequired ? (
              <span className="normal-case font-normal">(optional)</span>
            ) : (
              <span className="normal-case font-normal">(optional)</span>
            )}
          </label>
          <span
            className={`text-xs ${
              message.length > MAX_REVIEW_MESSAGE_LENGTH ? "text-sdn-red" : "text-sdn-black/40"
            }`}
          >
            {message.length}/{MAX_REVIEW_MESSAGE_LENGTH}
          </span>
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            verdict === "depends"
              ? "Explain what factors this depends on..."
              : "Add a message to the customer..."
          }
          rows={3}
          className={`w-full px-3 py-2 border bg-white text-sm text-sdn-black placeholder:text-sdn-black/30 focus:outline-none transition-colors resize-none ${
            verdict === "depends" && !message.trim()
              ? "border-sdn-amber focus:border-sdn-amber"
              : "border-sdn-black/20 focus:border-sdn-teal"
          }`}
        />
      </div>

      {error && <p className="text-sm text-sdn-red">{error}</p>}

      <button
        type="submit"
        disabled={loading || !canSubmit}
        className="w-full py-2.5 bg-sdn-teal text-white font-semibold uppercase tracking-wider text-sm hover:bg-sdn-teal/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Sending..." : verdict ? "Send Review" : "Send Message"}
      </button>
    </form>
  );
}
