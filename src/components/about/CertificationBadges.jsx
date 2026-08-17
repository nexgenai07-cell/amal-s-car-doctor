/**
 * ================================================================
 * CertificationBadges.jsx
 * ================================================================
 * "Certified & Trusted" -- row of 5 trust badges, styled as glowing
 * ringed circles connected by a dashed line, in the style of the
 * numbered-step reference the client shared. Each circle also
 * drifts gently up and down forever, like a slow-floating bubble,
 * which is what makes the row feel alive rather than a static row
 * of icons.
 *
 * LAYOUT:
 * On phones (below the "sm" breakpoint) the 5 badges simply wrap
 * onto as many rows as they need, evenly centered, with no
 * connector line -- a straight connector only makes visual sense
 * once all 5 sit on one single row. From "sm" up, they're forced
 * onto one row (flex-nowrap) with a dashed line drawn between each
 * consecutive pair, exactly like the reference image.
 *
 * TWO SEPARATE MOTION ANIMATIONS PER BADGE:
 * 1. An ENTRANCE animation (fades and slides up once, the first
 *    time the badge scrolls into view).
 * 2. An independent, infinitely-looping FLOAT animation nested
 *    inside it (the circle drifting up/down forever). Keeping these
 *    as two separate Motion elements means the one-time entrance
 *    and the endless float never fight over the same `animate` prop.
 * ================================================================ */
import { motion } from "motion/react";
import Container from "../layout/Container";
import { trustBadges } from "../../data/stats";

export default function CertificationBadges() {
  return (
    <section className="py-1 lg:py-1">
      <Container>
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-center mb-1">
          Certified <span className="text-primary">&</span> Trusted
        </h2>
        <div className="w-12 h-0.5 bg-primary mx-auto mb-14 sm:mb-16" />

        {/* flex-wrap on mobile (no straight row to connect anyway),
            forced onto one straight row from "sm" up so the dashed
            connector lines between circles line up correctly. */}
        <div className="flex flex-wrap sm:flex-nowrap items-start justify-center gap-x-8 gap-y-12 sm:gap-x-2 lg:gap-x-6">
          {trustBadges.map((badge, i) => {
            const Icon = badge.icon;
            const isLast = i === trustBadges.length - 1;

            return (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-1 min-w-22.5 max-w-35 flex-col items-center gap-3 text-center"
              >
                {/* Dashed connector reaching from the CENTER of this
                    circle to the center of the next one. Since every
                    item here is an equal-width flex-1 column, a line
                    spanning this item's own full width lands exactly
                    between the two circle centers -- same technique
                    already used for the solid connector in
                    StepperProcess.jsx, just dashed instead of solid
                    to match the reference image. Hidden below "sm"
                    (badges wrap instead of forming one straight row
                    there) and on the very last badge (nothing after
                    it to connect to). */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="hidden sm:block absolute top-10 left-1/2 -z-10 w-full border-t border-dashed border-primary/40"
                  />
                )}

                {/* Continuous up/down "bubble" drift, running forever
                    and independently of the one-time entrance
                    animation on the parent above. Duration/delay vary
                    slightly per badge (based on its own index) so
                    all 5 circles float out of sync with each other
                    instead of bobbing up and down in unison. */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3 + (i % 3) * 0.4,
                    delay: i * 0.15,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* The circle itself: solid red gradient fill (same
                      gradient used by IconBox's "gradient" variant
                      elsewhere on the site) plus a red glow shadow,
                      surrounded by the two soft fading rings defined
                      in `.cert-badge-ring` (src/index.css) to match
                      the "target rings" look from the reference
                      image. Sized up slightly from "sm" so the rings
                      have visible breathing room on larger screens. */}
                  <div className="cert-badge-ring flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-linear-to-br from-primary-light via-primary to-primary-dark text-lg text-white shadow-[0_0_25px_-5px_var(--color-primary)] sm:text-2xl">
                    <Icon />
                  </div>
                </motion.div>

                <span className="font-label text-[10px] uppercase tracking-wider text-neutral sm:text-[11px]">
                  {badge.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
