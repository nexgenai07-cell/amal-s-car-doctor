/**
 * ================================================================
 * Textarea.jsx
 * ================================================================
 * A multi-line text input, used for the Contact form's optional
 * "Message" field. Styled consistently with Input.jsx.
 * ================================================================
 */
import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Textarea = forwardRef(
  ({ label, error, className = "", rows = 4, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="font-label text-xs uppercase tracking-wider text-neutral">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            "w-full bg-secondary text-white placeholder-neutral/60 resize-none",
            "border rounded-lg px-4 py-3 text-sm font-body",
            "focus:outline-none focus:border-primary transition-colors duration-200",
            error ? "border-red-500" : "border-tertiary/40",
            className,
          )}
          {...rest}
        />

        {error && <p className="text-xs text-red-500 font-body">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
export default Textarea;
