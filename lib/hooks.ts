"use client";

/* High-performance client-side cache and request deduplicator for RepSync Server Actions.
   1. Deduplicates concurrent in-flight requests (prevents duplicate Server Action calls).
   2. Persists data across route transitions for instant page renders without skeleton flashes.
   3. Primes individual resource caches when composite dashboard data is fetched.
   4. Stale-while-revalidate on refresh.
   5. fnRef pattern prevents infinite re-renders from fn identity churn. */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getAttendanceMarks,
  getBatches,
  getDashboardData,
  getDashboardStats,
  getHeatmap,
  getMember,
  getMembers,
  getPayments,
  getPlans,
  getRevenueSeries,
  getRoster,
  getTrainers,
  type BatchDTO,
  type DashboardData,
  type DashboardStats,
  type MemberDTO,
  type MemberProfile,
  type PaymentDTO,
  type PlanDTO,
  type RevenuePoint,
  type TrainerDTO,
} from "./actions";

// Global cache across client components and navigation
const globalCache = new Map<string, unknown>();
const inFlight = new Map<string, Promise<unknown>>();
const listeners = new Map<string, Set<(val: unknown) => void>>();

function subscribe<T>(key: string, fn: (val: T) => void): () => void {
  if (!listeners.has(key)) listeners.set(key, new Set());
  const set = listeners.get(key)!;
  set.add(fn as (val: unknown) => void);
  return () => {
    set.delete(fn as (val: unknown) => void);
  };
}

export function setCache<T>(key: string, val: T): void {
  globalCache.set(key, val);
  const set = listeners.get(key);
  if (set) {
    for (const fn of set) {
      fn(val);
    }
  }
}

function fetchDeduplicated<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key);
  if (existing) return existing as Promise<T>;

  const promise = fn()
    .then((result) => {
      setCache(key, result);
      inFlight.delete(key);
      return result;
    })
    .catch((err) => {
      inFlight.delete(key);
      throw err;
    });

  inFlight.set(key, promise);
  return promise;
}

/* useAction — stable version using fnRef.
   - fnRef keeps the latest fn without being listed as an effect dep.
   - Effect only re-runs when `key` changes (route/param change).
   - Eliminates the render-phase state-update / infinite re-render bug
     that occurred when callers passed inline arrow functions as fn. */
function useAction<T>(key: string, fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(() => (globalCache.get(key) as T) ?? null);
  const [loading, setLoading] = useState<boolean>(() => !globalCache.has(key));

  // Hold the latest fn in a ref so we never need it as an effect dependency
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    // Sync from cache in case another component already populated it
    const cached = globalCache.get(key) as T | undefined;
    if (cached !== undefined) {
      setData(cached);
      setLoading(false);
    }

    const unsub = subscribe<T>(key, (newVal) => {
      setData(newVal);
      setLoading(false);
    });

    // If not cached, trigger deduplicated fetch via ref
    if (!globalCache.has(key)) {
      setLoading(true);
      void fetchDeduplicated(key, () => fnRef.current())
        .catch(() => {})
        .finally(() => setLoading(false));
    }

    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]); // Only key — fn is accessed via ref

  const refresh = useCallback(() => {
    globalCache.delete(key);
    setLoading(true);
    return fetchDeduplicated(key, () => fnRef.current()).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, loading, refresh };
}

export function usePlans() {
  return useAction<PlanDTO[]>("plans", getPlans);
}

export function useMembers() {
  return useAction<MemberDTO[]>("members", getMembers);
}

export function useMember(id: string) {
  const key = `member:${id}`;
  const [data, setData] = useState<MemberProfile | null>(() => (globalCache.get(key) as MemberProfile) ?? null);
  const [loading, setLoading] = useState<boolean>(() => !globalCache.has(key));

  useEffect(() => {
    const cached = globalCache.get(key) as MemberProfile | undefined;
    if (cached !== undefined) {
      setData(cached);
      setLoading(false);
    }

    const unsub = subscribe<MemberProfile>(key, (newVal) => {
      setData(newVal);
      setLoading(false);
    });

    if (!globalCache.has(key)) {
      setLoading(true);
      void fetchDeduplicated(key, () => getMember(id))
        .catch(() => {})
        .finally(() => setLoading(false));
    }

    return unsub;
  }, [key, id]);

  const refresh = useCallback(() => {
    return fetchDeduplicated(key, () => getMember(id));
  }, [key, id]);

  return { data, loading, refresh };
}

export function usePayments(status?: "paid" | "due" | "overdue") {
  const key = `payments:${status ?? "all"}`;
  return useAction<PaymentDTO[]>(key, () => getPayments(status));
}

export function useTrainers() {
  return useAction<TrainerDTO[]>("trainers", getTrainers);
}

export function useBatches() {
  return useAction<BatchDTO[]>("batches", getBatches);
}

export function useRoster() {
  return useAction<MemberDTO[]>("roster", getRoster);
}

export function useRevenueSeries() {
  return useAction<RevenuePoint[]>("revenueSeries", getRevenueSeries);
}

export function useHeatmap() {
  return useAction<number[][]>("heatmap", getHeatmap);
}

export function useDashboardStats() {
  return useAction<DashboardStats>("dashboardStats", getDashboardStats);
}

/* Whole dashboard in one round-trip: primes all individual caches simultaneously */
export function useDashboardData() {
  const fetchAndPrime = useCallback(async () => {
    const d = await getDashboardData();
    // Prime the individual caches so subsequent tabs/pages load in 0ms!
    setCache("dashboardStats", d.stats);
    setCache("revenueSeries", d.revenueSeries);
    setCache("heatmap", d.heatmap);
    setCache("plans", d.plans);
    setCache("members", d.members);
    setCache("payments:all", d.payments);
    setCache("batches", d.batches);
    return d;
  }, []);

  return useAction<DashboardData>("dashboardData", fetchAndPrime);
}

export function useAttendanceMarks(batchId: string, dateISO: string) {
  const key = `marks:${batchId}:${dateISO}`;
  const [data, setData] = useState<Record<string, "present" | "absent"> | null>(
    () => (globalCache.get(key) as Record<string, "present" | "absent">) ?? null
  );

  useEffect(() => {
    const cached = globalCache.get(key) as Record<string, "present" | "absent"> | undefined;
    if (cached !== undefined) {
      setData(cached);
    }

    const unsub = subscribe<Record<string, "present" | "absent">>(key, (newVal) => {
      setData(newVal);
    });

    if (!globalCache.has(key)) {
      void fetchDeduplicated(key, () => getAttendanceMarks(batchId, dateISO)).catch(() => {});
    }

    return unsub;
  }, [key, batchId, dateISO]);

  const refresh = useCallback(() => {
    return fetchDeduplicated(key, () => getAttendanceMarks(batchId, dateISO));
  }, [key, batchId, dateISO]);

  return { data, refresh };
}
