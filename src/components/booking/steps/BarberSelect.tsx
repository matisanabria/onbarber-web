import { useEffect, useState } from "react";
import { cn } from "../lib/cn";
import { getBarbers } from "../lib/api";
import type { Barber } from "../types";

interface BarberSelectProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

function BarberSkeleton() {
  return (
    <div className="rounded-xl border-2 border-neutral-700 bg-neutral-800/60 overflow-hidden">
      <div className="w-full aspect-[4/5] bg-neutral-700 animate-pulse" />
      <div className="p-3 sm:p-4">
        <div className="h-5 w-3/4 bg-neutral-700 animate-pulse rounded" />
      </div>
    </div>
  );
}

export default function BarberSelect({ selectedId, onSelect }: BarberSelectProps) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getBarbers().then((data) => {
      setBarbers(data);
      setLoaded(true);
    });
  }, []);

  return (
    <div>
      <h2 className="font-bebas text-2xl sm:text-3xl text-white mb-4 sm:mb-6">Elegí tu barbero</h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {!loaded ? (
          <>
            <BarberSkeleton />
            <BarberSkeleton />
          </>
        ) : (
          barbers.map((barber) => (
            <button
              key={barber.id}
              onClick={() => onSelect(barber.id)}
              className={cn(
                "rounded-xl border-2 transition-all overflow-hidden active:scale-[0.97]",
                selectedId === barber.id
                  ? "border-brand-yellow bg-brand-yellow/10 shadow-[0_0_20px_rgba(237,183,23,0.15)]"
                  : "border-neutral-700 bg-neutral-800/60 active:border-brand-yellow/40"
              )}
            >
              {barber.photo_url ? (
                <img
                  src={barber.photo_url}
                  alt={barber.name}
                  className="w-full aspect-[4/5] object-cover"
                />
              ) : (
                <div className={cn(
                  "w-full aspect-[4/5] flex items-center justify-center text-5xl sm:text-6xl font-bold",
                  selectedId === barber.id
                    ? "bg-brand-yellow/20 text-brand-yellow"
                    : "bg-neutral-700/50 text-neutral-400"
                )}>
                  {barber.name[0]}
                </div>
              )}
              <div className="p-3 sm:p-4">
                <span className={cn(
                  "text-base sm:text-lg font-bold font-bebas tracking-wide",
                  selectedId === barber.id ? "text-brand-yellow" : "text-white"
                )}>
                  {barber.name}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
