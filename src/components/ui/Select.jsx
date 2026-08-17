/**
 * ================================================================
 * Select.jsx
 * ================================================================
 * A custom-styled dropdown, used for the Contact form's
 * "Service Needed" field. Built on top of a native <select> element
 * (for full accessibility and mobile keyboard support) with custom
 * Tailwind styling layered on top, plus a custom dropdown arrow icon.
 * ================================================================
 */
import { forwardRef } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { cn } from "../../utils/cn";

/**
 * @param {string} [label]
 * @param {Array<{value: string, label: string}>} options
 * @param {string} [placeholder] - shown as the first, disabled option
 * @param {string} [error]
 * @param {string} [className]
 * @param {...any} rest - passed through to the native <select>
 */
const Select = forwardRef(
  (
    {
      label,
      options,
      placeholder = "Select an option",
      error,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="font-label text-xs uppercase tracking-wider text-neutral">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            defaultValue=""
            className={cn(
              "w-full bg-secondary text-white border rounded-lg px-4 py-3 text-sm font-body appearance-none cursor-pointer",
              "focus:outline-none focus:border-primary transition-colors duration-200",
              error ? "border-red-500" : "border-tertiary/40",
              className,
            )}
            {...rest}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom dropdown arrow, since native <select> arrows look
              inconsistent across browsers and don't match our theme */}
          <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral text-xs pointer-events-none" />
        </div>

        {error && <p className="text-xs text-red-500 font-body">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
export default Select;
