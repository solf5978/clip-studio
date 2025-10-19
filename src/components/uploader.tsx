// src/components/home/uploader.tsx
"use client";

import React, { useState } from "react";

import {
  LucideUploadCloud,
  LucideFileVideo,
  LucideLoader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type UploaderProps = {
  selectedFile: File | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
};

export function Uploader({
  selectedFile,
  onFileChange,
  disabled,
}: UploaderProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    if (disabled) return;
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    if (disabled) return;
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    if (disabled) return;
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    const syntheticEvent = {
      target: { files: [file] },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    onFileChange(syntheticEvent);
  };

  return (
    <div className="w-full">
      <label
        htmlFor="video-upload"
        className={cn(
          "flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted/40 p-12 transition-colors",
          !disabled && "cursor-pointer hover:border-primary/60 hover:bg-muted",
          disabled && "opacity-50 cursor-not-allowed", // 4. Add disabled styles
          dragOver && !disabled && "border-primary/60 bg-muted"
        )} // Style for drag-over
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* 3. Use the selectedFile prop for the UI */}
        {disabled && selectedFile ? (
          <div className="flex flex-col items-center text-primary">
            <Loader2 className="h-12 w-12 animate-spin" />
            <p className="mt-4 font-semibold">Checking file...</p>
          </div>
        ) : selectedFile ? (
          <div className="flex flex-col items-center text-primary">
            <LucideFileVideo className="h-12 w-12" />
            <p className="mt-4 font-semibold">{selectedFile.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <LucideUploadCloud className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-semibold text-foreground">
              {dragOver ? "Drop your video" : "Drag & drop your video here"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              or click to browse your files
            </p>
          </div>
        )}
      </label>
      <input
        id="video-upload"
        type="file"
        className="sr-only"
        onChange={onFileChange}
        accept="video/*"
        disabled={disabled}
      />
    </div>
  );
}
