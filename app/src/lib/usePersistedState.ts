import { useCallback, useEffect, useState } from 'react';

export function usePersistedState<T>(key: string, initialValue: T) {
  const read = useCallback((): T => {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return initialValue;
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [state, setState] = useState<T>(read);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore quota/serialization errors
    }
  }, [key, state]);

  const set = useCallback((valueOrUpdater: T | ((prev: T) => T)) => {
    setState((prev) => (typeof valueOrUpdater === 'function'
      ? (valueOrUpdater as (p: T) => T)(prev)
      : valueOrUpdater));
  }, []);

  const remove = useCallback(() => {
    try { localStorage.removeItem(key); } catch {}
  }, [key]);

  return [state, set, remove] as const;
}



