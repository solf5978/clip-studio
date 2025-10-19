// src/components/editor/VideoInfoSheet.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Info } from "lucide-react"; // A nice icon for the trigger

// --- Type definition for metadata (from a URL) ---
interface VideoMetadata {
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

// --- Our Main Component ---
export default function VideoInfoSheet() {
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const searchParams = useSearchParams();
  const videoSrc = searchParams.get("videoSrc");

  // 1. Fetch metadata when the videoSrc from the URL is available
  useEffect(() => {
    if (videoSrc) {
      getVideoMetadata(videoSrc)
        .then(setMetadata)
        .catch((error) => {
          console.error(error);
          setMetadata(null); // Clear on error
        });
    }
  }, [videoSrc]); // Re-run if the videoSrc changes

  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* 2. This trigger button will sit inside the player panel */}
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
            Metadata for the currently loaded video.
          </SheetDescription>
        </SheetHeader>

        {/* 3. Render the metadata */}
        {!videoSrc ? (
          <p>No video loaded.</p>
        ) : !metadata ? (
          <p>Loading metadata...</p>
        ) : (
          <div className="grid gap-4 py-4">
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="source" className="text-right">
                Source
              </Label>
              <Input
                id="source"
                value={videoSrc} // Just show the source URL
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
