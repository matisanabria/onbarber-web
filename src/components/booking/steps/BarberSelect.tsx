import { useEffect, useState } from "react";
import { cn } from "../lib/cn";
import { getBarbers } from "../lib/api";
import type { Barber } from "../types";

interface BarberSelectProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function BarberSelect({ selectedId, onSelect }: BarberSelectProps) {
  const [barbers, setBarbers] = useState<Barber[]>([]);

  useEffect(() => {
    getBarbers().then(setBarbers);
  }, []);

  return (
    <div>
      <h2 className="font-bebas text-2xl sm:text-3xl text-white mb-6">Elegí tu barbero</h2>
      <div className="grid grid-cols-2 gap-4">
        {barbers.map((barber) => (
          <button
            key={barber.id}
            onClick={() => onSelect(barber.id)}
            className={cn(
              "rounded-xl border-2 transition-all overflow-hidden",
              selectedId === barber.id
                ? "border-brand-yellow bg-brand-yellow/10"
                : "border-neutral-700 bg-neutral-800/60 hover:border-brand-yellow/40 hover:bg-neutral-800"
            )}
          >
            {barber.photo_url ? (
              <img
                src={barber.photo_url}
                alt={barber.name}
                className="w-full aspect-square object-cover"
              />
            ) : (
              <div className={cn(
                "w-full aspect-square flex items-center justify-center text-5xl font-bold",
                selectedId === barber.id
                  ? "bg-brand-yellow/20 text-brand-yellow"
                  : "bg-neutral-700/50 text-neutral-400"
              )}>
                {barber.name[0]}
              </div>
            )}
            <div className="p-3">
              <span className={cn(
                "text-lg font-medium",
                selectedId === barber.id ? "text-brand-yellow" : "text-white"
              )}>
                {barber.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
