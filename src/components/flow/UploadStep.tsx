"use client";

import { useState } from "react";
import FileDropzone from "@/components/ui/FileDropzone";

const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 0.85;

/** Compress image client-side: resize to max 1024px, convert to JPEG */
function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // Scale down if larger than MAX_DIMENSION
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Compression failed"));
          const compressed = new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
            type: "image/jpeg",
          });
          resolve(compressed);
        },
        "image/jpeg",
        JPEG_QUALITY
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

interface UploadStepProps {
  onUploaded: (sessionId: string, clothingImageUrl: string) => void;
  onError: (msg: string) => void;
}

export default function UploadStep({ onUploaded, onError }: UploadStepProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      // Compress before upload: resize to 1024px max, JPEG quality 85%
      const compressed = await compressImage(file);

      const formData = new FormData();
      formData.append("file", compressed);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");
      onUploaded(data.sessionId, data.clothingImageUrl);
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto text-center">
      <h1 className="text-3xl font-bold tracking-wide text-sdn-black uppercase mb-2">
        Design Your Denim
      </h1>
      <p className="text-sdn-black/60 mb-8">
        Upload a photo of your denim garment and let AI create a custom design for you.
      </p>

      <FileDropzone
        onFileSelect={setFile}
        selectedFile={file}
        onClear={() => setFile(null)}
      />

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-6 w-full py-3 bg-sdn-teal text-white font-semibold tracking-wide uppercase text-sm hover:bg-sdn-teal/90 disabled:opacity-50 transition-colors"
        >
          {uploading ? "Uploading..." : "Continue"}
        </button>
      )}
    </div>
  );
}
