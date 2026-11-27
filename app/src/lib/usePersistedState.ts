import { useCallback, useEffect, useRef, useState } from 'react';

/** What was stored under `key` but refused: kept, untouched, under `backupKey`. */
export interface RejectedValue {
  key: string;
  backupKey: string;
  reason: string;
}

export interface PersistedRead<T> {
  value: T;
  rejected?: RejectedValue;
}

/** Where a refused value is kept, so the write-back that follows cannot destroy it. */
export function backupKeyFor(key: string): string {
  return `${key}.rejected-backup`;
}

/**
 * Read `key` from `storage`. A value that is not JSON, or that `validate`
 * refuses, yields `initialValue` — and, because the hook writes its state
 * straight back to `key`, the raw value is first copied to `backupKeyFor(key)`
 * so it can be recovered by hand.
 */
export function readPersisted<T>(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  key: string,
  initialValue: T,
  validate?: (value: unknown) => value is T,
): PersistedRead<T> {
  let raw: string | null;
  try {
    raw = storage.getItem(key);
  } catch {
    return { value: initialValue };
  }
  if (raw == null) return { value: initialValue };

  let reason: string;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!validate || validate(parsed)) return { value: parsed as T };
    reason = 'it does not match the cv.json schema';
  } catch {
    reason = 'it is not valid JSON';
  }

  const backupKey = backupKeyFor(key);
  try {
    storage.setItem(backupKey, raw);
  } catch {
    // The backup could not be written (quota, private mode). The refusal is
    // still reported, so the user knows the stored value was not loaded.
  }
  return { value: initialValue, rejected: { key, backupKey, reason } };
}

export interface PersistedStateOptions<T> {
  /** Accept a stored value only when this returns true (e.g. a schema check). */
  validate?: (value: unknown) => value is T;
  /** Called once, after mount, when the stored value was refused. */
  onRejected?: (rejected: RejectedValue) => void;
}

export function usePersistedState<T>(key: string, initialValue: T, options: PersistedStateOptions<T> = {}) {
  const { validate, onRejected } = options;
  const [first] = useState<PersistedRead<T>>(() => readPersisted(localStorage, key, initialValue, validate));
  const [state, setState] = useState<T>(first.value);

  const reported = useRef(false);
  useEffect(() => {
    if (first.rejected && !reported.current) {
      reported.current = true;
      onRejected?.(first.rejected);
    }
  }, [first, onRejected]);

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
    try { localStorage.removeItem(key); } catch { /* ignore storage errors */ }
  }, [key]);

  return [state, set, remove] as const;
}
