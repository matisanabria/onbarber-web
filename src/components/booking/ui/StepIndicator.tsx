import { cn } from "../lib/cn";

const steps = ["Barbero", "Fecha", "Hora", "Datos", "Listo"];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-6 sm:mb-8 px-1">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                  isActive && "bg-brand-yellow text-neutral-900 shadow-[0_0_12px_rgba(237,183,23,0.4)]",
                  isCompleted && "bg-brand-yellow/20 text-brand-yellow",
                  !isActive && !isCompleted && "bg-neutral-700 text-neutral-500"
                )}
              >
                {isCompleted ? "✓" : stepNum}
              </div>
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-medium",
                  isActive ? "text-brand-yellow" : isCompleted ? "text-neutral-400" : "text-neutral-600"
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-1.5 sm:mx-2 mb-4",
                  isCompleted ? "bg-brand-yellow/30" : "bg-neutral-700"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
