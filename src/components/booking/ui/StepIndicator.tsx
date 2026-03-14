import { cn } from "../lib/cn";

const steps = ["Barbero", "Fecha", "Hora", "Datos", "Confirmar"];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  isActive && "bg-brand-yellow text-neutral-900",
                  isCompleted && "bg-brand-yellow/20 text-brand-yellow",
                  !isActive && !isCompleted && "bg-neutral-700 text-neutral-400"
                )}
              >
                {isCompleted ? "✓" : stepNum}
              </div>
              <span
                className={cn(
                  "text-xs mt-1 hidden sm:block",
                  isActive ? "text-brand-yellow" : "text-neutral-500"
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-2",
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
