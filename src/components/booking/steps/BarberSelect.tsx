import { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "../lib/cn";
import { getBarbers } from "../lib/api";
import type { Barber } from "../types";

interface BarberSelectProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
  onNext: () => void;
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

export default function BarberSelect({ selectedId, onSelect, onNext }: BarberSelectProps) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [rouletteActive, setRouletteActive] = useState(false);
  const [rouletteId, setRouletteId] = useState<number | null>(null);
  const rouletteRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getBarbers()
      .then((data) => {
        setBarbers(data);
      })
      .catch((err) => {
        console.error("Error cargando barberos:", err);
      })
      .finally(() => {
        setLoaded(true);
      });
  }, []);

  const startRoulette = useCallback(() => {
    if (barbers.length < 2 || rouletteActive) return;

    setRouletteActive(true);
    const totalCycles = 24 + Math.floor(Math.random() * 10);
    let current = 0;
    let delay = 80;

    function tick() {
      const barber = barbers[current % barbers.length];
      setRouletteId(barber.id);
      current++;

      if (current >= totalCycles) {
        const finalIdx = Math.floor(Math.random() * barbers.length);
        const finalBarber = barbers[finalIdx];
        setRouletteId(finalBarber.id);
        onSelect(finalBarber.id);

        setTimeout(() => {
          setRouletteActive(false);
          setRouletteId(null);
        }, 800);
        return;
      }

      // Easing: slow down progressively
      const progress = current / totalCycles;
      delay = 80 + progress * progress * progress * 600;

      rouletteRef.current = setTimeout(tick, delay);
    }

    tick();
  }, [barbers, rouletteActive, onSelect]);

  useEffect(() => {
    return () => {
      if (rouletteRef.current) clearTimeout(rouletteRef.current);
    };
  }, []);

  const displayId = rouletteActive ? rouletteId : selectedId;

  return (
    <div>
      <h2 className="font-bebas text-2xl sm:text-3xl text-white mb-4 sm:mb-6">Elegí tu barbero</h2>

      {/* Random barber banner */}
      {loaded && barbers.length >= 2 && (
        <button
          onClick={startRoulette}
          disabled={rouletteActive}
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800/80 px-4 py-3 mb-4 sm:mb-6 transition-all",
            rouletteActive
              ? "opacity-60 cursor-not-allowed"
              : "hover:border-brand-yellow/40 hover:bg-neutral-800 cursor-pointer"
          )}
        >
          <span className="text-neutral-400 text-sm sm:text-base">¿No sabés con quién ir?</span>
          <span className="text-brand-yellow font-bold text-sm sm:text-base">
            Reservá con cualquiera →
          </span>
        </button>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {!loaded ? (
          <>
            <BarberSkeleton />
            <BarberSkeleton />
          </>
        ) : (
          barbers.map((barber) => {
            const isHighlighted = displayId === barber.id;
            const isRouletteHighlight = rouletteActive && rouletteId === barber.id;

            return (
              <button
                key={barber.id}
                onClick={() => {
                  if (!rouletteActive) onSelect(barber.id);
                }}
                disabled={rouletteActive}
                className={cn(
                  "rounded-xl border-2 transition-all overflow-hidden",
                  !rouletteActive && "active:scale-[0.97]",
                  isHighlighted
                    ? "border-brand-yellow bg-brand-yellow/10 shadow-[0_0_20px_rgba(237,183,23,0.15)]"
                    : "border-neutral-700 bg-neutral-800/60 active:border-brand-yellow/40",
                  isRouletteHighlight && "scale-[1.03]"
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
                    isHighlighted
                      ? "bg-brand-yellow/20 text-brand-yellow"
                      : "bg-neutral-700/50 text-neutral-400"
                  )}>
                    {barber.name[0]}
                  </div>
                )}
                <div className="p-3 sm:p-4">
                  <span className={cn(
                    "text-base sm:text-lg font-bold font-bebas tracking-wide",
                    isHighlighted ? "text-brand-yellow" : "text-white"
                  )}>
                    {barber.name}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={!selectedId || rouletteActive}
        className={cn(
          "w-full mt-6 py-3 rounded-full font-inter font-bold text-lg sm:text-xl tracking-wide transition-all",
          selectedId && !rouletteActive
            ? "bg-brand-yellow text-neutral-900 hover:bg-brand-yellow/90 cursor-pointer active:scale-[0.98]"
            : "bg-neutral-700 text-neutral-500 cursor-not-allowed"
        )}
      >
        Siguiente
      </button>
    </div>
  );
}
