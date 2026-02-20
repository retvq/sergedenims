"use client";

import { useState, useMemo } from "react";

const INR_RATE = 83;
const AED_RATE = 3.67;

type Scale = "single_1" | "single_5" | "hundred_1" | "hundred_5" | "thousand_1" | "thousand_5";
type Currency = "all" | "usd" | "inr" | "aed";

const SCALES: { key: Scale; users: string; tries: string }[] = [
  { key: "single_1", users: "1 User", tries: "1 try" },
  { key: "single_5", users: "1 User", tries: "5 tries" },
  { key: "hundred_1", users: "100 Users", tries: "1 try" },
  { key: "hundred_5", users: "100 Users", tries: "5 tries" },
  { key: "thousand_1", users: "1,000 Users", tries: "1 try" },
  { key: "thousand_5", users: "1,000 Users", tries: "5 tries" },
];

const SCALE_INDEX: Record<Scale, number> = {
  single_1: 0, single_5: 1, hundred_1: 2, hundred_5: 3, thousand_1: 4, thousand_5: 5,
};

interface Provider {
  name: string;
  dot: string;
  badge: "current" | "easy" | "cheapest" | null;
  badgeLabel: string;
  usd: number[];
}

const PROVIDERS: Provider[] = [
  { name: "GPT 1.5 Image Medium", dot: "bg-stone-900", badge: "current", badgeLabel: "Current", usd: [0.039, 0.191, 3.90, 19.10, 39, 191] },
  { name: "FLUX.2 [pro]", dot: "bg-blue-600", badge: "easy", badgeLabel: "Easy Switch", usd: [0.032, 0.152, 3.20, 15.20, 32, 152] },
  { name: "Google Imagen 4 Fast", dot: "bg-green-600", badge: "cheapest", badgeLabel: "Cheapest", usd: [0.022, 0.102, 2.20, 10.20, 22, 102] },
  { name: "Google Imagen 4 Std", dot: "bg-amber-600", badge: null, badgeLabel: "", usd: [0.042, 0.202, 4.20, 20.20, 42, 202] },
];

function fmt(val: number, currency: string): string {
  if (currency === "inr") {
    const v = val * INR_RATE;
    return "₹" + (v < 1 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : Math.round(v).toLocaleString());
  }
  if (currency === "aed") {
    const v = val * AED_RATE;
    return (v < 1 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : Math.round(v).toLocaleString()) + " AED";
  }
  return "$" + (val < 1 ? val.toFixed(3) : val < 10 ? val.toFixed(2) : Math.round(val).toLocaleString());
}

const BADGE_STYLES: Record<string, string> = {
  current: "bg-teal-50 text-teal-700",
  easy: "bg-blue-50 text-blue-700",
  cheapest: "bg-green-50 text-green-700",
};

const COL_HEADERS = [
  "1 User / 1 Try", "1 User / 5 Tries",
  "100 Users / 1 Try", "100 Users / 5 Tries",
  "1K Users / 1 Try", "1K Users / 5 Tries",
];

export default function CostPage() {
  const [activeScale, setActiveScale] = useState<Scale>("single_1");
  const [activeCurrency, setActiveCurrency] = useState<Currency>("all");

  const idx = SCALE_INDEX[activeScale];
  const baseUsd = PROVIDERS[0].usd[idx];
  const minUsd = useMemo(() => Math.min(...PROVIDERS.map((p) => p.usd[idx])), [idx]);

  const visibleCurrencies = useMemo(() => {
    if (activeCurrency === "all") return ["usd", "inr", "aed"];
    return [activeCurrency];
  }, [activeCurrency]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-[0.15em] uppercase">
          AI Generation Cost Comparison
        </h1>
        <p className="text-stone-500 text-sm mt-1 mb-6">
          Serge De Nimes — Design Studio API costs across providers and scales
        </p>

        {/* Exchange rates */}
        <div className="inline-flex gap-4 bg-white border border-stone-200 px-4 py-2 rounded-md text-xs text-stone-500 mb-8">
          <span>USD → INR: <strong className="text-stone-900">₹83</strong></span>
          <span>USD → AED: <strong className="text-stone-900">3.67</strong></span>
        </div>

        {/* Scale tabs */}
        <div className="flex flex-wrap border border-stone-200 rounded-lg overflow-hidden w-fit mb-8">
          {SCALES.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveScale(s.key)}
              className={`px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-medium border-r border-stone-200 last:border-r-0 transition-colors ${
                activeScale === s.key
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-500 hover:bg-teal-50"
              }`}
            >
              {s.users}
              <span className="block text-[0.65rem] opacity-70">{s.tries}</span>
            </button>
          ))}
        </div>

        {/* Provider cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {PROVIDERS.map((p) => {
            const usd = p.usd[idx];
            const isCheapest = usd === minUsd;
            const savingsPct = p.badge === "current" ? null : Math.round((1 - usd / baseUsd) * 100);

            return (
              <div
                key={p.name}
                className={`bg-white rounded-xl p-5 transition-shadow hover:shadow-md ${
                  p.badge === "current"
                    ? "border-2 border-teal-400"
                    : "border border-stone-200"
                }`}
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${p.dot}`} />
                    <span className="font-bold text-sm leading-tight">{p.name}</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.badge && (
                    <span className={`text-[0.6rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${BADGE_STYLES[p.badge]}`}>
                      {p.badgeLabel}
                    </span>
                  )}
                  {isCheapest && (
                    <span className="text-[0.6rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-green-50 text-green-700">
                      Cheapest
                    </span>
                  )}
                </div>

                {/* Cost */}
                <div className="bg-stone-50 rounded-md p-3">
                  <div className="text-[0.65rem] uppercase tracking-wide text-stone-500 mb-1">
                    Total cost
                  </div>
                  <div className="text-2xl font-bold tabular-nums">{fmt(usd, "usd")}</div>
                  <div className="flex gap-3 mt-1 text-xs text-stone-400 tabular-nums">
                    <span>{fmt(usd, "inr")}</span>
                    <span>{fmt(usd, "aed")}</span>
                  </div>
                </div>

                {/* Savings */}
                <div className="mt-3 text-xs font-semibold">
                  {savingsPct === null ? (
                    <span className="text-stone-400">Current provider</span>
                  ) : savingsPct > 0 ? (
                    <span className="text-green-600">{savingsPct}% cheaper than current</span>
                  ) : savingsPct === 0 ? (
                    <span className="text-stone-400">Same as current</span>
                  ) : (
                    <span className="text-amber-600">{Math.abs(savingsPct)}% more expensive</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Full table */}
        <h2 className="text-sm font-bold uppercase tracking-[0.1em] mb-4">Full Breakdown</h2>

        {/* Currency toggle */}
        <div className="flex border border-stone-200 rounded-md overflow-hidden w-fit mb-4">
          {(["all", "usd", "inr", "aed"] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => setActiveCurrency(c)}
              className={`px-3 py-1.5 text-xs font-semibold border-r border-stone-200 last:border-r-0 transition-colors ${
                activeCurrency === c
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-500 hover:bg-stone-100"
              }`}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-stone-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm tabular-nums">
            <thead>
              <tr>
                <th className="bg-stone-50 text-left px-4 py-3 text-[0.65rem] uppercase tracking-wide text-stone-500 font-semibold border-b border-stone-200">
                  Provider
                </th>
                <th className="bg-stone-50 text-left px-3 py-3 text-[0.65rem] uppercase tracking-wide text-stone-500 font-semibold border-b border-stone-200 w-14">
                </th>
                {COL_HEADERS.map((h) => (
                  <th
                    key={h}
                    className="bg-stone-50 text-right px-4 py-3 text-[0.65rem] uppercase tracking-wide text-stone-500 font-semibold border-b border-stone-200 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROVIDERS.map((p, pi) =>
                visibleCurrencies.map((curr, ci) => (
                  <tr
                    key={`${p.name}-${curr}`}
                    className={
                      ci === visibleCurrencies.length - 1 && pi < PROVIDERS.length - 1
                        ? "border-b-2 border-stone-200"
                        : "border-b border-stone-100"
                    }
                  >
                    {ci === 0 && (
                      <td
                        rowSpan={visibleCurrencies.length}
                        className="px-4 py-2.5 font-semibold text-sm align-middle"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${p.dot}`} />
                          {p.name}
                        </div>
                      </td>
                    )}
                    <td className="px-3 py-2.5 text-[0.65rem] uppercase tracking-wide text-stone-400 font-medium">
                      {curr.toUpperCase()}
                    </td>
                    {p.usd.map((val, vi) => (
                      <td
                        key={vi}
                        className={`px-4 py-2.5 text-right whitespace-nowrap ${
                          curr === "usd" ? "font-semibold" : "text-stone-500 text-xs"
                        }`}
                      >
                        {fmt(val, curr)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <p className="text-xs text-stone-400 mt-6 text-center">
          Costs based on gpt-image-1.5 medium quality, 1024×1024 output. Typical session = 1 detection + generations.
        </p>
      </div>
    </div>
  );
}
