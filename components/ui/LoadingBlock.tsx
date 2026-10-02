"use client";

export function LoadingBlock({ lines = 4, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`glass-panel p-6 ${className}`}>
      <div className="space-y-3 animate-pulse">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded-full bg-white/10"
            style={{ width: `${88 - i * 12}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function LoadingGrid({ cards = 4 }: { cards?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="glass-panel p-6 animate-pulse">
          <div className="h-3 w-24 rounded-full bg-white/10" />
          <div className="mt-4 h-8 w-32 rounded-lg bg-white/10" />
          <div className="mt-3 h-3 w-20 rounded-full bg-white/5" />
        </div>
      ))}
    </div>
  );
}
