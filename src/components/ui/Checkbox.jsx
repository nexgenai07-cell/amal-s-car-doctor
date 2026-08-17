/**
 * ================================================================
 * Checkbox.jsx
 * ================================================================
 * A custom-styled checkbox row, used in the Service Detail page's
 * "Are You Experiencing These?" symptom checklist. Purely visual/
 * interactive state (checked or not) — doesn't submit anywhere,
 * it just helps the visitor mentally confirm their symptoms before
 * booking (matches the design's intent: "helps our technicians
 * prepare the correct diagnostic array before arrival").
 * ================================================================
 */
import { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { cn } from "../../utils/cn";

/**
 * @param {string} label - the symptom text shown next to the checkbox
 */
export default function Checkbox({ label }) {
  const [checked, setChecked] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setChecked((prev) => !prev)}
      className={cn(
        "flex items-center gap-4 w-full text-left px-5 py-4 rounded-lg border transition-colors duration-200",
        checked
          ? "bg-primary/10 border-primary/40"
          : "bg-secondary border-tertiary/20 hover:border-tertiary/40",
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center w-5 h-5 rounded shrink-0 border transition-colors duration-200",
          checked ? "bg-primary border-primary" : "border-tertiary/50",
        )}
      >
        {checked && <FaCheck className="text-white text-[10px]" />}
      </span>
      <span
        className={cn(
          "text-sm font-body",
          checked ? "text-white" : "text-neutral",
        )}
      >
        {label}
      </span>
    </button>
  );
}
