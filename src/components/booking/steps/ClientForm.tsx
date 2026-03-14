import { useState } from "react";
import { cn } from "../lib/cn";

interface ClientFormProps {
  name: string;
  phone: string;
  onChangeName: (name: string) => void;
  onChangePhone: (phone: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting?: boolean;
  error?: string | null;
}

export default function ClientForm({ name, phone, onChangeName, onChangePhone, onSubmit, onBack, submitting, error }: ClientFormProps) {
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (name.trim().length < 2) {
      newErrors.name = "Ingresá tu nombre (mínimo 2 caracteres)";
    }
    if (!/^09\d{8}$/.test(phone.replace(/\s/g, ""))) {
      newErrors.phone = "Ingresá un número válido (ej: 0981123456)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSubmit();
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          disabled={submitting}
          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-neutral-700 text-white active:bg-neutral-600 transition-colors shrink-0"
        >
          &lt;
        </button>
        <h2 className="font-bebas text-2xl sm:text-3xl text-white">Tus datos</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <label htmlFor="client-name" className="block text-sm font-medium text-neutral-300 mb-2">
            Nombre
          </label>
          <input
            id="client-name"
            type="text"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="Tu nombre"
            disabled={submitting}
            autoComplete="name"
            className={cn(
              "w-full px-4 py-3.5 sm:py-3 rounded-xl bg-neutral-800 border text-base text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-colors",
              errors.name ? "border-red-500" : "border-neutral-700"
            )}
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="client-phone" className="block text-sm font-medium text-neutral-300 mb-2">
            Teléfono
          </label>
          <input
            id="client-phone"
            type="tel"
            value={phone}
            onChange={(e) => onChangePhone(e.target.value)}
            placeholder="0981123456"
            disabled={submitting}
            autoComplete="tel"
            className={cn(
              "w-full px-4 py-3.5 sm:py-3 rounded-xl bg-neutral-800 border text-base text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-colors",
              errors.phone ? "border-red-500" : "border-neutral-700"
            )}
          />
          {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "w-full py-4 sm:py-3 rounded-xl bg-brand-yellow text-neutral-900 font-bold text-lg transition-all",
            submitting ? "opacity-60 cursor-not-allowed" : "active:scale-[0.98]"
          )}
        >
          {submitting ? "Reservando..." : "Confirmar turno"}
        </button>
      </form>
    </div>
  );
}
