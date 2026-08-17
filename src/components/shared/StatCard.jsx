/**
 * ================================================================
 * StatCard.jsx
 * ================================================================
 * A single stat used in the Home page's StatsSection, e.g.
 * "12,000+ Cars Serviced". The number animates (counts up) into
 * view using the useCountUp hook, unless animate=false.
 *
 * VISUAL STYLE:
 * - No outer card/border/background here on purpose -- each stat
 *   sits directly on the section background, just an icon + number
 *   + label, so the row reads as light/open rather than a wall of
 *   boxed cards.
 * - The icon sits inside a glowing gradient badge: a soft, blurred
 *   halo (bg-gradient primary -> primary-light) constantly pulses
 *   behind it, kept intentionally subtle/small (blur-md, low
 *   opacity range) rather than a big dramatic glow. The icon box
 *   itself floats gently up/down on a slow, continuous loop.
 * - The big number continuously tilts in 3D (rotating on both the
 *   X and Y axis) rather than sitting flat -- a `perspective`
 *   wrapper + `transformStyle: preserve-3d` is what makes the
 *   rotation actually read as 3D depth instead of a flat 2D skew.
 *   The rotation range/speed here is deliberately more noticeable
 *   than the icon's float, since the number is the focal point.
 * ================================================================
 */
import { motion } from "motion/react";
import { useCountUp } from "../../hooks/useCountUp";

/**
 * @param {React.ElementType} icon - the react-icons component to render
 * @param {number} value - target numeric value
 * @param {string} suffix - text appended after the number, e.g. "+", "%", "/7"
 * @param {string} label - description text below the number
 * @param {boolean} animate - whether to animate the count-up
 */
export default function StatCard({
  icon: Icon,
  value,
  suffix,
  label,
  animate,
}) {
  const { count, ref } = useCountUp(value);
  const displayValue = animate ? count : value;

  return (
    <div
      ref={ref}
      className="group/stat flex flex-col items-center gap-2 text-center sm:gap-3"
    >
      {/* ---- Icon badge: blurred gradient halo + floating icon box ---- */}
      <div className="relative flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12">
        {/* Blurred glow, breathing slowly behind the icon box -- kept
            subtle (blur-md, narrow opacity range) rather than a big
            dramatic glow. */}
        <motion.div
          aria-hidden="true"
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [0.9, 1, 0.9] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute inset-0 rounded-full bg-linear-to-br
            from-primary to-primary-light blur-md
          "
        />

        {/* Crisp gradient-bordered box on top, holding the icon.
            Floats gently up/down on a slow, continuous loop. */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            relative flex h-9 w-9 items-center justify-center rounded-xl
            border border-primary-light/30 bg-linear-to-br from-primary
            to-primary-dark text-sm text-white
            shadow-[0_0_14px_-4px_var(--color-primary)]
            transition-transform duration-300
            group-hover/stat:scale-110
            sm:h-11 sm:w-11 sm:text-base
          "
        >
          <Icon />
        </motion.div>
      </div>

      {/* ---- Number ----
          `[perspective:600px]` on this wrapper is what turns the
          rotateX/rotateY animation below into an actual 3D tilt
          (depth) instead of a flat skew -- without a perspective
          value set somewhere on an ancestor, 3D transforms render
          with no visible depth at all. */}
      <div className="perspective-[600px]">
        <motion.span
          animate={{ rotateX: [0, 20, 0, -20, 0], rotateY: [0, -24, 0, 24, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="
            inline-block bg-linear-to-br from-primary-light to-primary
            bg-clip-text font-heading text-2xl font-bold text-transparent
            sm:text-3xl
          "
        >
          {displayValue.toLocaleString()}
          {suffix}
        </motion.span>
      </div>

      <span className="font-label text-xs uppercase tracking-wider text-neutral">
        {label}
      </span>
    </div>
  );
}
