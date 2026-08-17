/**
 * ================================================================
 * TeamMemberCard.jsx
 * ================================================================
 * The visual "face" shown inside ONE slot of the "Meet the
 * Specialists" CardSpread fan (see TeamGrid.jsx / ui/CardSpread.jsx).
 *
 * CardSpread.jsx owns all the geometry (rotation, lift, shadow,
 * rounded corners, clipping) -- this component only has to fill the
 * 100%x100% box it's given with brand-styled content:
 *   - a full-bleed photo (or initials placeholder if none is set)
 *   - a permanent bottom gradient + name + role, readable even when
 *     the card is dimmed/at rest
 *   - a short bio line that fades/slides in ONLY while this card is
 *     the active (hovered / keyboard-focused / tapped) one, since
 *     there isn't room for it on a resting, overlapped card
 * ================================================================
 */
import { motion } from "motion/react";
import Badge from "../ui/Badge";

/**
 * @param {string} name
 * @param {string} role
 * @param {string} bio
 * @param {string|null} photo
 * @param {boolean} [isActive] - true while this card is the one currently spread open
 */
export default function TeamMemberCard({
  name,
  role,
  bio,
  photo,
  isActive = false,
}) {
  // Fallback initials (e.g. "Tariq Al-Faisal" -> "TA") shown when a
  // team member has no photo on file yet, so the slot never renders
  // visually empty.
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={
        // Base frame: fills the whole CardSpread slot, near-black
        // backdrop (so the initials fallback and gradient both read
        // correctly), with a hairline border that brightens to the
        // brand red + a soft red glow while this card is active --
        // see `.specialist-card-glow` in src/index.css.
        "relative flex h-full w-full flex-col justify-end overflow-hidden " +
        "bg-secondary border transition-[border-color] duration-300 " +
        (isActive
          ? "border-primary/70 specialist-card-glow"
          : "border-tertiary/20")
      }
    >
      {/* Photo fills the entire card, or the initials placeholder if
          no photo has been uploaded for this specialist yet. */}
      {photo ? (
        <img
          src={photo}
          alt={name}
          // A subtle zoom on the active card gives the reveal a
          // tiny bit of extra life instead of the photo just
          // sitting static while everything around it animates.
          className={
            "absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out " +
            (isActive ? "scale-105" : "scale-100")
          }
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary">
          <span className="font-heading text-3xl font-bold text-primary/60">
            {initials}
          </span>
        </div>
      )}

      {/* Bottom gradient scrim so the name/role/bio text stays
          legible over any photo, brightest right where the text
          sits and fully transparent higher up so the photo itself
          still reads clearly above it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-background via-background/80 to-transparent"
      />

      {/* Text content, always on top of the gradient. */}
      <div className="relative flex flex-col items-start gap-1.5 p-3.5 sm:p-4">
        <h3 className="font-heading text-sm font-semibold leading-tight text-white sm:text-base">
          {name}
        </h3>

        <Badge variant="solid" className="text-[9px] sm:text-[10px]">
          {role}
        </Badge>

        {/* The bio only takes up space / becomes visible once this
            card is active -- on a resting, partly-overlapped card in
            the fan there simply isn't room to show a full sentence
            without it clipping into the neighbouring card. */}
        <motion.p
          initial={false}
          animate={
            isActive
              ? { opacity: 1, height: "auto", marginTop: 2 }
              : { opacity: 0, height: 0, marginTop: 0 }
          }
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="overflow-hidden text-[11px] leading-relaxed text-neutral sm:text-xs"
        >
          {bio}
        </motion.p>
      </div>
    </div>
  );
}
