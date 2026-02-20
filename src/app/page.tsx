"use client";

import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import DesignFlow from "@/components/flow/DesignFlow";

export default function Home() {
  const [studioOpen, setStudioOpen] = useState(false);

  if (studioOpen) {
    return <DesignFlow onClose={() => setStudioOpen(false)} />;
  }

  return <LandingPage onOpenStudio={() => setStudioOpen(true)} />;
}
