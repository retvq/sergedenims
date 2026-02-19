"use client";

import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { MAX_FILE_SIZE } from "@/lib/constants";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export default function FileDropzone({ onFileSelect, selectedFile, onClear }: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  if (selectedFile) {
    const isImage = selectedFile.type.startsWith("image/");
    return (
      <div className="border border-sdn-gray-border p-4 bg-sdn-gray">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isImage ? (
              <div className="w-12 h-12 bg-white border border-sdn-gray-border flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-white border border-sdn-gray-border flex items-center justify-center">
                <svg className="w-6 h-6 text-sdn-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-sdn-black truncate max-w-[200px]">
                {selectedFile.name}
              </p>
              <p className="text-xs text-sdn-black/50">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="text-sm text-sdn-red hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-sdn-teal bg-sdn-teal-light"
          : "border-sdn-gray-border hover:border-sdn-teal/50 bg-sdn-gray"
      }`}
    >
      <input {...getInputProps()} />
      <svg
        className="w-8 h-8 mx-auto mb-3 text-sdn-black/30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <p className="text-sm text-sdn-black/60">
        {isDragActive ? "Drop your file here" : "Drag & drop your design reference here"}
      </p>
      <p className="text-xs text-sdn-black/40 mt-1">
        or click to browse (PNG, JPG, PDF, up to 10MB)
      </p>
    </div>
  );
}
