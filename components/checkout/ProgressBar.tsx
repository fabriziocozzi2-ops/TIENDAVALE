import { Check } from "lucide-react";

const steps = ["Carrito", "Entrega", "Pago"];

export default function ProgressBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      {steps.map((step, i) => {
        const stepIndex = i + 1;
        const isDone = stepIndex < current;
        const isActive = stepIndex === current;
        return (
          <div key={step} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  isDone
                    ? "bg-[var(--color-button)] text-white"
                    : isActive
                    ? "border border-morelia-text text-morelia-text"
                    : "border border-morelia-text/30 text-morelia-text-soft"
                }`}
              >
                {isDone ? <Check size={12} /> : stepIndex}
              </span>
              <span
                className={`text-sm ${
                  isActive ? "text-morelia-text font-medium" : "text-morelia-text-soft"
                }`}
              >
                {step}
              </span>
            </div>
            {stepIndex < steps.length && (
              <span className="w-8 h-px bg-morelia-text/20" />
            )}
          </div>
        );
      })}
    </div>
  );
}
