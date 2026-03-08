import { useState, useCallback } from "react";

/**
 * useAppNavigation
 * Stack-based screen navigation — supports push and go-back.
 */
export function useAppNavigation(initial = "settings") {
  const [stack, setStack] = useState([initial]);
  const current = stack[stack.length - 1];

  const navigate = useCallback((screen) => {
    setStack((s) => [...s, screen]);
  }, []);

  const goBack = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  return { screen: current, navigate, goBack, canBack: stack.length > 1 };
}
