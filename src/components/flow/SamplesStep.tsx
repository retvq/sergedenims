"use client";

import { getSamplesForCategory } from "@/lib/samples/catalog";
import { CLOTHING_CATEGORIES } from "@/lib/constants";
import type { ClothingCategory, StyleKey } from "@/lib/types";

interface SamplesStepProps {
  category: ClothingCategory;
  clothingImageUrl: string;
  onSampleSelected: (sampleKey: StyleKey) => void;
  onGoCustom: () => void;
}

export default function SamplesStep({ category, clothingImageUrl, onSampleSelected, onGoCustom }: SamplesStepProps) {
  const samples = getSamplesForCategory(category);
  const categoryLabel = CLOTHING_CATEGORIES[category];

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={clothingImageUrl}
            alt="Your garment"
            className="w-16 h-16 object-cover border border-sdn-gray-border"
          />
          <div className="text-left">
            <p className="text-xs text-sdn-black/50 uppercase tracking-wide">Detected</p>
            <p className="text-lg font-bold text-sdn-black">{categoryLabel}</p>
          </div>
        </div>
        <h2 className="text-2xl font-bold tracking-wide text-sdn-black uppercase">
          Choose a Customization Style
        </h2>
        <p className="text-sdn-black/60 mt-1">
          Select a style below, or create your own custom design
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {samples.map((sample) => (
          <button
            key={sample.key}
            onClick={() => onSampleSelected(sample.key)}
            className="group text-left border border-sdn-gray-border hover:border-sdn-teal transition-colors bg-white"
          >
            <div className="aspect-square bg-sdn-gray overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sample.imageUrl}
                alt={sample.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold text-sdn-black uppercase tracking-wide">
                {sample.name}
              </h3>
              <p className="text-xs text-sdn-black/50 mt-1 line-clamp-2">
                {sample.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onGoCustom}
          className="px-8 py-3 border-2 border-sdn-black text-sdn-black font-semibold tracking-wide uppercase text-sm hover:bg-sdn-black hover:text-white transition-colors"
        >
          Go Custom Instead
        </button>
      </div>
    </div>
  );
}
