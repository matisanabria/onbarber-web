import WeekStrip from "../ui/WeekStrip";

interface DateSelectProps {
  barberId: number;
  selectedDate: string | null;
  onSelect: (date: string) => void;
  onBack: () => void;
}

export default function DateSelect({ barberId, selectedDate, onSelect, onBack }: DateSelectProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-700 text-white hover:bg-neutral-600 transition-colors"
        >
          &lt;
        </button>
        <h2 className="font-bebas text-2xl sm:text-3xl text-white">Elegí la fecha</h2>
      </div>
      <WeekStrip barberId={barberId} selectedDate={selectedDate} onSelect={onSelect} />
    </div>
  );
}
