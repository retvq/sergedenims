"use client";

import { useState } from "react";
import { ConversationStatus } from "@/lib/types";

interface OrderDecisionProps {
  conversationId: string;
  currentStatus: ConversationStatus;
  onStatusChange: (status: ConversationStatus) => void;
}

export default function OrderDecision({
  conversationId,
  currentStatus,
  onStatusChange,
}: OrderDecisionProps) {
  const [loading, setLoading] = useState(false);

  if (currentStatus === "order_accepted") {
    return (
      <div className="border border-sdn-teal bg-sdn-teal-light p-4 text-center">
        <p className="text-sm font-semibold text-sdn-teal">
          Order Confirmed
        </p>
        <p className="text-xs text-sdn-teal/70 mt-1">
          We&apos;ll be in touch to finalize your custom design.
        </p>
      </div>
    );
  }

  if (currentStatus === "order_declined") {
    return (
      <div className="border border-sdn-gray-border bg-sdn-gray p-4 text-center">
        <p className="text-sm font-semibold text-sdn-black/60">
          Order Declined
        </p>
        <p className="text-xs text-sdn-black/40 mt-1">
          Feel free to submit new design ideas anytime.
        </p>
      </div>
    );
  }

  const handleDecision = async (status: ConversationStatus) => {
    setLoading(true);
    try {
      const res = await fetch("/api/conversations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: conversationId, status }),
      });

      if (res.ok) {
        onStatusChange(status);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-sdn-gray-border bg-white p-4">
      <p className="text-sm font-semibold text-sdn-black mb-3 text-center">
        Ready to proceed with your order?
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => handleDecision("order_accepted")}
          disabled={loading}
          className="flex-1 py-2.5 bg-sdn-teal text-white font-semibold text-sm uppercase tracking-wider hover:bg-sdn-teal/90 transition-colors disabled:opacity-50"
        >
          Proceed with Order
        </button>
        <button
          onClick={() => handleDecision("order_declined")}
          disabled={loading}
          className="flex-1 py-2.5 border border-sdn-black text-sdn-black font-semibold text-sm uppercase tracking-wider hover:bg-sdn-gray transition-colors disabled:opacity-50"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
