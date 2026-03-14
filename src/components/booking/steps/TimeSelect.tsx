import { useEffect, useState } from "react";
import { cn } from "../lib/cn";
import { getAvailableSlots } from "../lib/api";
import type { TimeSlot } from "../types";

interface TimeSelectProps {
  barberId: number;
  date: string;
  selectedTime: string | null;
  onSelect: (time: string) => void;
  onBack: () => void;
}

function groupByShift(slots: TimeSlot[]) {
  const morning: TimeSlot[] = [];
  const afternoon: TimeSlot[] = [];
  const evening: TimeSlot[] = [];

  for (const slot of slots) {
    const hour = parseInt(slot.time.split(":")[0]);
    if (hour < 12) morning.push(slot);
    else if (hour < 18) afternoon.push(slot);
    else evening.push(slot);
  }

  return { morning, afternoon, evening };
}

function formatDateLabel(date: string): string {
  const d = new Date(date + "T12:00:00");
  return d.toLocaleDateString("es-PY", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TimeSelect({ barberId, date, selectedTime, onSelect, onBack }: TimeSelectProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAvailableSlots(barberId, date).then((s) => {
      setSlots(s);
      setLoading(false);
    });
  }, [barberId, date]);

  const { morning, afternoon, evening } = groupByShift(slots);
  const hasAvailable = slots.some((s) => s.available);

  const renderGroup = (label: string, group: TimeSlot[]) => {
    if (group.length === 0) return null;
    return (
      <div className="mb-6">
        <h4 className="text-sm font-medium text-brand-yellow/70 mb-3">{label}</h4>
        <div className="flex flex-wrap gap-2">
          {group.map((slot) => (
            <button
              key={slot.time}
              onClick={() => slot.available && onSelect(slot.time)}
              disabled={!slot.available}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                selectedTime === slot.time && "bg-brand-yellow text-neutral-900",
                selectedTime !== slot.time && slot.available && "bg-neutral-800 text-white hover:bg-brand-yellow/10 hover:text-brand-yellow",
                !slot.available && "bg-neutral-800/50 text-neutral-600 line-through cursor-not-allowed"
              )}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-700 text-white hover:bg-neutral-600 transition-colors"
        >
          &lt;
        </button>
        <h2 className="font-bebas text-2xl sm:text-3xl text-white">Elegí el horario</h2>
      </div>
      <p className="text-neutral-400 mb-6 ml-11">{formatDateLabel(date)}</p>

      {loading ? (
        <div className="text-center py-8 text-neutral-400">Cargando horarios...</div>
      ) : !hasAvailable ? (
        <div className="text-center py-8">
          <p className="text-neutral-400">No hay horarios disponibles para esta fecha.</p>
          <button
            onClick={onBack}
            className="mt-4 text-brand-yellow hover:underline text-sm"
          >
            Elegir otra fecha
          </button>
        </div>
      ) : (
        <>
          {renderGroup("Mañana", morning)}
          {renderGroup("Tarde", afternoon)}
          {renderGroup("Noche", evening)}
        </>
      )}
    </div>
  );
}
