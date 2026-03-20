import { useEffect, useState } from "react";
import { cn } from "../lib/cn";
import { getAvailableSlots } from "../lib/api";
import WeekStrip from "../ui/WeekStrip";
import type { TimeSlot } from "../types";

interface DateTimeSelectProps {
  barberId: number;
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
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

export default function DateTimeSelect({
  barberId,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onBack,
}: DateTimeSelectProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    setSlots([]);
    getAvailableSlots(barberId, selectedDate).then((s) => {
      setSlots(s);
      setLoadingSlots(false);
    });
  }, [barberId, selectedDate]);

  const { morning, afternoon, evening } = groupByShift(slots);
  const hasAvailable = slots.some((s) => s.available);

  const renderGroup = (label: string, group: TimeSlot[]) => {
    if (group.length === 0) return null;
    return (
      <div className="mb-5">
        <h4 className="text-xs font-medium text-brand-yellow/70 mb-2.5 uppercase tracking-wider">{label}</h4>
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2">
          {group.map((slot) => (
            <button
              key={slot.time}
              onClick={() => slot.available && onSelectTime(slot.time)}
              disabled={!slot.available}
              className={cn(
                "py-2.5 sm:py-2 px-3 sm:px-4 rounded-xl sm:rounded-full text-sm font-medium transition-colors",
                selectedTime === slot.time && "bg-brand-yellow text-neutral-900 shadow-[0_0_12px_rgba(237,183,23,0.3)]",
                selectedTime !== slot.time && slot.available && "bg-neutral-800 text-white active:bg-brand-yellow/20",
                !slot.available && "bg-neutral-800/30 text-neutral-600 line-through cursor-not-allowed"
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
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-neutral-700 text-white active:bg-neutral-600 transition-colors shrink-0"
        >
          &lt;
        </button>
        <h2 className="font-bebas text-2xl sm:text-3xl text-white">Elegí fecha y horario</h2>
      </div>

      <WeekStrip barberId={barberId} selectedDate={selectedDate} onSelect={onSelectDate} />

      {selectedDate && (
        <div className="mt-6 pt-5 border-t border-neutral-700/60">
          {loadingSlots ? (
            <div className="text-center py-6 text-neutral-400 text-sm">Cargando horarios...</div>
          ) : !hasAvailable ? (
            <div className="text-center py-6">
              <p className="text-neutral-400 text-sm">No hay horarios disponibles para este día.</p>
            </div>
          ) : (
            <>
              <h3 className="font-bebas text-lg text-white mb-4">Horarios disponibles</h3>
              {renderGroup("Mañana", morning)}
              {renderGroup("Tarde", afternoon)}
              {renderGroup("Noche", evening)}
            </>
          )}
        </div>
      )}
    </div>
  );
}
