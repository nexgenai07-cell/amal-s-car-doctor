/**
 * ================================================================
 * CaseFileCard.jsx
 * ================================================================
 * A single "case file" card: image on top, title below, then a
 * Problem / Solution / Result breakdown. The "Result" line is shown
 * in green to visually communicate a positive outcome, matching the
 * design.
 *
 * USED INSIDE <SkewedCarousel /> (see CaseFilesGrid.jsx):
 * SkewedCarousel owns ALL of the positioning, rotation, scale and
 * transition logic for every slide -- this component only ever
 * decides what a single slide LOOKS like. It receives two pieces of
 * live state back from the carousel for that purpose:
 *   - `isActive`   -> true only for the centered, focused slide.
 *                     Drives the red "in-focus" ring so the active
 *                     case reads clearly as selected.
 *   - `blurAmount` -> 0 for the active slide, `titleBlur` (px) for
 *                     every receding slide. Applied ONLY to the
 *                     caption block below the image (never the
 *                     photo itself), so distant slides still read
 *                     as recognisable thumbnails while their text
 *                     softens out of focus -- exactly like the
 *                     reference component blurs inactive captions.
 * ================================================================
 */
import { FaCarSide } from "react-icons/fa6";
import { cn } from "../../utils/cn";

// Small reusable row inside the card for each labeled line
// (Problem / Solution / Result).
//
// WHY `line-clamp-2` + a matching fixed `min-h` ON THE VALUE:
// Every case file's Problem/Solution/Result text is a different
// length (some one short sentence, some longer). Without a fixed
// height here, shorter text left a gap while longer text pushed the
// card taller than its neighbours -- so across the 6 cards, some
// visibly showed "more" content and some "less", and on a couple of
// cards the longest line even got clipped by the carousel's fixed
// card height. Locking every value to a 2-line box (clamping
// anything longer, and reserving that same space even when the
// text is shorter) makes every card's Problem/Solution/Result rows
// occupy EXACTLY the same amount of space, every time -- so the
// deck reads as uniform no matter which case is showing.
function CaseRow({ label, value, highlight }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-label text-[8px] uppercase tracking-wider text-red-600">
        {label}
      </span>
      <p
        className={`text-[10px] sm:text-xs leading-snug highlight ? "text-success" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}

/**
 * @param {string} title
 * @param {string|null} image
 * @param {string} problem
 * @param {string} solution
 * @param {string} result
 * @param {boolean} [isActive] - true only for the carousel's centered slide
 * @param {number} [blurAmount] - px of blur applied to the caption when inactive
 */
export default function CaseFileCard({
  title,
  image,
  problem,
  solution,
  result,
  isActive = true,
  blurAmount = 0,
}) {
  return (
    <div
      className={cn(
        "h-full w-full flex flex-col bg-secondary border border-tertiary/20 rounded-[inherit] overflow-hidden transition-shadow duration-300",
        // Reuses the same active-card glow token already defined in
        // index.css for the About Us page's fanned specialist deck,
        // so a carousel's "in-focus" card and a card-spread's
        // "in-focus" card share one consistent visual language
        // across the whole site.
        isActive && "specialist-card-glow",
      )}
    >
      {/* Image area -- shows a placeholder icon block until real
          workshop photos are provided. Always kept sharp/unblurred,
          even on receding slides, so the deck still reads as a
          recognisable photo strip at a glance.

          A fixed height (rather than an aspect ratio tied to card
          width) keeps the photo compact and proportionate at every
          screen size, leaving the caption block below it with
          consistent room to breathe. */}
      <div className="h-20 sm:h-24 shrink-0 bg-secondary-light flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <FaCarSide className="text-tertiary/40 text-3xl" />
        )}
      </div>

      {/* Caption block: title + Problem/Solution/Result. This is the
          part that softens into a blur once the slide is no longer
          the active one, so the visitor's eye is guided straight to
          the centered card's text instead of trying to read every
          tilted neighbour at once. */}
      <div
        className="p-2.5 sm:p-2 flex flex-col gap-1.5 sm:gap-3 min-h-0 overflow-hidden"
        style={{ filter: blurAmount > 0 ? `blur(${blurAmount}px)` : "none" }}
      >
        <h3 className="font-heading font-semibold text-xs sm:text-sm leading-snug line-clamp-2 min-h-8 sm:min-h-3 text-success">
          {title}
        </h3>
        <CaseRow label="Problem" value={problem} />
        <CaseRow label="Solution" value={solution} />
        <CaseRow label="Result" value={result} highlight />
      </div>
    </div>
  );
}
