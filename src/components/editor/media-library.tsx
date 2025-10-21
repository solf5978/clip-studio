// src/components/editor/media-library.tsx
"use client"; // This will likely need client-side interactivity later
import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import {
  UploadCloud,
  FileVideo,
  FileImage,
  FileAudio,
  File,
} from "lucide-react";

function FileTypeIcon({ fileType }: { fileType: string }) {
  if (fileType.startsWith("video/")) {
    return <FileVideo className="h-5 w-5 shrink-0 text-muted-foreground" />;
  }
  if (fileType.startsWith("image/")) {
    return <FileImage className="h-5 w-5 shrink-0 text-muted-foreground" />;
  }
  if (fileType.startsWith("audio/")) {
    return <FileAudio className="h-5 w-5 shrink-0 text-muted-foreground" />;
  }
  return <File className="h-5 w-5 shrink-0 text-muted-foreground" />;
}

// 1. Define the props, including the new callback
interface MediaLibraryProps {
  onMediaSelect: (file: File) => void;
}

export function MediaLibrary({ onMediaSelect }: MediaLibraryProps) {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter(
      (file) =>
        file.type.startsWith("video/") ||
        file.type.startsWith("image/") ||
        file.type.startsWith("audio/")
    );

    setMediaFiles((prevFiles) => [...prevFiles, ...newFiles]);

    // 2. Automatically select the FIRST file that was dropped
    if (newFiles.length > 0) {
      onMediaSelect(newFiles[0]);
    }
  };

  // --- (Event Handlers are unchanged) ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="flex h-full flex-col"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="border-b p-4">
        <h3 className="font-semibold">Media Library</h3>
      </div>

      <div
        className={`grow space-y-2 overflow-y-auto p-4 ${
          dragOver ? "bg-primary/10" : ""
        }`}
      >
        {/* --- (Dropzone UI is unchanged) --- */}
        {mediaFiles.length === 0 && !dragOver && (
          <div
            className="flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center text-muted-foreground"
            onClick={triggerFileInput}
          >
            <UploadCloud className="h-8 w-8 mb-2" />
            <p className="font-semibold">Drag & drop media</p>
            <p className="text-xs">Video, audio, or images</p>
          </div>
        )}
        {dragOver && (
          <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary p-4 text-center text-primary">
            <UploadCloud className="h-8 w-8 mb-2" />
            <p className="font-semibold">Drop to upload</p>
          </div>
        )}

        {/* 3. Make each file in the list CLICKABLE */}
        {mediaFiles.length > 0 && (
          <div className="space-y-2">
            {mediaFiles.map((file, index) => (
              <button
                key={index}
                className="flex w-full items-center space-x-2 rounded-md bg-muted p-2 text-sm text-left hover:bg-muted/80"
                onClick={() => onMediaSelect(file)} // 4. Call callback on click
              >
                <FileTypeIcon fileType={file.type} />
                <span className="grow truncate" title={file.name}>
                  {file.name}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* --- ("Add More" button and file input are unchanged) --- */}
      {mediaFiles.length > 0 && (
        <div className="border-t p-4">
          <Button onClick={triggerFileInput} className="w-full">
            Add More Media
          </Button>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*,image/*,audio/*"
        multiple
        className="hidden"
      />
    </div>
  );
}
