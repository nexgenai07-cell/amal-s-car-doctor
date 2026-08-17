/**
 * ================================================================
 * ProgressBar.jsx
 * ================================================================
 * A single "live diagnostic" readout row: icon badge + label on
 * top, a gradient-filled progress track + counting percentage
 * below. Used in the Home page's DiagnosticStatusBar strip
 * (Engine 91%, Brakes 88%, Battery 95%, AC Unit 90%).
 *
 * ANIMATION:
 * - The percentage number counts up from 0 (useCountUp) and the
 *   track fills from 0 -> its target width, both triggered once
 *   when the row scrolls into view.
 * - Once filled, a soft diagonal "scan" shimmer sweeps continuously
 *   left-to-right through the filled portion only (it lives INSIDE
 *   the fill's own overflow-hidden box, so it's clipped to exactly
 *   the filled width, growing/shrinking with it) -- this is what
 *   gives the bar its "live, still scanning" feel rather than
 *   looking like a static, finished bar.
 * ================================================================
 */
import { motion } from "motion/react";
import { useCountUp } from "../../hooks/useCountUp";

/**
 * @param {React.ElementType} icon - the react-icons component to render
 * @param {string} label - e.g. "SYS. ENGINE"
 * @param {number} percentage - 0 to 100
 */
export default function ProgressBar({ icon: Icon, label, percentage }) {
  const { count, ref } = useCountUp(percentage, 1200);

  return (
    <div ref={ref} className="group/bar flex w-full flex-col gap-2.5">
      {/* ---- Top row: icon badge + label + live count ---- */}
      <div className="flex items-center gap-2.5">
        <div
          className="
            relative flex h-8 w-8 shrink-0 items-center justify-center
            rounded-lg border border-primary-light/30 bg-linear-to-br
            from-primary to-primary-dark text-xs text-white
            shadow-[0_0_10px_-3px_var(--color-primary)]
            transition-transform duration-300
            group-hover/bar:scale-110
          "
        >
          {Icon && <Icon />}
        </div>
        <span className="font-label text-[10px] uppercase tracking-wider text-neutral">
          {label}
        </span>
        <span className="ml-auto font-label text-[11px] font-semibold text-primary-light">
          {count}%
        </span>
      </div>

      {/* ---- Track + animated fill ---- */}
      <div className="h-1.25 w-full overflow-hidden rounded-full bg-tertiary/15">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="
            relative h-full overflow-hidden rounded-full bg-linear-to-r
            from-primary-light to-primary
            shadow-[0_0_8px_-1px_var(--color-primary)]
          "
        >
          {/* Continuous diagonal scan shimmer, clipped to the fill's
              own width via the parent's overflow-hidden above.
              Animates `left` (not `x`) so the percentages are
              relative to the fill bar's width, not the shimmer's own
              small width -- otherwise it barely moves at all. */}
          <motion.div
            aria-hidden="true"
            animate={{ left: ["-20%", "120%"] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "linear",
              delay: 1.1,
            }}
            className="
              absolute inset-y-0 w-8 -skew-x-12
              bg-linear-to-r from-transparent via-white/60 to-transparent
            "
          />
        </motion.div>
      </div>
    </div>
  );
}
