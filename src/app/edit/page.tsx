// src/app/edit/page.tsx
"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { fetchFile } from "@ffmpeg/util";
import { getFFmpeg } from "@/lib/ffmpeg";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";
// Import the new editor components

import { MediaLibrary } from "@/components/editor/media-library";
import { Timeline, type Clip } from "@/components/editor/timeline";
import { ToolPanel } from "@/components/editor/tool-panel";
import { EditorHeader } from "@/components/editor/editor-header";
import VideoInfoSheet from "@/components/editor/video-in-sheet";
import VideoPlayer from "@/components/editor/video-player";

function EditorLogic() {
  const searchParams = useSearchParams();

  // --- 5. All major state lives here ---
  const [clips, setClips] = useState<Clip[]>([]);
  const [activeMediaFile, setActiveMediaFile] = useState<File | null>(null);
  const [activeMediaUrl, setActiveMediaUrl] = useState<string | null>(null);

  // --- FFmpeg State (unchanged) ---
  const [title, setTitle] = useState("My Awesome Video");
  const [startTime, setStartTime] = useState("0");
  const [endTime, setEndTime] = useState("10");
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);

  // --- 1. MODIFIED: On initial load ---
  useEffect(() => {
    const videoSrc = searchParams.get("videoSrc");
    if (videoSrc) {
      setActiveMediaUrl(videoSrc);
      // Add a clip to the timeline for this video
      addClip(videoSrc, "Initial Video", "video", 0); // Pass title
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only run once on mount

  const handleMediaSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setActiveMediaFile(file); // Set this as the *active* file for the player
    setActiveMediaUrl(url);

    // Add a new clip to the timeline
    addClip(
      url,
      file.name, // Pass the file's name
      file.type.startsWith("video/") ? "video" : "audio",
      0 // Default to start
    );
  };

  /**
   * 8. Timeline clip management functions
   */
  const addClip = (
    src: string,
    title: string,
    clipType: "video" | "audio",
    startPercent: number
  ) => {
    const newClip: Clip = {
      id: uuidv4(),
      src: src,
      title: title, // Use the passed-in title
      clipType,
      trackId: clipType === "video" ? "V1" : "A1",
      startPercent,
      widthPercent: 20, // Default width
    };

    // --- THIS IS THE FIX ---
    // We now *append* the new clip to the old array
    setClips((prevClips) => [...prevClips, newClip]);
  };

  const handlePreviewTrim = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setProgressMessage("Initializing FFmpeg...");

    const ffmpeg = await getFFmpeg(({ message }) => {
      setProgressMessage(message);
    });

    const searchParams = new URLSearchParams(window.location.search);
    const originalVideoSrc = searchParams.get("videoSrc");

    if (!originalVideoSrc) {
      alert("No source video found.");
      setIsProcessing(false);
      return;
    }

    try {
      await ffmpeg.writeFile("input.mp4", await fetchFile(originalVideoSrc));
      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-ss",
        startTime,
        "-to",
        endTime,
        "-c:v",
        "copy",
        "-c:a",
        "copy",
        "output.mp4",
      ]);
      const data = await ffmpeg.readFile("output.mp4");
      if (data instanceof Uint8Array) {
        // This copies the data from a (Shared)ArrayBuffer into a normal one
        const dataCopy = new Uint8Array(data);

        // Now create the Blob with the copied data
        const url = URL.createObjectURL(
          new Blob([dataCopy], { type: "video/mp4" })
        );

        setVideoUrl(url);
        setProgressMessage("Trim preview complete!");
      } else {
        // This handles the 'string' case, satisfying TypeScript
        throw new Error("FFmpeg readFile returned unexpected data type.");
      }
    } catch (error) {
      console.error("Error during trimming:", error);
      setProgressMessage(`Error: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setProgressMessage("Preparing for export...");

    const ffmpeg = await getFFmpeg(({ message }) => {
      setProgressMessage(message);
    });

    const searchParams = new URLSearchParams(window.location.search);
    const originalVideoSrc = searchParams.get("videoSrc");

    if (!originalVideoSrc) {
      alert("No source video found.");
      setIsProcessing(false);
      return;
    }

    try {
      await ffmpeg.writeFile("input.mp4", await fetchFile(originalVideoSrc));
      setProgressMessage("Exporting video... (using copy codec)");
      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-ss",
        startTime,
        "-to",
        endTime,
        "-c:v",
        "copy",
        "-c:a",
        "copy",
        "output.mp4",
      ]);
      const data = await ffmpeg.readFile("output.mp4");
      if (data instanceof Uint8Array) {
        // This copies the data from a (Shared)ArrayBuffer into a normal one
        const dataCopy = new Uint8Array(data);

        // Now create the Blob with the copied data
        const url = URL.createObjectURL(
          new Blob([dataCopy], { type: "video/mp4" })
        );

        // This logic is for the EXPORT function
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title.replace(/\s+/g, "_") || "clip_export"}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setProgressMessage("Export complete!");
      } else {
        // This handles the 'string' case, satisfying TypeScript
        throw new Error("FFmpeg readFile returned unexpected data type.");
      }
    } catch (error) {
      console.error("Error during export:", error);
      setProgressMessage(`Error: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const moveClip = (clipId: string, newTrackId: "V1" | "A1" | "A2") => {
    setClips((prevClips) =>
      prevClips.map((clip) => {
        if (clip.id === clipId) {
          // Add validation (e.g., video can't go to audio track)
          if (clip.clipType === "video" && newTrackId !== "V1") {
            alert("Video can only be on V1.");
            return clip;
          }
          if (clip.clipType === "audio" && newTrackId === "V1") {
            alert("Audio cannot be on V1.");
            return clip;
          }
          return { ...clip, trackId: newTrackId };
        }
        return clip;
      })
    );
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <main className="flex h-screen flex-col overflow-hidden">
        <EditorHeader
          initialTitle={title}
          initialStartTime={startTime}
          initialEndTime={endTime}
          onPreview={handlePreviewTrim}
          onExport={handleExport}
          isProcessing={isProcessing}
        />
        <ResizablePanelGroup direction="vertical" className="flex-grow">
          <ResizablePanel defaultSize={70}>
            <ResizablePanelGroup direction="horizontal" className="h-full">
              {/* 9. Give MediaLibrary the callback */}
              <ResizablePanel
                defaultSize={20}
                minSize={15}
                className="border-r"
              >
                <MediaLibrary onMediaSelect={handleMediaSelect} />
              </ResizablePanel>
              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={80}>
                <ResizablePanelGroup direction="horizontal">
                  <ResizablePanel
                    defaultSize={75}
                    minSize={50}
                    className="relative flex"
                  >
                    {/* 10. Give VideoPlayer the active URL */}
                    <VideoPlayer
                      src={videoUrl || activeMediaUrl} // Prioritize FFmpeg preview
                    />
                    <VideoInfoSheet file={activeMediaFile} />
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel
                    defaultSize={25}
                    minSize={20}
                    className="border-l"
                  >
                    <ToolPanel />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={30} minSize={20} className="border-t">
            <div className="flex h-full flex-col">
              <div className="flex-grow">
                {/* 11. Give Timeline the clips and handlers */}
                <Timeline clips={clips} onMoveClip={moveClip} />
              </div>
              <div className="h-24 shrink-0 border-t bg-muted/20 p-2 overflow-y-auto">
                {/* ... (log area is unchanged) ... */}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </DndProvider>
  );
}

// --- MAIN EDITOR PAGE (wraps logic in Suspense) ---
export default function EditPage() {
  return (
    <Suspense fallback={<div>Loading Editor...</div>}>
      <EditorLogic />
    </Suspense>
  );
}
