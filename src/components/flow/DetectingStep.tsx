"use client";

import { useEffect, useRef } from "react";
import type { ClothingCategory } from "@/lib/types";

interface DetectingStepProps {
  sessionId: string;
  imageUrl: string;
  onDetected: (category: ClothingCategory, description: string) => void;
  onError: (msg: string) => void;
}

export default function DetectingStep({ sessionId, imageUrl, onDetected, onError }: DetectingStepProps) {
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    fetch("/api/detect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, imageUrl }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Detection failed");
        onDetected(data.category, data.description);
      })
      .catch((err) => onError(err.message));
  }, [sessionId, imageUrl, onDetected, onError]);

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Your garment"
          className="w-64 h-64 object-cover mx-auto border border-sdn-gray-border"
        />
      </div>

      <div className="flex items-center justify-center gap-3 mb-4">
        <span className="inline-block text-xl text-sdn-teal animate-spin">&#10057;</span>
        <span className="text-lg font-semibold text-sdn-black tracking-wide">
          Analyzing your garment...
        </span>
      </div>
      <p className="text-sm text-sdn-black/50">
        Our AI is identifying the garment type and details
      </p>
    </div>
  );
}
