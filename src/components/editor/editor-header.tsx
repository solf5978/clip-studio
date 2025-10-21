// src/app/edit/editor-header.tsx
"use client";

import { useActionState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { LucideSave, LucideDownload, LucideScissors } from "lucide-react";
import { useFormStatus } from "react-dom";
import { saveVideo, type FormState } from "../../app/actions"; // Import save action

// --- Local Helper Components ---
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" disabled={pending}>
      {pending ? "Saving..." : <LucideSave className="mr-2 h-4 w-4" />}
      {pending ? "" : "Save Video"}
    </Button>
  );
}

// Props type for the main component
type EditorHeaderProps = {
  // We pass initial values from the page
  initialTitle: string;
  initialStartTime: string;
  initialEndTime: string;
  // And pass handlers for preview/export
  onPreview: () => void;
  onExport: () => void;
  isProcessing: boolean;
};

// --- Main Header Component ---
export function EditorHeader({
  initialTitle,
  initialStartTime,
  initialEndTime,
  onPreview,
  onExport,
  isProcessing,
}: EditorHeaderProps) {
  // Manage form state for saving
  const initialState: FormState = { error: null, success: null };
  const [state, formAction] = useActionState(saveVideo, initialState);

  return (
    // The form now wraps the header content
    <form action={formAction}>
      <div
        className="flex h-16 shrink-0 items-center justify-between
                      border-b bg-background px-6"
      >
        {/* Project Title Input */}
        <div>
          <Input
            name="title" // Name for FormData
            defaultValue={initialTitle}
            className="w-64 text-lg font-semibold"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <SubmitButton />
          <Button
            type="button" // Important: Prevent form submission
            variant="secondary"
            onClick={onPreview}
            disabled={isProcessing}
          >
            <LucideScissors className="mr-2 h-4 w-4" />
            {isProcessing ? "Processing..." : "Preview Trim"}
          </Button>
          <Button
            type="button" // Important: Prevent form submission
            onClick={onExport}
            disabled={isProcessing}
          >
            <LucideDownload className="mr-2 h-4 w-4" />
            {isProcessing ? "Processing..." : "Export Video"}
          </Button>
        </div>
      </div>

      {/* Hidden inputs to pass data to the saveVideo action */}
      <input type="hidden" name="startTime" value={initialStartTime} />
      <input type="hidden" name="endTime" value={initialEndTime} />

      {/* Display Save Action Messages */}
      {state?.error && (
        <p className="p-2 text-center text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="p-2 text-center text-sm text-emerald-500">
          {state.success}
        </p>
      )}
    </form>
  );
}
