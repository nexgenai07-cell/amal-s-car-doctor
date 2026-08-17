/**
 * ================================================================
 * StepperProcess.jsx
 * ================================================================
 * A horizontal 4-step process bar: numbered circles connected by a
 * line, each with a title and description below. Used on the
 * Service Detail page for "Our Diagnostic Process". The first step
 * is highlighted in red (matches the design showing step 1 active).
 * Stacks vertically on mobile since 4 columns won't fit on small
 * screens.
 * ================================================================
 */
import { cn } from "../../utils/cn";

/**
 * @param {Array<{step: number, title: string, description: string}>} steps
 */
export default function StepperProcess({ steps }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 sm:gap-4">
      {steps.map((item, i) => (
        <div
          key={item.step}
          className="flex sm:flex-col items-start sm:items-center gap-4 sm:text-center relative"
        >
          {/* Connector line to the NEXT step — hidden on the last
              item and hidden on mobile (where steps stack vertically) */}
          {i < steps.length - 1 && (
            <span className="hidden sm:block absolute top-5 left-1/2 w-full h-px bg-tertiary/30 -z-10" />
          )}

          <span
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border font-heading font-semibold text-sm shrink-0",
              i === 0
                ? "bg-primary border-primary text-white"
                : "bg-secondary border-tertiary/40 text-neutral",
            )}
          >
            {item.step}
          </span>

          <div className="flex flex-col gap-1">
            <h4 className="font-heading font-semibold text-sm">{item.title}</h4>
            <p className="text-neutral text-xs leading-relaxed max-w-40">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
