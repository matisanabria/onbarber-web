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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {barbers.map((barber) => (
          <button
            key={barber.id}
            onClick={() => onSelect(barber.id)}
            className={cn(
              "p-6 rounded-xl border-2 transition-all text-left",
              selectedId === barber.id
                ? "border-brand-yellow bg-brand-yellow/10"
                : "border-neutral-700 bg-neutral-800/60 hover:border-brand-yellow/40 hover:bg-neutral-800"
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold",
                  selectedId === barber.id
                    ? "bg-brand-yellow text-neutral-900"
                    : "bg-neutral-700 text-white"
                )}
              >
                {barber.name[0]}
              </div>
              <span className="text-lg font-medium text-white">{barber.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
