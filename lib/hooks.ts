"use client";

/* Thin data hooks over the Server Actions in lib/actions.ts.
   Each page stays a client component and refetches after mutations. */

import { useCallback, useEffect, useState } from "react";
import {
  getAttendanceMarks,
  getBatches,
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
  type DashboardStats,
  type MemberDTO,
  type MemberProfile,
  type PaymentDTO,
  type PlanDTO,
  type RevenuePoint,
  type TrainerDTO,
} from "./actions";

function useAction<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => {
    setData(null);
    setVersion((v) => v + 1);
  }, []);
  useEffect(() => {
    let live = true;
    void fn().then((d) => {
      if (live) setData(d);
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);
  return { data, refresh };
}

export function usePlans() {
  return useAction<PlanDTO[]>(getPlans);
}

export function useMembers() {
  return useAction<MemberDTO[]>(getMembers);
}

export function useMember(id: string) {
  const [data, setData] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => {
    setData(null);
    setLoading(true);
    setVersion((v) => v + 1);
  }, []);
  useEffect(() => {
    let live = true;
    void getMember(id).then((d) => {
      if (live) {
        setData(d);
        setLoading(false);
      }
    });
    return () => {
      live = false;
    };
  }, [id, version]);
  return { data, loading, refresh };
}

export function usePayments(status?: "paid" | "due" | "overdue") {
  const [data, setData] = useState<PaymentDTO[] | null>(null);
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => {
    setData(null);
    setVersion((v) => v + 1);
  }, []);
  useEffect(() => {
    let live = true;
    void getPayments(status).then((d) => {
      if (live) setData(d);
    });
    return () => {
      live = false;
    };
  }, [status, version]);
  return { data, refresh };
}

export function useTrainers() {
  return useAction<TrainerDTO[]>(getTrainers);
}

export function useBatches() {
  return useAction<BatchDTO[]>(getBatches);
}

export function useRoster() {
  return useAction<MemberDTO[]>(getRoster);
}

export function useRevenueSeries() {
  return useAction<RevenuePoint[]>(getRevenueSeries);
}

export function useHeatmap() {
  return useAction<number[][]>(getHeatmap);
}

export function useDashboardStats() {
  return useAction<DashboardStats>(getDashboardStats);
}

export function useAttendanceMarks(batchId: string, dateISO: string) {
  const [data, setData] = useState<Record<string, "present" | "absent"> | null>(null);
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => {
    setData(null);
    setVersion((v) => v + 1);
  }, []);
  useEffect(() => {
    let live = true;
    void getAttendanceMarks(batchId, dateISO).then((d) => {
      if (live) setData(d);
    });
    return () => {
      live = false;
    };
  }, [batchId, dateISO, version]);
  return { data, refresh };
}
