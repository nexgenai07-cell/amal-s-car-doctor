/**
 * ================================================================
 * TestimonialCard.jsx
 * ================================================================
 * A single client review card: avatar circle (initials-based
 * placeholder since we don't have real client photos), name,
 * vehicle/context line, star rating, and the quote text.
 *
 * Sized to be COMPACT on purpose -- this card lives inside the
 * scrolling Marquee rows on the Home page, so a smaller footprint
 * lets more cards be visible on screen at once and keeps the row
 * feeling like a fast-moving strip rather than a slow-moving wall
 * of oversized cards. It also has a FIXED width/height (never grows
 * or shrinks), which is required for the CSS marquee animation to
 * calculate a consistent, seamless scroll distance.
 *
 * AVATAR / STAR COLOR:
 * Previously every card used the same brand red (`text-primary`)
 * for the avatar circle and the star rating, which made all the
 * cards in the marquee look visually identical at a glance. Now
 * each card is assigned a different bright accent color from the
 * palette below, picked deterministically from the client's name
 * (see `getColorTheme`) so:
 *   - Every card looks distinct / more lively.
 *   - The SAME client always gets the SAME color, even though the
 *     Marquee component silently duplicates this card 3-4 times
 *     behind the scenes to create the seamless infinite-loop effect
 *     (a random color per-render would make the duplicated copies
 *     of the same card mismatch each other, which would look buggy).
 * ================================================================
 */
import { motion } from "motion/react";
import { FaStar } from "react-icons/fa6";

/**
 * Bright accent color palette used for the avatar circle + star
 * icons. Each entry uses Tailwind's built-in color scale (the
 * `-400` shade reads as bright/vivid against the site's very dark
 * background) so no new custom CSS variables are needed.
 *
 * NOTE: these class names are written out in full (not built with
 * string concatenation like `text-${color}-400`) on purpose --
 * Tailwind only picks up classes it can literally find as complete
 * strings in the source code, so concatenating them at runtime
 * would silently fail to generate the CSS.
 */
const AVATAR_COLOR_THEMES = [
  {
    border: "border-rose-400/40",
    bg: "bg-rose-400/10",
    text: "text-rose-400",
    hoverBorder: "hover:border-rose-400",
    hoverGlow: "bg-rose-400/20",
  },
  {
    border: "border-amber-400/40",
    bg: "bg-amber-400/10",
    text: "text-amber-400",
    hoverBorder: "hover:border-amber-400",
    hoverGlow: "bg-amber-400/20",
  },
  {
    border: "border-emerald-400/40",
    bg: "bg-emerald-400/10",
    text: "text-emerald-400",
    hoverBorder: "hover:border-emerald-400",
    hoverGlow: "bg-emerald-400/20",
  },
  {
    border: "border-sky-400/40",
    bg: "bg-sky-400/10",
    text: "text-sky-400",
    hoverBorder: "hover:border-sky-400",
    hoverGlow: "bg-sky-400/20",
  },
  {
    border: "border-violet-400/40",
    bg: "bg-violet-400/10",
    text: "text-violet-400",
    hoverBorder: "hover:border-violet-400",
    hoverGlow: "bg-violet-400/20",
  },
  {
    border: "border-fuchsia-400/40",
    bg: "bg-fuchsia-400/10",
    text: "text-fuchsia-400",
    hoverBorder: "hover:border-fuchsia-400",
    hoverGlow: "bg-fuchsia-400/20",
  },
  {
    border: "border-orange-400/40",
    bg: "bg-orange-400/10",
    text: "text-orange-400",
    hoverBorder: "hover:border-orange-400",
    hoverGlow: "bg-orange-400/20",
  },
  {
    border: "border-cyan-400/40",
    bg: "bg-cyan-400/10",
    text: "text-cyan-400",
    hoverBorder: "hover:border-cyan-400",
    hoverGlow: "bg-cyan-400/20",
  },
  {
    border: "border-lime-400/40",
    bg: "bg-lime-400/10",
    text: "text-lime-400",
    hoverBorder: "hover:border-lime-400",
    hoverGlow: "bg-lime-400/20",
  },
  {
    border: "border-yellow-400/40",
    bg: "bg-yellow-400/10",
    text: "text-yellow-400",
    hoverBorder: "hover:border-yellow-400",
    hoverGlow: "bg-yellow-400/20",
  },
];

/**
 * Turns a client's name into a stable index into AVATAR_COLOR_THEMES.
 * This is a simple string hash (not cryptographic, just needs to be
 * fast and deterministic) so the same name always maps to the same
 * color, on every render and on every duplicated copy of the card.
 *
 * @param {string} name
 * @returns {{border: string, bg: string, text: string}}
 */
function getColorTheme(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0; // keep it a 32-bit integer
  }
  const index = Math.abs(hash) % AVATAR_COLOR_THEMES.length;
  return AVATAR_COLOR_THEMES[index];
}

/**
 * @param {string} name
 * @param {string} [vehicle] - short context line, e.g. "BMW 5 Series Owner"
 * @param {number} rating - out of 5
 * @param {string} quote
 */
export default function TestimonialCard({ name, vehicle, rating, quote }) {
  // Generates initials from the name for the placeholder avatar,
  // e.g. "Ahmed Al-Faisal" -> "AA"
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Each card's own bright accent color, derived from its name --
  // see AVATAR_COLOR_THEMES / getColorTheme above.
  const theme = getColorTheme(name);

  return (
    <motion.div
      // On hover the card lifts up, scales up slightly, and rises
      // above its row (z-index) so it visually pops OUT of the
      // marquee strip and reads as prominent -- not just a subtle
      // color change. Kept modest (6px lift, 5% scale) so it still
      // feels premium rather than jumpy inside a row that's already
      // animating on its own.
      whileHover={{ y: -6, scale: 1.05, zIndex: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        group/card relative flex h-33.75 w-65 shrink-0 flex-col gap-2
        rounded-lg border border-tertiary/20 bg-secondary p-3
        shadow-none transition-[border-color,box-shadow] duration-300
        hover:shadow-xl hover:shadow-black/30
        sm:w-[320px] sm:p-4
        md:w-85
        ${theme.hoverBorder}
      `}
    >
      {/* Glow that fades in behind the card on hover, tinted to match
          this card's own avatar/star accent color (see AVATAR_COLOR_THEMES
          above) so the whole card -- border + glow -- pops in one
          consistent color per card, rather than every card glowing the
          same brand red. Purely decorative, so it's marked aria-hidden
          and ignores clicks. */}
      <div
        aria-hidden="true"
        className={`
          pointer-events-none absolute inset-0 -z-10 rounded-lg
          opacity-0 blur-lg transition-opacity duration-300
          group-hover/card:opacity-100
          ${theme.hoverGlow}
        `}
      />

      {/* ---- Header row: avatar initials + name + vehicle + stars ---- */}
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-heading text-xs font-semibold ${theme.border} ${theme.bg} ${theme.text}`}
        >
          {initials}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-heading text-sm font-semibold text-white">
            {name}
          </span>
          {/* Vehicle line is optional -- older/legacy testimonial data
              without a `vehicle` field simply won't render this line. */}
          {vehicle && (
            <span className="truncate font-label text-[10px] uppercase tracking-wide text-neutral">
              {vehicle}
            </span>
          )}
          <div className="mt-0.5 flex gap-0.5">
            {Array.from({ length: rating }).map((_, i) => (
              <FaStar key={i} className={`text-[10px] ${theme.text}`} />
            ))}
          </div>
        </div>
      </div>

      {/* ---- Quote text ----
          `line-clamp-3` caps every card's quote at 3 lines and adds an
          ellipsis if it runs longer -- this is what keeps every card in
          the row exactly the same height (h-[135px] above), no matter
          how short or long the underlying quote text is. */}
      <p className="line-clamp-4 text-xs leading-relaxed text-neutral">
        &quot;{quote}&quot;
      </p>
    </motion.div>
  );
}
