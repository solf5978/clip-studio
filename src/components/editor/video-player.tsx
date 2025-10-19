// src/components/editor/VideoPlayer.tsx
"use client";

interface VideoPlayerProps {
  src: string | null; // Receive the URL from the parent
}

export default function VideoPlayer({ src }: VideoPlayerProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-black">
      {!src ? (
        <div className="flex aspect-video w-full max-w-4xl items-center justify-center bg-muted text-muted-foreground">
          <span>Drop a video in the Media Library to begin</span>
        </div>
      ) : (
        <video
          key={src} // 4. Use the src as a key to force re-load
          src={src}
          controls
          className="h-full w-full object-contain"
        />
      )}
    </div>
  );
}
