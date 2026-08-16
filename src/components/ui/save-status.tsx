"use client";

import { Check, Loader2, AlertTriangle } from "lucide-react";
import type { SaveState } from "@/lib/hooks/use-autosave";

/** Inline autosave indicator. Renders nothing until the first save is attempted. */
export function SaveStatus({ state, show = true }: { state: SaveState; show?: boolean }) {
  if (!show || state === "idle") return null;

  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
      {state === "saving" && (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
        </>
      )}
      {state === "saved" && (
        <>
          <Check className="w-3.5 h-3.5 text-teal" /> Saved
        </>
      )}
      {state === "error" && (
        <span className="flex items-center gap-1.5 text-coral">
          <AlertTriangle className="w-3.5 h-3.5" /> Not saved
        </span>
      )}
    </span>
  );
}
