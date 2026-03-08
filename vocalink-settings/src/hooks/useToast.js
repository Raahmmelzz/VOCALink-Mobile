import { useState, useCallback } from "react";

/**
 * useToast
 * Lightweight toast notification system.
 * show(message, type) — type: "success" | "error" | "info"
 */
export function useToast() {
  const [toast, setToast] = useState(null);

  const show = useCallback((msg, type = "success") => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 2400);
  }, []);

  return { toast, show };
}
