"use client";

import { useEffect, useRef } from "react";
import type { PathType, StyleKey } from "@/lib/types";

interface GeneratingStepProps {
  sessionId: string;
  pathType: PathType;
  sampleKey: StyleKey | null;
  customInstructions: string | null;
  customReferenceUrl: string | null;
  regenerationFeedback: string | null;
  onGenerated: (imageUrl: string, count: number) => void;
  onError: (msg: string) => void;
}

export default function GeneratingStep({
  sessionId,
  pathType,
  sampleKey,
  customInstructions,
  customReferenceUrl,
  regenerationFeedback,
  onGenerated,
  onError,
}: GeneratingStepProps) {
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        pathType,
        sampleKey: pathType === "sample" ? sampleKey : undefined,
        customInstructions: pathType === "custom" ? customInstructions : undefined,
        customReferenceUrl: pathType === "custom" ? customReferenceUrl : undefined,
        regenerationFeedback: regenerationFeedback || undefined,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Generation failed");
        onGenerated(data.imageUrl, data.generationCount);
      })
      .catch((err) => onError(err.message));
  }, [sessionId, pathType, sampleKey, customInstructions, customReferenceUrl, regenerationFeedback, onGenerated, onError]);

  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto border-4 border-sdn-teal border-t-transparent animate-spin mb-6" />
        <h2 className="text-2xl font-bold tracking-wide text-sdn-black uppercase mb-2">
          Generating Your Design
        </h2>
        <p className="text-sdn-black/50">
          Our AI is creating your custom denim design. This may take a moment...
        </p>
      </div>

      <div className="bg-sdn-gray p-4 text-left text-sm text-sdn-black/60">
        <p className="font-semibold text-sdn-black mb-1">
          {pathType === "sample" ? "Style Selected" : "Custom Design"}
        </p>
        {pathType === "sample" && sampleKey && (
          <p>Applying {sampleKey.replace(/_/g, " ")} style to your garment</p>
        )}
        {pathType === "custom" && customInstructions && (
          <p className="italic">&quot;{customInstructions}&quot;</p>
        )}
      </div>
    </div>
  );
}
