// src/app/edit/editor-actions.tsx
"use client";

import { Button } from "../../components/ui/button";
import { LucideSave, LucideDownload, LucideScissors } from "lucide-react";
import { useFormStatus } from "react-dom";

type EditorActionsProps = {
  onPreview: () => void;
  onExport: () => void; // Add the onExport prop
  isProcessing: boolean;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="outline" disabled={pending}>
      {pending ? "Saving..." : <LucideSave className="mr-2 h-4 w-4" />}
      {/* Update the button text */}
      {pending ? "" : "Save Video"}
    </Button>
  );
}

export function EditorActions({
  onPreview,
  onExport, // Destructure the new prop
  isProcessing,
}: EditorActionsProps) {
  return (
    <div className="flex items-center gap-4">
      <SubmitButton />
      <Button variant="secondary" onClick={onPreview} disabled={isProcessing}>
        <LucideScissors className="mr-2 h-4 w-4" />
        {isProcessing ? "Processing..." : "Preview Trim"}
      </Button>
      {/* Connect the onExport function here and disable the button while processing */}
      <Button onClick={onExport} disabled={isProcessing}>
        <LucideDownload className="mr-2 h-4 w-4" />
        {isProcessing ? "Processing..." : "Export Video"}
      </Button>
    </div>
  );
}
