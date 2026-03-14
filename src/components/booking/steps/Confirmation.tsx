import { buildWhatsAppUrl } from "../lib/whatsapp";
import type { BookingState, Barber } from "../types";

interface ConfirmationProps {
  state: BookingState;
  barbers: Barber[];
  onReset: () => void;
}

function formatDateLabel(date: string): string {
  const d = new Date(date + "T12:00:00");
  return d.toLocaleDateString("es-PY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Confirmation({ state, barbers, onReset }: ConfirmationProps) {
  const barber = barbers.find((b) => b.id === state.barberId);
  const barberName = barber?.name ?? "—";

  const whatsappUrl = buildWhatsAppUrl(
    {
      barberId: state.barberId!,
      date: state.date!,
      time: state.time!,
      clientName: state.clientName,
      clientPhone: state.clientPhone,
    },
    barberName
  );

  const details = [
    { label: "Barbero", value: barberName },
    { label: "Fecha", value: formatDateLabel(state.date!) },
    { label: "Hora", value: state.time! },
    { label: "Nombre", value: state.clientName },
    { label: "Teléfono", value: state.clientPhone },
  ];

  return (
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-yellow/20 flex items-center justify-center">
        <span className="text-3xl text-brand-yellow">✓</span>
      </div>
      <p className="text-neutral-400 mb-8">Pendiente a confirmación</p>

      <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 mb-8 text-left max-w-md mx-auto">
        {details.map(({ label, value }) => (
          <div key={label} className="flex justify-between py-2 border-b border-neutral-700 last:border-0">
            <span className="text-neutral-400">{label}</span>
            <span className="text-white font-medium">{value}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3 max-w-md mx-auto">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 rounded-xl bg-brand-yellow text-neutral-900 font-bold text-lg hover:brightness-110 transition-all text-center"
        >
          Confirmar por WhatsApp
        </a>
        <button
          onClick={onReset}
          className="w-full py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white font-medium hover:bg-neutral-700 transition-colors"
        >
          Reservar otro turno
        </button>
      </div>
    </div>
  );
}
