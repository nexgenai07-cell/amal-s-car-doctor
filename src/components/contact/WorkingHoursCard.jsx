/**
 * ================================================================
 * WorkingHoursCard.jsx
 * ================================================================
 * "Working Hours" card — shows Sat-Thu hours, Friday's later
 * opening time, and a live "Open Now / Closed" indicator calculated
 * from the current time (not hardcoded), showing an "OPEN NOW -
 * CLOSES 12 AM" style badge.
 *
 * Restyled as a compact "glass" card — same frosted-glass recipe
 * (bg-secondary/40 + backdrop-blur-xl + soft red glow blobs + a
 * thin gradient hairline across the top edge) already established
 * by CTABanner.jsx, so this section reads as part of the same
 * design language instead of a plain flat box.
 * ================================================================
 */
import { motion } from "motion/react";
import { FaClock, FaCalendarDay } from "react-icons/fa6";
import Container from "../layout/Container";
import { siteConfig } from "../../config/siteConfig";
import { cn } from "../../utils/cn";

// Calculates whether the workshop is currently open, based on the
// real current time and day. Working hours: Sat-Thu 8 AM-12 AM,
// Friday 1 PM-12 AM (matches siteConfig) -- open every day, Friday
// simply opens later.
function getOpenStatus() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
  const hour = now.getHours();

  const isFriday = day === 5;
  const openingHour = isFriday ? 13 : 8; // Friday opens at 1 PM, every other day at 8 AM
  // Every day runs until midnight, so "within hours" only needs to
  // check the opening side -- the day rolls over to the next date
  // at 12 AM either way.
  const isWithinHours = hour >= openingHour;

  return {
    isOpen: isWithinHours,
    label: isWithinHours
      ? "Open Now — Closes 12 AM"
      : `Closed — Opens ${isFriday ? "1 PM" : "8 AM"}`,
  };
}

export default function WorkingHoursCard() {
  const { isOpen, label } = getOpenStatus();

  return (
    <section className="relative overflow-hidden py-10 sm:py-12">
      <Container>
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-center mb-6 sm:mb-8">
          Working Hours
        </h2>

        {/* ----------------------------------------------------
            THE GLASS CARD
            Same recipe as CTABanner's card: rounded-3xl, semi-
            transparent dark background + backdrop-blur ("frosted
            glass"), a subtle border, two soft red glow blobs
            tucked in opposite corners, and a thin glowing red
            hairline across the top edge. "isolate" + "overflow-
            hidden" keep the glow blobs clipped behind the content.
        ---------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "relative isolate mx-auto max-w-sm overflow-hidden rounded-3xl",
            "border border-tertiary/25 bg-secondary/40 backdrop-blur-xl",
            "shadow-[0_0_50px_-15px_rgba(0,0,0,0.7)]",
            "p-5 sm:p-6",
          )}
        >
          {/* Soft red glow blobs, opposite corners, purely decorative */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-14 -right-10 h-36 w-36 rounded-full bg-primary/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-primary-light/15 blur-3xl"
          />
          {/* Thin glowing hairline across the top edge — same detail
              used on CTABanner's glass card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-primary to-transparent"
          />

          <div className="relative z-10">
            {/* Live open/closed status — small glassy pill instead of
                a plain text row + divider, with a soft glow tint
                matching whichever state is active */}
            <div
              className={cn(
                "mb-4 flex w-fit items-center gap-2 rounded-full border px-3 py-1.5",
                isOpen
                  ? "border-success/30 bg-success/10"
                  : "border-primary/30 bg-primary/10",
              )}
            >
              <FaClock
                className={cn(
                  "text-xs",
                  isOpen ? "text-success" : "text-primary",
                )}
              />
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isOpen ? "bg-success animate-pulse" : "bg-primary",
                )}
              />
              <span className="font-label text-[10px] sm:text-xs uppercase tracking-wider text-white">
                {label}
              </span>
            </div>

            {/* Hours rows — each in its own subtle glass chip so the
                two days read as distinct, scannable rows rather than
                a plain stacked list */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/3 px-4 py-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FaCalendarDay className="shrink-0 text-primary text-xs" />
                  <span className="text-sm text-white font-medium truncate">
                    {siteConfig.workingHours.weekdaysLabel}
                  </span>
                </div>
                <span className="font-label text-xs text-neutral shrink-0">
                  {siteConfig.workingHours.weekdaysTime}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/3 px-4 py-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FaCalendarDay className="shrink-0 text-primary text-xs" />
                  <span className="text-sm text-white font-medium truncate">
                    {siteConfig.workingHours.fridayLabel}
                  </span>
                </div>
                <span className="font-label text-xs text-neutral shrink-0">
                  {siteConfig.workingHours.fridayStatus}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
