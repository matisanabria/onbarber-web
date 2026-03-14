import { useState, useEffect } from "react";
import { cn } from "../lib/cn";
import { getAvailableDates } from "../lib/api";

const DAY_NAMES = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

interface WeekStripProps {
  barberId: number;
  selectedDate: string | null;
  onSelect: (date: string) => void;
}

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(d: Date, days: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

export default function WeekStrip({ barberId, selectedDate, onSelect }: WeekStripProps) {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const weekEnd = addDays(weekStart, 6);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMonday = getMonday(today);

  useEffect(() => {
    getAvailableDates(barberId, weekStart, weekEnd).then(setAvailableDates);
  }, [barberId, weekStart.toISOString()]);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const monthLabel = MONTH_NAMES[weekStart.getMonth()];
  const isCurrentWeek = weekStart.getTime() === todayMonday.getTime();
  const canGoPrev = weekStart > todayMonday;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">{monthLabel} {weekStart.getFullYear()}</h3>
        {isCurrentWeek && (
          <span className="text-sm text-brand-yellow bg-brand-yellow/10 px-2 py-0.5 rounded-full">Esta semana</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => canGoPrev && setWeekStart(addDays(weekStart, -7))}
          disabled={!canGoPrev}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-lg transition-colors shrink-0",
            canGoPrev
              ? "bg-neutral-700 text-white hover:bg-neutral-600"
              : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
          )}
        >
          &lt;
        </button>

        <div className="flex gap-1 flex-1 justify-between">
          {days.map((day) => {
            const dateStr = formatDate(day);
            const isAvailable = availableDates.includes(dateStr);
            const isSelected = dateStr === selectedDate;
            const isPast = day < today;
            const dayName = DAY_NAMES[day.getDay()];
            const dayNum = day.getDate();

            return (
              <button
                key={dateStr}
                onClick={() => isAvailable && !isPast && onSelect(dateStr)}
                disabled={!isAvailable || isPast}
                className={cn(
                  "flex flex-col items-center py-2 px-1.5 sm:px-3 rounded-xl transition-colors min-w-0 flex-1",
                  isSelected && "bg-brand-yellow text-neutral-900",
                  !isSelected && isAvailable && !isPast && "bg-neutral-800 text-white hover:bg-brand-yellow/10 hover:border-brand-yellow/30 border border-transparent",
                  (!isAvailable || isPast) && "bg-neutral-800/50 text-neutral-600 cursor-not-allowed"
                )}
              >
                <span className="text-[10px] sm:text-xs font-medium">{dayName}</span>
                <span className="text-sm sm:text-lg font-bold">{dayNum}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setWeekStart(addDays(weekStart, 7))}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-700 text-white hover:bg-neutral-600 transition-colors shrink-0"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
