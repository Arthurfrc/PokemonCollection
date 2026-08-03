// src/hooks/useToast.ts

import { useState, useCallback } from "react";

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const showToast = useCallback((msg: string) => setMessage(msg), []);
  const hideToast = useCallback(() => setMessage(null), []);
  return { message, showToast, hideToast };
}