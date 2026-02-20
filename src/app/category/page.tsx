"use client";

import { useState } from "react";
import { getSamplesForCategory } from "@/lib/samples/catalog";
import { CLOTHING_CATEGORIES, STYLE_GARMENT_MAP } from "@/lib/constants";
import { getPrice } from "@/lib/samples/pricing";
import type { ClothingCategory } from "@/lib/types";

const categories = Object.keys(CLOTHING_CATEGORIES) as ClothingCategory[];

export default function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory>("jacket");
  const samples = getSamplesForCategory(selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-sdn-gray-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-[0.2em] text-sdn-black uppercase">
            Serge De Nimes — Style Preview
          </span>
          <span className="text-sm text-sdn-black/50">Category Catalog</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Category selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm font-semibold tracking-wide uppercase transition-colors ${
                selectedCategory === cat
                  ? "bg-sdn-teal text-white"
                  : "bg-sdn-gray text-sdn-black/60 hover:bg-sdn-gray-border"
              }`}
            >
              {CLOTHING_CATEGORIES[cat]} ({STYLE_GARMENT_MAP[cat].length})
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-bold tracking-wide text-sdn-black uppercase mb-2">
          {CLOTHING_CATEGORIES[selectedCategory]} — Available Styles
        </h2>
        <p className="text-sdn-black/50 mb-6">
          {samples.length} customization styles available for this garment type
        </p>

        {/* Style cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {samples.map((sample) => {
            const price = getPrice(sample.key, selectedCategory);
            return (
              <div
                key={sample.key}
                className="border border-sdn-gray-border bg-white hover:border-sdn-teal transition-colors"
              >
                <div className="aspect-square bg-sdn-gray overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sample.imageUrl}
                    alt={sample.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-sdn-black uppercase tracking-wide">
                    {sample.name}
                  </h3>
                  <p className="text-xs text-sdn-black/50 mt-1">
                    {sample.description}
                  </p>
                  <div className="mt-3 pt-3 border-t border-sdn-gray-border flex justify-between items-center">
                    <span className="text-xs text-sdn-black/40 uppercase">Price</span>
                    <span className="text-lg font-bold text-sdn-teal">AED {price}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing table */}
        <div className="mt-12 border border-sdn-gray-border">
          <h3 className="bg-sdn-gray px-4 py-3 text-sm font-semibold text-sdn-black uppercase tracking-wide">
            Full Pricing Matrix — {CLOTHING_CATEGORIES[selectedCategory]}
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sdn-gray-border">
                <th className="text-left px-4 py-2 text-sdn-black/50">Style</th>
                <th className="text-right px-4 py-2 text-sdn-black/50">Price (AED)</th>
              </tr>
            </thead>
            <tbody>
              {samples.map((s) => (
                <tr key={s.key} className="border-b border-sdn-gray-border">
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2 text-right font-semibold text-sdn-teal">
                    {getPrice(s.key, selectedCategory)}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-2">Custom Design</td>
                <td className="px-4 py-2 text-right font-semibold text-sdn-teal">
                  {getPrice("custom", selectedCategory)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
