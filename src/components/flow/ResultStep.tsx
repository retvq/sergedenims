"use client";

import { useState } from "react";
import { MAX_GENERATIONS, MIN_REGENERATION_FEEDBACK, MAX_REGENERATION_FEEDBACK } from "@/lib/constants";

interface ResultStepProps {
  sessionId: string;
  clothingImageUrl: string;
  designUrl: string;
  generationCount: number;
  onRegenerate: (feedback: string) => void;
  onLock: (pricingCategory: string, price: number) => void;
  onError: (msg: string) => void;
}

export default function ResultStep({
  sessionId,
  clothingImageUrl,
  designUrl,
  generationCount,
  onRegenerate,
  onLock,
  onError,
}: ResultStepProps) {
  const [locking, setLocking] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const canRegenerate = generationCount < MAX_GENERATIONS;
  const feedbackValid = feedback.trim().length >= MIN_REGENERATION_FEEDBACK;

  const handleLock = async () => {
    setShowLockModal(false);
    setLocking(true);
    try {
      const res = await fetch("/api/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lock failed");
      onLock(data.pricingCategory, data.price);
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : "Failed to lock design");
    } finally {
      setLocking(false);
    }
  };

  const handleRegenerate = () => {
    if (!feedbackValid) return;
    onRegenerate(feedback.trim());
    setFeedback("");
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-wide text-sdn-black uppercase">
          Your Custom Design
        </h2>
        <p className="text-sdn-black/50 mt-1">
          Generation {generationCount} of {MAX_GENERATIONS}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
        <div>
          <p className="text-xs text-sdn-black/50 uppercase tracking-wide mb-2">Original</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={clothingImageUrl}
            alt="Original garment"
            className="w-full aspect-square object-cover border border-sdn-gray-border"
          />
        </div>
        <div>
          <p className="text-xs text-sdn-black/50 uppercase tracking-wide mb-2">Generated Design</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={designUrl}
            alt="Generated design"
            className="w-full aspect-square object-cover border border-sdn-teal"
          />
        </div>
      </div>

      {/* Regeneration feedback textarea */}
      {canRegenerate && (
        <div className="max-w-3xl mx-auto mb-6">
          <label
            htmlFor="regeneration-feedback"
            className="block text-sm font-semibold text-sdn-black uppercase tracking-wide mb-2"
          >
            What would you like to change?
          </label>
          <textarea
            id="regeneration-feedback"
            value={feedback}
            onChange={(e) => {
              if (e.target.value.length <= MAX_REGENERATION_FEEDBACK) {
                setFeedback(e.target.value);
              }
            }}
            placeholder="Make the pearls smaller and only along the collar, remove from pockets..."
            rows={3}
            className="w-full border border-sdn-gray-border px-4 py-3 text-sm text-sdn-black placeholder:text-sdn-black/30 focus:outline-none focus:border-sdn-teal resize-none"
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-sdn-black/40">
              {feedback.trim().length < MIN_REGENERATION_FEEDBACK
                ? `Minimum ${MIN_REGENERATION_FEEDBACK} characters required`
                : ""}
            </p>
            <p
              className={`text-xs ${
                feedback.length >= MAX_REGENERATION_FEEDBACK
                  ? "text-sdn-red"
                  : "text-sdn-black/40"
              }`}
            >
              {feedback.length}/{MAX_REGENERATION_FEEDBACK}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <button
          onClick={handleRegenerate}
          disabled={!canRegenerate || !feedbackValid}
          className="px-6 py-3 border border-sdn-gray-border text-sdn-black font-semibold tracking-wide uppercase text-sm hover:bg-sdn-gray disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {canRegenerate
            ? `Regenerate (${MAX_GENERATIONS - generationCount} left)`
            : "No regenerations left"}
        </button>
        <button
          onClick={() => setShowLockModal(true)}
          disabled={locking}
          className="px-8 py-3 bg-sdn-teal text-white font-semibold tracking-wide uppercase text-sm hover:bg-sdn-teal/90 disabled:opacity-50 transition-colors"
        >
          {locking ? "Locking..." : "Lock This Design"}
        </button>
      </div>

      {/* Lock confirmation modal */}
      {showLockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-8 max-w-sm w-full mx-4 text-center">
            <h3 className="text-lg font-bold text-sdn-black uppercase tracking-wide mb-3">
              Lock This Design?
            </h3>
            <p className="text-sm text-sdn-black/60 mb-6">
              Are you sure you want to lock this design? You&apos;ll proceed to the pricing page.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowLockModal(false)}
                className="px-6 py-3 border border-sdn-gray-border text-sdn-black font-semibold tracking-wide uppercase text-sm hover:bg-sdn-gray transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLock}
                className="px-6 py-3 bg-sdn-teal text-white font-semibold tracking-wide uppercase text-sm hover:bg-sdn-teal/90 transition-colors"
              >
                Yes, Lock It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
