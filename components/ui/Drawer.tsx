"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  sub?: string;
  children: React.ReactNode;
}

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function Drawer({ open, onClose, title, sub, children }: DrawerProps) {
  // Render at document.body so `fixed` is always viewport-relative.
  // (Ancestor transforms — e.g. framer-motion page wrappers — would
  // otherwise hijack fixed positioning and push the panel off-screen.)
  const mounted = useMounted();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col rounded-l-3xl border border-white/10 bg-[#0f172a]/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.65)] backdrop-blur-3xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-wide text-[#f4f1ea]">{title}</h3>
                {sub && <p className="mt-1 text-xs tracking-wide text-stone-400">{sub}</p>}
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-stone-400 transition hover:border-[#d9a441]/50 hover:text-[#f5d47e]"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
