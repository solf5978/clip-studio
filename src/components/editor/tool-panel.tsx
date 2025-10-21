// sr../editor/tool-panel.tsx
"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  LucideScissors, // Trim
  LucideCaseUpper, // Text (Placeholder)
  LucideSlidersHorizontal, // Filter (Placeholder)
  LucideGauge, // Change Speed
  LucideMinimize2, // Compress
  LucideReplace, // Converter
  LucideCrop, // Crop
  LucideCombine, // Merge
  LucideExpand, // Resize
  LucideUndo2, // Reverse
  LucideRotateCw, // Rotate
  LucideSplit, // Splitter
} from "lucide-react";

// Define possible tools (Sorted Alphabetically, Trim added at end)
type Tool =
  | "change speed"
  | "compress"
  | "converter"
  | "crop"
  | "merge"
  | "resize"
  | "reverse"
  | "rotate"
  | "splitter"
  | "trim"
  // Keep placeholders for potential future tools
  | "text"
  | "filter";

// Helper function to capitalize tool names for display
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function ToolPanel() {
  // Default to 'trim' or another sensible default
  const [activeTool, setActiveTool] = useState<Tool>("trim");

  // Add cases for the new tools
  const renderToolOptions = () => {
    switch (activeTool) {
      case "trim":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="start-time">Start Time (s)</Label>
              <Input id="start-time" type="number" defaultValue="0" />
            </div>
            <div>
              <Label htmlFor="end-time">End Time (s)</Label>
              <Input id="end-time" type="number" defaultValue="10" />
            </div>
          </div>
        );
      case "change speed":
        return (
          <p className="text-sm text-muted-foreground">
            Speed options (e.g., slider)...
          </p>
        );
      case "compress":
        return (
          <p className="text-sm text-muted-foreground">
            Compression options (e.g., quality)...
          </p>
        );
      case "converter":
        return (
          <p className="text-sm text-muted-foreground">
            Format conversion options (e.g., MP4, GIF)...
          </p>
        );
      case "crop":
        return (
          <p className="text-sm text-muted-foreground">
            Cropping options (aspect ratio, handles)...
          </p>
        );
      case "merge":
        return (
          <p className="text-sm text-muted-foreground">
            Options to select videos to merge...
          </p>
        );
      case "resize":
        return (
          <p className="text-sm text-muted-foreground">
            Resize options (width, height, resolution)...
          </p>
        );
      case "reverse":
        return (
          <p className="text-sm text-muted-foreground">
            Options for reversing video...
          </p>
        );
      case "rotate":
        return (
          <p className="text-sm text-muted-foreground">
            Rotation options (90°, 180°, flip)...
          </p>
        );
      case "splitter":
        return (
          <p className="text-sm text-muted-foreground">
            Splitting options (e.g., by time, number of parts)...
          </p>
        );
      case "text":
        return (
          <p className="text-sm text-muted-foreground">
            Text options will go here...
          </p>
        );
      case "filter":
        return (
          <p className="text-sm text-muted-foreground">
            Filter options will go here...
          </p>
        );
      default:
        // Ensure exhaustive check if needed, or return null
        const exhaustiveCheck: never = activeTool;
        return null;
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Tool Selection Buttons - Use Grid for wrapping */}
      <div className="grid grid-cols-4 gap-2 border-b pb-4 mb-4 shrink-0">
        <Button
          variant={activeTool === "change speed" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setActiveTool("change speed")}
          aria-label="Change Speed Tool"
        >
          <LucideGauge className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTool === "compress" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setActiveTool("compress")}
          aria-label="Compress Tool"
        >
          <LucideMinimize2 className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTool === "converter" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setActiveTool("converter")}
          aria-label="Converter Tool"
        >
          <LucideReplace className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTool === "crop" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setActiveTool("crop")}
          aria-label="Crop Tool"
        >
          <LucideCrop className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTool === "merge" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setActiveTool("merge")}
          aria-label="Merge Tool"
        >
          <LucideCombine className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTool === "resize" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setActiveTool("resize")}
          aria-label="Resize Tool"
        >
          <LucideExpand className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTool === "reverse" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setActiveTool("reverse")}
          aria-label="Reverse Tool"
        >
          <LucideUndo2 className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTool === "rotate" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setActiveTool("rotate")}
          aria-label="Rotate Tool"
        >
          <LucideRotateCw className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTool === "splitter" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setActiveTool("splitter")}
          aria-label="Splitter Tool"
        >
          <LucideSplit className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTool === "trim" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setActiveTool("trim")}
          aria-label="Trim Tool"
        >
          <LucideScissors className="h-5 w-5" />
        </Button>

        {/* Keep placeholders */}
        <Button
          variant={activeTool === "text" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setActiveTool("text")}
          aria-label="Text Tool"
        >
          <LucideCaseUpper className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTool === "filter" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setActiveTool("filter")}
          aria-label="Filter Tool"
        >
          <LucideSlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Dynamic Tool Options Area */}
      <div className="grow overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 capitalize">
          {capitalize(activeTool)} Options
        </h3>
        {renderToolOptions()}
      </div>
    </div>
  );
}
