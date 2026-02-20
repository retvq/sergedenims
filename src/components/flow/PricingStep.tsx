"use client";

import { getPricingLabel } from "@/lib/samples/pricing";
import { CLOTHING_CATEGORIES } from "@/lib/constants";
import type { ClothingCategory, StyleKey } from "@/lib/types";

interface PricingStepProps {
  designUrl: string;
  pricingCategory: string;
  price: number;
  detectedCategory: ClothingCategory;
  onNewDesign: () => void;
}

export default function PricingStep({
  designUrl,
  pricingCategory,
  price,
  detectedCategory,
  onNewDesign,
}: PricingStepProps) {
  const styleLabel = getPricingLabel(pricingCategory as StyleKey | "custom");
  const garmentLabel = CLOTHING_CATEGORIES[detectedCategory];

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold tracking-wide text-sdn-black uppercase mb-2">
        Design Locked
      </h2>
      <p className="text-sdn-black/60 mb-8">
        Your custom design has been saved
      </p>

      <div className="mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={designUrl}
          alt="Locked design"
          className="w-80 h-80 object-cover mx-auto border-2 border-sdn-teal"
        />
      </div>

      <div className="bg-sdn-gray border border-sdn-gray-border p-6 mb-8 max-w-md mx-auto">
        <p className="text-xs text-sdn-black/50 uppercase tracking-wide mb-1">
          Customization
        </p>
        <p className="text-lg font-bold text-sdn-black mb-3">
          {styleLabel} &mdash; {garmentLabel}
        </p>
        <div className="border-t border-sdn-gray-border pt-3">
          <p className="text-xs text-sdn-black/50 uppercase tracking-wide mb-1">
            Estimated Price
          </p>
          <p className="text-3xl font-bold text-sdn-teal">
            AED {price}
          </p>
        </div>
      </div>

      <button
        onClick={onNewDesign}
        className="px-8 py-3 border-2 border-sdn-black text-sdn-black font-semibold tracking-wide uppercase text-sm hover:bg-sdn-black hover:text-white transition-colors"
      >
        Start New Design
      </button>
    </div>
  );
}
