// src/components/editor/VideoFilmstrip.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { getFFmpeg } from "../../lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { Skeleton } from "../ui/skeleton";

// Helper function to draw an image onto a canvas
async function drawImageOnCanvas(
  canvas: HTMLCanvasElement,
  imageUrl: string,
  x: number, // The horizontal position to start drawing
  frameHeight: number,
  frameWidth: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return reject("Could not get canvas context");

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      // Draw the image scaled to fit the canvas height
      ctx.drawImage(img, x, 0, frameWidth, frameHeight);
      URL.revokeObjectURL(imageUrl); // Clean up the blob URL
      resolve();
    };
    img.onerror = (err) => {
      reject(err);
    };
  });
}

interface VideoFilmstripProps {
  src: string | null;
}

export default function VideoFilmstrip({ src }: VideoFilmstripProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("loading");
  const [progress, setProgress] = useState(0);
  const videoSrc = src;

  const FRAME_WIDTH = 150; // Width of each thumbnail
  const FRAME_HEIGHT = 84; // Height of each (150 / (16/9))

  useEffect(() => {
    if (!videoSrc) {
      setStatus("error");
      return;
    }

    const extractFrames = async () => {
      const ffmpeg = await getFFmpeg();
      const canvas = canvasRef.current;
      if (!canvas) return;

      ffmpeg.on("progress", ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });

      try {
        setStatus("loading");
        setProgress(0);

        // 1. Load the video file into FFmpeg's memory
        await ffmpeg.writeFile("input.mp4", await fetchFile(videoSrc));

        // 2. Run the FFmpeg command
        // -vf "fps=1/5,scale=150:-1": Video filter to extract 1 frame every 5 seconds
        //    and scale it to 150px width, maintaining aspect ratio
        await ffmpeg.exec([
          "-i",
          "input.mp4",
          "-vf",
          `fps=1/5,scale=${FRAME_WIDTH}:-1`,
          "frame-%03d.png", // Output as frame-001.png, frame-002.png, etc.
        ]);

        setStatus("drawing");

        // 3. Get the list of all files in FFmpeg's memory
        const allFiles = (await ffmpeg.listDir(".")) as {
          name: string;
          isDir: boolean;
        }[];
        const frameFiles = allFiles
          .filter((f) => f.name.startsWith("frame-"))
          .sort();

        if (frameFiles.length === 0) {
          throw new Error("No frames were extracted.");
        }

        // 4. Set canvas size to fit all frames
        canvas.width = frameFiles.length * FRAME_WIDTH;
        canvas.height = FRAME_HEIGHT;

        // 5. Draw each frame onto the canvas
        let currentX = 0;
        for (const file of frameFiles) {
          const data = (await ffmpeg.readFile(file.name)) as Uint8Array;
          const blob = new Blob([data.buffer], { type: "image/png" });
          const url = URL.createObjectURL(blob);

          await drawImageOnCanvas(
            canvas,
            url,
            currentX,
            FRAME_HEIGHT,
            FRAME_WIDTH
          );
          currentX += FRAME_WIDTH;

          // Optional: Clean up file from FFmpeg memory
          await ffmpeg.deleteFile(file.name);
        }

        setStatus("done");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    extractFrames();
  }, [videoSrc]);

  if (status === "loading" || status === "drawing") {
    return (
      <div className="flex items-center space-x-2 p-2">
        <Skeleton className="h-16 w-full" />
        <span className="text-xs text-muted-foreground">
          {status === "loading"
            ? `Extracting: ${progress}%`
            : "Drawing frames..."}
        </span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-16 items-center justify-center bg-destructive/10 p-2 text-destructive">
        Error loading filmstrip.
      </div>
    );
  }

  // 'done' state
  return <canvas ref={canvasRef} className="h-16" />;
}
