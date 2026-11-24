import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

type Options = { enabled?: boolean };

/**
 * Loads a collection from the API and keeps the bundled editorial content
 * as an instant, offline-safe fallback. This means public pages render
 * immediately even if the API is unavailable, while admin edits are
 * reflected as soon as the request completes.
 */
export function useCollection<T>(endpoint: string, fallback: T[], options: Options = {}) {
  const { enabled = true } = options;
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const controller = new AbortController();
    setLoading(true);
    api
      .get<{ data: T[] }>(endpoint, { signal: controller.signal })
      .then((res) => {
        if (!active) return;
        if (Array.isArray(res.data?.data)) setData(res.data.data);
        setError(null);
      })
      .catch((err) => {
        if (!active || controller.signal.aborted) return;
        setError(err?.message ?? "Unable to load live content");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [endpoint, enabled, version]);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  return { data, loading, error, refresh };
}
