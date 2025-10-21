// sr../editor/VideoInfoSheet.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "../ui/sheet";

import { Info } from "lucide-react"; // A nice icon for the trigger

// --- Type definition for metadata (from a URL) ---
interface VideoMetadata {
  name: string;
  size: number;
  duration: number;
  width: number;
  height: number;
}

// --- Helper: Gets metadata from a video URL ---
function getVideoMetadata(
  src: string
): Promise<Pick<VideoMetadata, "duration" | "width" | "height">> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = function () {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      });
    };

    video.onerror = function () {
      reject("Error loading video metadata from URL.");
    };

    video.src = src; // Just set the src directly
  });
}

// --- Helper: Formats seconds into HH:MM:SS ---
function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

interface VideoInfoSheetProps {
  file: File | null;
}

// --- Our Main Component ---
export default function VideoInfoSheet({ file }: VideoInfoSheetProps) {
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);

  // 1. Fetch metadata when the videoSrc from the URL is available
  useEffect(() => {
    if (file && file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file); // Create a URL to read
      getVideoMetadata(url)
        .then((meta) => {
          setMetadata({
            ...meta,
            name: file.name,
            size: file.size,
          });
          URL.revokeObjectURL(url); // Clean up the temporary URL
        })
        .catch((error) => {
          console.error(error);
          setMetadata(null); // Clear on error
        });
    } else {
      setMetadata(null); // Clear metadata if no file or not a video
    }
  }, [file]); // Dependency is the file object

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-10"
        >
          <Info className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Video Properties</SheetTitle>
          <SheetDescription>
            Metadata for the currently active media.
          </SheetDescription>
        </SheetHeader>

        {/* 5. Render metadata if it exists */}
        {!metadata ? (
          <p className="py-4">No video selected or data unavailable.</p>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={metadata.name}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size" className="text-right">
                Size
              </Label>
              <Input
                id="size"
                value={formatBytes(metadata.size)}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Input
                id="duration"
                value={formatDuration(metadata.duration)}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dimensions" className="text-right">
                Dimensions
              </Label>
              <Input
                id="dimensions"
                value={`${metadata.width} x ${metadata.height}`}
                readOnly
                className="col-span-3"
              />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
