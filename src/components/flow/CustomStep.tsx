"use client";

import { useState } from "react";
import FileDropzone from "@/components/ui/FileDropzone";
import { MAX_CUSTOM_INSTRUCTIONS_LENGTH, MIN_CUSTOM_INSTRUCTIONS_LENGTH } from "@/lib/constants";

interface CustomStepProps {
  clothingImageUrl: string;
  onSubmit: (instructions: string, referenceUrl?: string) => void;
  onBack: () => void;
}

export default function CustomStep({ clothingImageUrl, onSubmit, onBack }: CustomStepProps) {
  const [instructions, setInstructions] = useState("");
  const [refFile, setRefFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const isValid = instructions.length >= MIN_CUSTOM_INSTRUCTIONS_LENGTH
    && instructions.length <= MAX_CUSTOM_INSTRUCTIONS_LENGTH;

  const handleSubmit = async () => {
    if (!isValid) return;
    setUploading(true);

    let refUrl: string | undefined;

    // Upload reference image if provided
    if (refFile) {
      const formData = new FormData();
      formData.append("file", refFile);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        refUrl = data.clothingImageUrl;
      }
    }

    setUploading(false);
    onSubmit(instructions, refUrl);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-wide text-sdn-black uppercase">
          Custom Design
        </h2>
        <p className="text-sdn-black/60 mt-1">
          Describe your custom design idea and optionally add a reference image
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: clothing image */}
        <div>
          <p className="text-xs text-sdn-black/50 uppercase tracking-wide mb-2">Your Garment</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={clothingImageUrl}
            alt="Your garment"
            className="w-full aspect-square object-cover border border-sdn-gray-border"
          />
        </div>

        {/* Right: inputs */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-sdn-black/50 uppercase tracking-wide mb-2">
              Design Instructions *
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              maxLength={MAX_CUSTOM_INSTRUCTIONS_LENGTH}
              rows={5}
              placeholder="Describe what you want — e.g., 'Add a large tiger painting on the back with vibrant orange and black colors'"
              className="w-full border border-sdn-gray-border p-3 text-sm text-sdn-black resize-none focus:outline-none focus:border-sdn-teal"
            />
            <p className="text-xs text-sdn-black/40 mt-1">
              {instructions.length}/{MAX_CUSTOM_INSTRUCTIONS_LENGTH} characters
            </p>
          </div>

          <div>
            <label className="block text-xs text-sdn-black/50 uppercase tracking-wide mb-2">
              Reference / Design Image (Optional)
            </label>
            <FileDropzone
              onFileSelect={setRefFile}
              selectedFile={refFile}
              onClear={() => setRefFile(null)}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8 justify-center">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-sdn-gray-border text-sdn-black/60 font-semibold tracking-wide uppercase text-sm hover:bg-sdn-gray transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isValid || uploading}
          className="px-8 py-3 bg-sdn-teal text-white font-semibold tracking-wide uppercase text-sm hover:bg-sdn-teal/90 disabled:opacity-50 transition-colors"
        >
          {uploading ? "Uploading..." : "Generate Design"}
        </button>
      </div>
    </div>
  );
}
