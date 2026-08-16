"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type SaveState = "idle" | "saving" | "saved" | "error";

interface AutoSavedRowOptions<T> {
  /** Table holding one row per household (household_id must be unique). */
  table: string;
  /** Values used before the row loads, and when the household has no row yet. */
  defaults: T;
  /** Maps a raw DB row to typed values. */
  fromRow: (row: Record<string, unknown>) => T;
  /** Maps typed values to DB columns (household_id/user_id/updated_at are added). */
  toRow: (values: T) => Record<string, unknown>;
  debounceMs?: number;
}

/**
 * Loads a household's single settings row and auto-saves edits back to it.
 *
 * The debounce is flushed when the component unmounts or the tab is hidden, so
 * navigating away right after an edit still persists it — a plain debounced
 * effect would have its timer cleared on unmount and silently drop the change.
 */
export function useAutoSavedRow<T extends object>(options: AutoSavedRowOptions<T>) {
  const { table, defaults, debounceMs = 600 } = options;

  const [values, setValuesState] = useState<T>(defaults);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  // Keep the mappers fresh without making them effect dependencies.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const householdId = useRef<string | null>(null);
  const userId = useRef<string | null>(null);
  const latest = useRef<T>(defaults);
  const dirty = useRef(false);

  // Load the household's row once.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        userId.current = user.id;

        const { data: profile } = await supabase
          .from("profiles")
          .select("household_id")
          .eq("id", user.id)
          .maybeSingle();
        householdId.current = profile?.household_id ?? null;
        if (!householdId.current) return;

        const { data: row, error } = await supabase
          .from(table)
          .select("*")
          .eq("household_id", householdId.current)
          .maybeSingle();
        if (error) throw error;

        // Don't clobber edits the user made while the row was in flight.
        if (active && row && !dirty.current) {
          const parsed = optionsRef.current.fromRow(row);
          latest.current = parsed;
          setValuesState(parsed);
        }
      } catch (err) {
        console.error(`Error loading ${table}:`, err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [table]);

  /** Writes pending changes immediately. Safe to call when nothing is pending. */
  const flush = useCallback(async () => {
    if (!dirty.current || !householdId.current) return;
    dirty.current = false;
    setSaveState("saving");

    const supabase = createClient();
    // supabase-js resolves with { error } rather than throwing, so this must be
    // inspected — otherwise a rejected write still renders as "Saved".
    const { error } = await supabase.from(table).upsert(
      {
        household_id: householdId.current,
        user_id: userId.current,
        ...optionsRef.current.toRow(latest.current),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "household_id" }
    );

    if (error) {
      dirty.current = true; // leave it pending so the next edit retries
      console.error(`Error saving ${table}:`, error);
      setSaveState("error");
      return;
    }
    setSaveState("saved");
  }, [table]);

  const setValues = useCallback((patch: Partial<T>) => {
    dirty.current = true;
    setValuesState((prev) => {
      const next = { ...prev, ...patch };
      latest.current = next;
      return next;
    });
  }, []);

  // Debounced save on every change.
  useEffect(() => {
    if (loading || !dirty.current) return;
    setSaveState("saving");
    const timer = setTimeout(() => {
      void flush();
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [values, loading, debounceMs, flush]);

  // Flush on unmount (in-app navigation) and when the tab is backgrounded.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") void flush();
    };
    const onPageHide = () => {
      void flush();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      void flush();
    };
  }, [flush]);

  return {
    values,
    setValues,
    loading,
    saveState,
    /** False when the user has no household — nothing can be persisted. */
    canSave: !loading && householdId.current !== null,
  };
}
