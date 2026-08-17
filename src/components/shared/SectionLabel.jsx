/**
 * ================================================================
 * SectionLabel.jsx
 * ================================================================
 * The small uppercase red label shown above section headings across
 * the site, e.g. "OUR SERVICES", "OUR WORK", "ABOUT US".
 * Centers itself by default since that's how it's used everywhere
 * in the design, but can be left-aligned via the align prop.
 * ================================================================
 */
import { cn } from "../../utils/cn";

export default function SectionLabel({
  children,
  align = "center",
  className = "",
}) {
  return (
    <p
      className={cn(
        "font-label text-xs uppercase tracking-[0.2em] text-primary mb-3",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      {children}
    </p>
  );
}
