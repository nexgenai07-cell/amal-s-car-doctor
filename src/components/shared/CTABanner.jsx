/**
 * ================================================================
 * CTABanner.jsx
 * ================================================================
 * A reusable, high-impact "glass card" call-to-action banner.
 *
 * WHERE THIS IS USED:
 * 1. Home.jsx -> big, full hero-style CTA at the very bottom of the
 *                homepage ("boxed" = false).
 * 2. Anywhere a smaller, embedded CTA card is needed mid-page
 *    ("boxed" = true).
 *
 * VISUAL CONCEPT (matches the reference "glassy" design the client
 * shared, but re-themed with OUR OWN brand colors instead of the
 * green/purple from the reference image):
 *   - A large rounded card with a soft frosted-glass background
 *     (blurred, semi-transparent) sitting on the dark page.
 *   - A thin glowing red hairline across the very top edge of the
 *     card, exactly like the reference screenshot.
 *   - Two soft red glow blobs blurred behind the card corners, to
 *     give it depth instead of looking flat.
 *   - A big bold heading where the last few important words are
 *     painted with our brand's red gradient (primary-light ->
 *     primary -> primary-dark), exactly like "Become Reality" is
 *     gradient-colored in the reference image.
 *   - A supporting sentence explaining exactly what the visitor
 *     gets (free diagnostic call, transparent pricing, honest
 *     timeline) — this is real Amal Car's Doctor content, not
 *     generic placeholder text.
 *   - A gradient "primary" button (red gradient, glowing on hover)
 *     next to an "outline" secondary button, plus a plain phone
 *     number link underneath — matching the 3-tier CTA hierarchy
 *     seen in the reference image (Book Free Call / Explore
 *     Services / phone number).
 *
 * WHY IT USES ONLY EXISTING DESIGN TOKENS:
 * Per this project's rule (see index.css), we never hardcode hex
 * colors. Every color below (bg-primary, text-neutral, bg-success,
 * etc.) comes from the @theme tokens already defined in index.css,
 * so if the client ever changes the brand red, this CTA updates
 * automatically along with the rest of the site.
 * ================================================================
 */
import { motion } from "motion/react";
import Button from "../ui/Button";
import Container from "../layout/Container";
import { siteConfig } from "../../config/siteConfig";
import { ROUTES } from "../../constants/routes";
import { cn } from "../../utils/cn";

/**
 * Splits the `heading` string into 3 pieces so we can paint the
 * important part of it with the red gradient, the same way the
 * reference design paints "Become Reality" in a different color
 * from "Your Idea Deserves to".
 *
 * HOW IT WORKS:
 * - If the caller explicitly passes an `accent` string that exists
 *   somewhere inside `heading`, we split around THAT exact phrase.
 *   This gives full manual control (used by Home.jsx below).
 * - If no `accent` is passed (e.g. a caller that builds its heading
 *   dynamically), we automatically fall back to gradient-coloring
 *   the LAST TWO words of the heading. This means older/simpler
 *   callers keep working with zero changes, and still look
 *   intentional instead of plain.
 *
 * @param {string} heading - full CTA heading text
 * @param {string} [accent] - optional exact phrase to highlight
 * @returns {{lead: string, highlight: string, trail: string}}
 */
function splitHeadingForAccent(heading, accent) {
  // Manual mode: caller told us exactly which phrase to highlight.
  if (accent && heading.includes(accent)) {
    const startIndex = heading.indexOf(accent);
    return {
      lead: heading.slice(0, startIndex).trim(),
      highlight: accent,
      trail: heading.slice(startIndex + accent.length).trim(),
    };
  }

  // Automatic fallback mode: highlight the last 1-2 words only.
  const words = heading.trim().split(" ");
  if (words.length <= 2) {
    // Very short headings: gradient the whole thing.
    return { lead: "", highlight: heading, trail: "" };
  }
  const highlight = words.slice(-2).join(" ");
  const lead = words.slice(0, -2).join(" ");
  return { lead, highlight, trail: "" };
}

/**
 * @param {string} heading - main CTA heading (required)
 * @param {string} [accent] - exact phrase inside `heading` to paint
 *   with the red gradient. If omitted, the last 2 words are used.
 * @param {string} [subheading] - one supporting sentence under the
 *   heading, explaining the offer in real Amal Car's Doctor terms.
 * @param {string} [buttonText] - label on the main gradient button
 * @param {string} [secondaryButtonText] - label on the outline button
 * @param {boolean} [boxed] - true = compact card used mid-page
 *   (Service Detail style). false = large hero-style card used as
 *   a full standalone section (Home page style).
 */
export default function CTABanner({
  heading,
  accent,
  subheading = "Free inspection, transparent pricing, honest timeline — no guesswork, no hidden charges.",
  buttonText = "Book Now",
  secondaryButtonText = "Explore Services",
  boxed = false,
}) {
  // Break the heading into "plain text" + "gradient text" pieces.
  const { lead, highlight, trail } = splitHeadingForAccent(heading, accent);

  return (
    // Outer <section> just controls vertical breathing room around
    // the card. It's bigger on the Home page (full section) and
    // smaller when embedded mid-page on Service Detail (boxed).
    <section
      className={cn(
        "relative overflow-hidden",
        boxed ? "py-10 lg:py-12" : "py-12 sm:py-14 lg:py-16",
      )}
    >
      <Container>
        {/* ------------------------------------------------------
            THE GLASS CARD
            - "max-w-2xl mx-auto" keeps the card from stretching the
              full page width — it stays a compact, centered block
              with equal empty space on the left and right sides,
              instead of spanning edge-to-edge like a full section.
            - rounded-3xl + border + semi-transparent dark
              background + backdrop-blur = the "frosted glass"
              look from the reference image.
            - "isolate" creates a new stacking context so the glow
              blobs behind it never bleed on top of the text.
            - "overflow-hidden" clips the glow blobs to the card's
              rounded corners so they don't spill outside the card.
        ------------------------------------------------------ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "relative isolate mx-auto overflow-hidden rounded-3xl",
            "border border-tertiary/25",
            "bg-secondary/40 backdrop-blur-xl",
            "shadow-[0_0_60px_-15px_rgba(0,0,0,0.7)]",
            // Width increased slightly (max-w-xl -> max-w-2xl for
            // boxed, max-w-2xl -> max-w-3xl for the home version) so
            // the card breathes a bit more horizontally, while the
            // vertical (y-axis) padding is reduced further so the
            // card looks shorter/tighter top-to-bottom.
            boxed
              ? "max-w-2xl px-6 py-6 sm:px-8 sm:py-8"
              : "max-w-3xl px-6 py-8 sm:px-10 sm:py-9",
          )}
        >
          {/* Soft red glow blob, top-left corner, purely decorative.
              Sized down slightly so it stays proportional to the
              smaller card and doesn't overpower it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -left-16 h-56 w-56 rounded-full bg-primary/25 blur-3xl"
          />
          {/* Second, softer glow blob, bottom-right corner, for
              balance so the card doesn't look lopsided. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-14 h-56 w-56 rounded-full bg-primary-light/15 blur-3xl"
          />
          {/* Thin glowing hairline across the top edge of the card —
              this is the exact detail from the reference screenshot
              (a faint gradient line fading in from the left,
              brightest in the middle, fading out to the right). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-primary to-transparent"
          />

          {/* "relative z-10" lifts all real content above the glow
              blobs and hairline so nothing visual overlaps text.
              "gap-5" (down from gap-6) tightens the vertical
              rhythm to match the smaller, more compact card. */}
          <div className="relative z-10 flex flex-col items-center gap-5 text-center">
            {/* --------------------------------------------------
                MAIN HEADING
                Plain white text for the "lead" part, then the
                highlighted phrase painted with our red gradient
                using bg-clip-text (the same CSS trick used in the
                reference image's "Become Reality" text).
                Font sizes reduced so the heading fits comfortably
                inside the smaller card without overflowing.
            -------------------------------------------------- */}
            <h3
              className={cn(
                "max-w-xl font-heading font-extrabold leading-[1.15] text-white",
                boxed
                  ? "text-xl sm:text-2xl lg:text-3xl"
                  : "text-2xl sm:text-3xl lg:text-4xl",
              )}
            >
              {lead && <>{lead} </>}
              <span className="bg-linear-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
                {highlight}
              </span>
              {trail && <> {trail}</>}
            </h3>

            {/* --------------------------------------------------
                SUPPORTING SENTENCE
                Real, specific Amal Car's Doctor copy — tells the
                visitor exactly what happens when they click, which
                builds more trust than generic filler text.
            -------------------------------------------------- */}
            <p
              className={cn(
                "max-w-md font-body text-neutral",
                boxed ? "text-xs sm:text-sm" : "text-sm sm:text-base",
              )}
            >
              {subheading}
            </p>

            {/* --------------------------------------------------
                ACTION ROW: gradient primary button + outline
                secondary button, stacked on mobile, side-by-side
                from the small breakpoint up — mirrors the "Book
                Free Call" + "Explore Services" pairing from the
                reference image.
            -------------------------------------------------- */}
            <div className="mt-1 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
              <Button
                variant="primary"
                size={boxed ? "sm" : "md"}
                to={ROUTES.CONTACT}
                showArrow
                fullWidth
                className={cn(
                  // Overlay our red gradient on top of the button's
                  // default solid red, and boost the glow on hover
                  // so it visually matches the reference button.
                  "bg-linear-to-r from-primary-light via-primary to-primary-dark",
                  "hover:brightness-110",
                  "sm:w-auto",
                )}
              >
                {buttonText}
              </Button>

              <Button
                variant="outline"
                size={boxed ? "sm" : "md"}
                to={ROUTES.SERVICES}
                fullWidth
                className="sm:w-auto"
              >
                {secondaryButtonText}
              </Button>
            </div>

            {/* --------------------------------------------------
                PHONE NUMBER FALLBACK
                For visitors who'd rather call than fill a form —
                kept from the original CTABanner so this behaviour
                isn't lost in the redesign.
            -------------------------------------------------- */}
            <a
              href={`tel:${siteConfig.contact.phoneRaw}`}
              className="font-label text-xs uppercase tracking-wide text-neutral transition-colors hover:text-primary"
            >
              or call {siteConfig.contact.phone}
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
