"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "@/components/Header";
import UploadStep from "./UploadStep";
import DetectingStep from "./DetectingStep";
import SamplesStep from "./SamplesStep";
import CustomStep from "./CustomStep";
import GeneratingStep from "./GeneratingStep";
import ResultStep from "./ResultStep";
import PricingStep from "./PricingStep";
import type { FlowState, FlowStep, ClothingCategory, StyleKey } from "@/lib/types";

const INITIAL_STATE: FlowState = {
  step: "upload",
  sessionId: null,
  clothingImageUrl: null,
  detectedCategory: null,
  clothingDescription: null,
  pathType: null,
  selectedSampleKey: null,
  customInstructions: null,
  customReferenceUrl: null,
  currentDesignUrl: null,
  generationCount: 0,
  regenerationFeedback: null,
  pricingCategory: null,
  price: null,
};

export default function DesignFlow() {
  const [state, setState] = useState<FlowState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);

  // Recover session from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sdn_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as FlowState;
        if (parsed.sessionId) setState(parsed);
      } catch {}
    }
  }, []);

  // Persist state to localStorage
  useEffect(() => {
    if (state.sessionId) {
      localStorage.setItem("sdn_session", JSON.stringify(state));
    }
  }, [state]);

  const update = useCallback((partial: Partial<FlowState>) => {
    setState((prev) => ({ ...prev, ...partial }));
    setError(null);
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem("sdn_session");
    setState(INITIAL_STATE);
    setError(null);
  }, []);

  // Step handlers
  const handleUploaded = (sessionId: string, clothingImageUrl: string) => {
    // New upload = new session — clear all downstream state
    update({
      sessionId,
      clothingImageUrl,
      step: "detecting",
      detectedCategory: null,
      clothingDescription: null,
      pathType: null,
      selectedSampleKey: null,
      customInstructions: null,
      customReferenceUrl: null,
      currentDesignUrl: null,
      generationCount: 0,
      regenerationFeedback: null,
      pricingCategory: null,
      price: null,
    });
  };

  const handleDetected = (category: ClothingCategory, description: string) => {
    update({ detectedCategory: category, clothingDescription: description, step: "samples" });
  };

  const handleSampleSelected = (sampleKey: StyleKey) => {
    update({ pathType: "sample", selectedSampleKey: sampleKey, step: "generating" });
  };

  const handleGoCustom = () => {
    update({ pathType: "custom", step: "custom" });
  };

  const handleCustomSubmit = (instructions: string, referenceUrl?: string) => {
    update({
      customInstructions: instructions,
      customReferenceUrl: referenceUrl || null,
      step: "generating",
    });
  };

  const handleGenerated = (imageUrl: string, count: number) => {
    update({ currentDesignUrl: imageUrl, generationCount: count, step: "result" });
  };

  const handleRegenerate = (feedback: string) => {
    update({ regenerationFeedback: feedback, step: "generating" });
  };

  const handleLocked = (pricingCategory: string, price: number) => {
    update({ pricingCategory, price, step: "pricing" });
  };

  // Compute which progress bar steps have data and can be navigated to
  const reachableSteps = useMemo(() => {
    const reachable = new Set<FlowStep>();
    // Upload is always reachable (resets flow)
    reachable.add("upload");
    // Choose Style is reachable if detection is done
    if (state.detectedCategory && state.clothingDescription) {
      reachable.add("samples");
    }
    // Your Design is reachable if a design has been generated
    if (state.currentDesignUrl) {
      reachable.add("result");
    }
    return reachable;
  }, [state.detectedCategory, state.clothingDescription, state.currentDesignUrl]);

  const handleStepClick = (step: FlowStep) => {
    if (step === "upload") {
      // Navigate to upload — preserve state so user can come back
      // State only clears when they actually upload a new image (handleUploaded)
      update({ step: "upload" });
      return;
    }

    if (step === "samples" && reachableSteps.has("samples")) {
      // Navigate to style selection — preserve all state (design, counts, etc.)
      // State only gets cleared when user takes a new action (picks a style, goes custom)
      update({ step: "samples" });
      return;
    }

    if (step === "result" && reachableSteps.has("result")) {
      // Navigate back to view current design — preserve everything
      update({ step: "result" });
      return;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentStep={state.step} reachableSteps={reachableSteps} onStepClick={handleStepClick} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-sdn-red/10 border border-sdn-red/30 text-sdn-red text-sm">
            {error}
            <button onClick={() => setError(null)} className="ml-4 underline">Dismiss</button>
          </div>
        )}

        {state.step === "upload" && (
          <UploadStep onUploaded={handleUploaded} onError={setError} />
        )}

        {state.step === "detecting" && state.sessionId && state.clothingImageUrl && (
          <DetectingStep
            sessionId={state.sessionId}
            imageUrl={state.clothingImageUrl}
            onDetected={handleDetected}
            onError={setError}
          />
        )}

        {state.step === "samples" && state.detectedCategory && state.clothingImageUrl && (
          <SamplesStep
            category={state.detectedCategory}
            clothingImageUrl={state.clothingImageUrl}
            onSampleSelected={handleSampleSelected}
            onGoCustom={handleGoCustom}
          />
        )}

        {state.step === "custom" && state.clothingImageUrl && (
          <CustomStep
            clothingImageUrl={state.clothingImageUrl}
            onSubmit={handleCustomSubmit}
            onBack={() => update({ step: "samples" })}
          />
        )}

        {state.step === "generating" && state.sessionId && (
          <GeneratingStep
            sessionId={state.sessionId}
            pathType={state.pathType!}
            sampleKey={state.selectedSampleKey}
            customInstructions={state.customInstructions}
            customReferenceUrl={state.customReferenceUrl}
            regenerationFeedback={state.regenerationFeedback}
            onGenerated={handleGenerated}
            onError={setError}
          />
        )}

        {state.step === "result" && state.sessionId && state.currentDesignUrl && state.clothingImageUrl && (
          <ResultStep
            sessionId={state.sessionId}
            clothingImageUrl={state.clothingImageUrl}
            designUrl={state.currentDesignUrl}
            generationCount={state.generationCount}
            onRegenerate={handleRegenerate}
            onLock={handleLocked}
            onError={setError}
          />
        )}

        {state.step === "pricing" && state.currentDesignUrl && (
          <PricingStep
            designUrl={state.currentDesignUrl}
            pricingCategory={state.pricingCategory!}
            price={state.price!}
            detectedCategory={state.detectedCategory!}
            onNewDesign={reset}
          />
        )}
      </main>
    </div>
  );
}
