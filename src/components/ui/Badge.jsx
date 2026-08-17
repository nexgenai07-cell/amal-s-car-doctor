/**
 * ================================================================
 * Badge.jsx
 * ================================================================
 * A small reusable pill-shaped label component.
 *
 * WHERE THIS IS USED IN THE DESIGN:
 * - Home hero: "PRECISION DIAGNOSTICS" (small red label above the
 *   big heading)
 * - Services Hub: "OUR SERVICES" (small label above section headings)
 * - About page: "ABOUT US" small label above "Precision Meets Passion"
 * - Team member cards: "Engine Specialist", "Electrical Expert" etc.
 *   (small red pill under each team member's name)
 * - Home telemetry widget: "25.5V-MPM" style small mono-font tags
 *
 * VARIANTS:
 * - "solid"    -> filled red background, white text
 *                 (used for role badges like "Engine Specialist")
 * - "outline"  -> transparent background, red border, red text
 *                 (used for section labels like "OUR SERVICES")
 * - "subtle"   -> very faint red background tint, red text, no border
 *                 (used for small status/info tags)
 * ================================================================
 */

import { cn } from "../../utils/cn";

/**
 * @param {"solid"|"outline"|"subtle"} variant - visual style
 * @param {React.ElementType} [icon] - optional small icon shown before the text
 * @param {string} [className] - extra classes from parent, merged safely
 * @param {React.ReactNode} children - the badge's label text
 */
export default function Badge({
  variant = "outline",
  icon: Icon,
  className = "",
  children,
}) {
  // Base styles shared by every badge, regardless of variant.
  const baseStyles = cn(
    "inline-flex items-center gap-1.5",
    "px-3 py-1 rounded-full",
    "font-label text-xs font-medium uppercase tracking-wider", // matches the mono, uppercase, letter-spaced look in the design
    "w-fit", // never stretches to full width of its parent
  );

  // Variant-specific colors/borders.
  const variantStyles = {
    solid: "bg-primary text-white",
    outline: "bg-transparent border border-primary/40 text-primary",
    subtle: "bg-primary/10 text-primary",
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], className)}>
      {/* Small red dot before the text, matches the "live status" 
          feel seen next to labels like "PRECISION DIAGNOSTICS" */}
      {!Icon && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {Icon && <Icon className="text-sm" />}
      {children}
    </span>
  );
}
