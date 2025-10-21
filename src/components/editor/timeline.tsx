// src/components/editor/timeline.tsx
"use client";

import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../../lib/item-type";
import { VideoIcon, AudioWaveformIcon, MusicIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import VideoFilmstrip from "./video-films-trip";

// ## 1. Export Clip Type
// This is exported so the parent page (edit/page.tsx) can use it.
export interface Clip {
  id: string;
  trackId: "V1" | "A1" | "A2";
  title: string;
  clipType: "video" | "audio";
  src: string; // Add src for the filmstrip
  startPercent: number;
  widthPercent: number;
}

// ## 2. TimelineTrack Component
// Defined at the top level, outside the main Timeline function.
interface TimelineTrackProps {
  trackId: "V1" | "A1" | "A2";
  icon: React.ReactNode;
  children: React.ReactNode;
  onMoveClip: (clipId: string, trackId: "V1" | "A1" | "A2") => void;
}

const TimelineTrack: React.FC<TimelineTrackProps> = ({
  trackId,
  icon,
  children,
  onMoveClip,
}) => {
  const dropRef = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CLIP,
    drop: (item: { id: string }) => {
      // Corrected this line
      onMoveClip(item.id, trackId);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className={cn(
        "flex h-20 w-full min-w-max border-b border-muted",
        isOver ? "bg-primary/10" : ""
      )}
    >
      {/* Track Header */}
      <div className="sticky left-0 z-10 flex h-full w-28 shrink-0 flex-col items-center justify-center border-r border-muted bg-background">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{trackId}</span>
        </div>
      </div>
      {/* Track Content (The Drop Target) */}
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
};

// ## 3. TimelineClip Component
// Also defined at the top level. Now it's reachable.
interface TimelineClipProps {
  clip: Clip;
}

const TimelineClip: React.FC<TimelineClipProps> = ({ clip }) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CLIP,
    item: { id: clip.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  drag(dragRef);

  return (
    <div
      ref={dragRef}
      className={cn(
        "absolute top-1/2 h-16 -translate-y-1/2 cursor-grab select-none rounded-md p-0",
        "border-2 border-primary bg-primary/20",
        isDragging ? "opacity-50" : "opacity-100" // Corrected styles
      )}
      style={{
        left: `${clip.startPercent}%`,
        width: `${clip.widthPercent}%`,
      }}
    >
      <div className="h-full w-full overflow-hidden rounded">
        {clip.clipType === "video" ? (
          <VideoFilmstrip src={clip.src} />
        ) : (
          <div className="flex h-full items-center justify-center bg-primary/30 p-2 text-xs font-medium text-primary-foreground">
            {clip.title}
          </div>
        )}
      </div>
    </div>
  );
};

// ## 4. Main Exported Timeline Component
interface TimelineProps {
  clips: Clip[];
  onMoveClip: (clipId: string, newTrackId: "V1" | "A1" | "A2") => void;
}

export function Timeline({ clips, onMoveClip }: TimelineProps) {
  // This return statement is now at the end of the function,
  // and all components it uses (TimelineTrack, TimelineClip)
  // are defined *before* it, in the outer scope.
  return (
    <div className="flex h-full flex-col">
      {/* Timecode Ruler */}
      <div className="h-10 shrink-0 border-b bg-muted/50"></div>

      {/* Scrollable Tracks Area */}
      <div className="h-full w-full overflow-auto">
        <div className="min-w-[2000px]">
          {/* Video Track 1 */}
          <TimelineTrack
            trackId="V1"
            icon={<VideoIcon className="h-4 w-4" />}
            onMoveClip={onMoveClip}
          >
            {clips
              .filter((c) => c.trackId === "V1")
              .map((clip) => (
                <TimelineClip key={clip.id} clip={clip} />
              ))}
          </TimelineTrack>

          {/* Audio Track 1 */}
          <TimelineTrack
            trackId="A1"
            icon={<AudioWaveformIcon className="h-4 w-4" />}
            onMoveClip={onMoveClip}
          >
            {clips
              .filter((c) => c.trackId === "A1")
              .map((clip) => (
                <TimelineClip key={clip.id} clip={clip} />
              ))}
          </TimelineTrack>

          {/* Audio Track 2 */}
          <TimelineTrack
            trackId="A2"
            icon={<MusicIcon className="h-4 w-4" />}
            onMoveClip={onMoveClip}
          >
            {clips
              .filter((c) => c.trackId === "A2")
              .map((clip) => (
                <TimelineClip key={clip.id} clip={clip} />
              ))}
          </TimelineTrack>
        </div>
      </div>
    </div>
  );
}
