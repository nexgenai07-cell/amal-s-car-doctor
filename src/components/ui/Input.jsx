/**
 * ================================================================
 * Input.jsx
 * ================================================================
 * A reusable text input field, styled to match the dark theme.
 *
 * WHERE THIS IS USED IN THE DESIGN:
 * - Contact page booking form: "Full Name", "Phone Number" fields
 * - (Later) Newsletter email field on the homepage
 *
 * FEATURES:
 * - Optional label above the input (e.g. "FULL NAME")
 * - Optional left icon inside the input (e.g. a phone icon)
 * - Built-in error message support (red border + red text below),
 *   which will connect directly to Zod + React Hook Form validation
 *   once we build the Contact form
 * - forwardRef is used so React Hook Form can directly "register"
 *   this input and control its value/focus programmatically
 * ================================================================
 */

import { forwardRef } from "react";
import { cn } from "../../utils/cn";

/**
 * @param {string} [label] - text label shown above the input
 * @param {React.ElementType} [icon] - optional icon shown inside, left side
 * @param {string} [error] - error message string; when present, shows
 *   red border + red error text below the input
 * @param {string} [className] - extra classes merged onto the <input> itself
 * @param {string} [containerClassName] - extra classes for the wrapping div
 * @param {...any} rest - all other native input props (type, placeholder,
 *   name, value, onChange, onBlur, etc.) passed straight through
 */
const Input = forwardRef(
  (
    {
      label,
      icon: Icon,
      error,
      className = "",
      containerClassName = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <div className={cn("flex flex-col gap-2 w-full", containerClassName)}>
        {/* Label above the field, e.g. "FULL NAME" - matches the
            small uppercase mono-font labels seen in the design's
            booking form */}
        {label && (
          <label className="font-label text-xs uppercase tracking-wider text-neutral">
            {label}
          </label>
        )}

        {/* Wrapper div holds the optional icon + the actual input,
            so the icon can be positioned absolutely inside it. */}
        <div className="relative flex items-center">
          {Icon && (
            <Icon className="absolute left-4 text-tertiary text-base pointer-events-none" />
          )}

          <input
            ref={ref}
            className={cn(
              "w-full bg-secondary text-white placeholder-neutral/60",
              "border rounded-lg px-4 py-3 text-sm font-body",
              "transition-colors duration-200",
              "focus:outline-none focus:border-primary",
              Icon && "pl-11", // extra left padding to make room for the icon
              error ? "border-red-500" : "border-tertiary/40",
              className,
            )}
            {...rest}
          />
        </div>

        {/* Error message, only rendered when validation fails.
            This will be driven by Zod's error messages once the
            Contact form's validation schema is connected. */}
        {error && <p className="text-xs text-red-500 font-body">{error}</p>}
      </div>
    );
  },
);

// Needed because we used forwardRef — gives the component a proper
// name in React DevTools instead of showing as "Anonymous".
Input.displayName = "Input";

export default Input;
