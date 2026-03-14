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
    setAvailableDates(getAvailableDates(barberId, weekStart, weekEnd));
  }, [barberId, weekStart.toISOString()]);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const monthLabel = MONTH_NAMES[weekStart.getMonth()];
  const isCurrentWeek = weekStart.getTime() === todayMonday.getTime();
  const canGoPrev = weekStart > todayMonday;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-medium text-white">{monthLabel} {weekStart.getFullYear()}</h3>
        <div className="flex items-center gap-2">
          {isCurrentWeek && (
            <span className="text-xs sm:text-sm text-brand-yellow bg-brand-yellow/10 px-2 py-0.5 rounded-full">Esta semana</span>
          )}
          <div className="flex gap-1">
            <button
              onClick={() => canGoPrev && setWeekStart(addDays(weekStart, -7))}
              disabled={!canGoPrev}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-lg transition-colors",
                canGoPrev
                  ? "bg-neutral-700 text-white active:bg-neutral-600"
                  : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
              )}
            >
              &lt;
            </button>
            <button
              onClick={() => setWeekStart(addDays(weekStart, 7))}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-neutral-700 text-white active:bg-neutral-600 transition-colors"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((day) => {
          const dateStr = formatDate(day);
          const isAvailable = availableDates.includes(dateStr);
          const isSelected = dateStr === selectedDate;
          const isPast = day < today;
          const isToday = formatDate(today) === dateStr;
          const dayName = DAY_NAMES[day.getDay()];
          const dayNum = day.getDate();

          return (
            <button
              key={dateStr}
              onClick={() => isAvailable && !isPast && onSelect(dateStr)}
              disabled={!isAvailable || isPast}
              className={cn(
                "flex flex-col items-center py-2.5 sm:py-3 rounded-xl transition-colors",
                isSelected && "bg-brand-yellow text-neutral-900 shadow-[0_0_12px_rgba(237,183,23,0.3)]",
                !isSelected && isAvailable && !isPast && "bg-neutral-800 text-white active:bg-brand-yellow/20",
                (!isAvailable || isPast) && "bg-neutral-800/30 text-neutral-600 cursor-not-allowed",
                isToday && !isSelected && isAvailable && "ring-1 ring-brand-yellow/40"
              )}
            >
              <span className="text-[11px] sm:text-xs font-medium leading-none">{dayName}</span>
              <span className="text-base sm:text-lg font-bold mt-0.5">{dayNum}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
