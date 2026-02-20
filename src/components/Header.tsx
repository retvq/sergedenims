"use client";

import type { FlowStep } from "@/lib/types";

// Only user-meaningful milestones shown in progress bar
const PROGRESS_STEPS: { key: FlowStep; label: string }[] = [
  { key: "upload", label: "Upload" },
  { key: "samples", label: "Choose Style" },
  { key: "result", label: "Your Design" },
];

// Map every internal flow step to the progress milestone it falls under
const STEP_TO_PROGRESS: Record<FlowStep, FlowStep> = {
  upload: "upload",
  detecting: "upload",
  samples: "samples",
  custom: "samples",
  generating: "samples",
  result: "result",
  pricing: "result",
};

interface HeaderProps {
  currentStep?: FlowStep;
  /** Set of progress step keys that have data and can be navigated to */
  reachableSteps?: Set<FlowStep>;
  onStepClick?: (step: FlowStep) => void;
}

export default function Header({ currentStep, reachableSteps, onStepClick }: HeaderProps) {
  const mappedCurrent = currentStep ? STEP_TO_PROGRESS[currentStep] : undefined;
  const currentProgressIndex = mappedCurrent
    ? PROGRESS_STEPS.findIndex((s) => s.key === mappedCurrent)
    : -1;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-sdn-gray-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <span className="text-xl font-bold tracking-[0.2em] text-sdn-black uppercase">
            Serge De Nimes
          </span>
          <span className="text-sm text-sdn-black/60 tracking-wide">
            AI Design Studio
          </span>
        </div>

        {currentStep && (currentStep !== "upload" || (reachableSteps && reachableSteps.size > 1)) && (
          <div className="flex items-center gap-1 pb-3">
            {PROGRESS_STEPS.map((step, i) => {
              const isActive = i === currentProgressIndex;
              const isReachable = !!reachableSteps?.has(step.key);
              const isClickable = !isActive && isReachable && !!onStepClick;
              // "filled" = either active or reachable (has data)
              const isFilled = isActive || isReachable;
              return (
                <div key={step.key} className="flex items-center">
                  <button
                    type="button"
                    disabled={!isClickable}
                    onClick={() => isClickable && onStepClick(step.key)}
                    className={`px-3 py-1 text-xs font-semibold tracking-wide uppercase whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-sdn-teal text-white"
                        : isClickable
                        ? "bg-sdn-teal/20 text-sdn-teal hover:bg-sdn-teal/40 cursor-pointer"
                        : isFilled
                        ? "bg-sdn-teal/20 text-sdn-teal"
                        : "bg-sdn-gray text-sdn-black/30"
                    }`}
                  >
                    {step.label}
                  </button>
                  {i < PROGRESS_STEPS.length - 1 && (
                    <div className={`w-4 h-0.5 ${isFilled ? "bg-sdn-teal/40" : "bg-sdn-gray-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
