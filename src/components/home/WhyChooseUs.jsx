/**
 * ================================================================
 * WhyChooseUs.jsx
 * ================================================================
 * "Nothing Hidden. Everything Certified." section.
 *
 * - The whole section is centered with breathing room on both
 *   sides (max-w-6xl mx-auto inside Container), rather than
 *   stretching edge-to-edge -- LEFT: a big, bold, tightly-stacked
 *   uppercase heading (each word overlaps the line below it), like
 *   a compact display-type headline. RIGHT: the 4 trust features,
 *   now an interactive click-to-cycle card deck (ClickStack)
 *   instead of a static 2x2 grid -- click or drag the front card
 *   to send it to the back and reveal the next one.
 *
 * Kept intentionally compact (small section padding, small card
 * deck) so this doesn't dominate the page -- every size below is
 * responsive via Tailwind breakpoints, scaling down further on
 * mobile.
 * ================================================================
 */
import { useState } from "react";
import { motion } from "motion/react";
import {
  FaGem,
  FaUserGraduate,
  FaTag,
  FaShieldHalved,
  FaArrowRight,
} from "react-icons/fa6";
import Container from "../layout/Container";
import ClickStack from "../ui/ClickStack";

const features = [
  {
    icon: FaGem,
    title: "Genuine Parts Only",
    description: "OEM components guaranteed for every premium vehicle service.",
  },
  {
    icon: FaUserGraduate,
    title: "Certified Technicians",
    description:
      "Master mechanics with specialized training in European and luxury brands.",
  },
  {
    icon: FaTag,
    title: "Transparent Pricing",
    description:
      "No hidden fees. Full breakdown of costs before any work begins.",
  },
  {
    icon: FaShieldHalved,
    title: "Warranty on Every Job",
    description:
      "Peace of mind with comprehensive coverage on all parts and labor.",
  },
];

/** A single card's visual content, rendered inside the ClickStack. */
function FeatureCard({ feature, index, isFront }) {
  const Icon = feature.icon;
  return (
    <div
      className="
        relative flex h-full w-full flex-col gap-3 overflow-hidden rounded-2xl
        border border-tertiary/20 bg-linear-to-br from-secondary
        to-secondary-light p-5 stack-card-shadow
        sm:p-6
      "
    >
      {/* Giant translucent watermark icon in the background so the
          card reads as full/designed rather than empty space around
          the text -- a common "premium feature card" pattern. */}
      <Icon
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 -right-5 text-[110px] text-primary/5"
      />

      {/* Faint corner glow, brand-red, purely decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/20 blur-3xl"
      />

      {/* Eyebrow pill badge, e.g. "FEATURE 01 / 04" -- reads as an
          intentional design element rather than a bare corner label. */}
      <span
        className="
          relative w-fit rounded-full border border-tertiary/30 bg-background/50
          px-2.5 py-1 font-label text-[9px] tracking-widest text-neutral
        "
      >
        FEATURE 0{index + 1} / 0{features.length}
      </span>

      {/* Icon badge with a soft, continuously breathing glow behind
          it -- same visual language as the StatCard icons elsewhere
          on the Home page. */}
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center sm:h-12 sm:w-12">
        <motion.div
          aria-hidden="true"
          animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-linear-to-br from-primary to-primary-light blur-lg"
        />
        <div
          className="
            relative flex h-9 w-9 items-center justify-center rounded-xl
            border border-primary-light/30 bg-linear-to-br from-primary
            to-primary-dark text-lg text-white
            icon-badge-glow
            sm:h-10 sm:w-10
          "
        >
          <Icon />
        </div>
      </div>

      <div className="relative flex flex-col gap-1.5">
        <div className="inline-block self-start">
          <h3 className="font-heading text-base font-bold sm:text-lg">
            {feature.title}
          </h3>
          <span
            aria-hidden="true"
            className="mt-1.5 block h-0.5 w-full rounded-full bg-linear-to-r from-primary to-primary-light"
          />
        </div>
        <p className="text-xs leading-relaxed text-neutral sm:text-sm">
          {feature.description}
        </p>
      </div>

      {/* Interactivity hint -- only shown on the front card so people
          know it's clickable/draggable, not just decorative. */}
      {isFront && (
        <div className="relative mt-auto flex items-center gap-1.5 text-[11px] font-medium text-primary-light/80">
          <span>Tap for next</span>
          <FaArrowRight className="text-[9px]" />
        </div>
      )}
    </div>
  );
}

export default function WhyChooseUs() {
  const [activeIndex, setActiveIndex] = useState(0);

  const cards = features.map((feature, i) => (
    <FeatureCard feature={feature} index={i} isFront={i === activeIndex} />
  ));

  return (
    <section className="overflow-hidden bg-secondary/30 py-10 lg:py-14">
      <Container>
        <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-6">
          {/* ---------------- LEFT: STACKED HEADING ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.h2
              animate={{ scaleX: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="font-heading font-black uppercase leading-none tracking-tight text-2xl sm:text-3xl md:text-4xl"
            >
              <span className="heading-3d block -mt-1 first:mt-0">Nothing</span>
              <span className="heading-3d block -mt-1">Hidden.</span>
              <span className="heading-3d block -mt-1">Everything</span>
              <span className="heading-3d-accent block -mt-1 text-primary">
                Certified.
              </span>
            </motion.h2>
            <p className="mx-auto mt-3 max-w-md text-xs text-neutral sm:text-sm lg:mx-0">
              Full transparency in every diagnostic report and repair step.
            </p>
          </motion.div>

          {/* ---------------- RIGHT: CLICK-TO-CYCLE CARD DECK ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col items-center"
          >
            <ClickStack
              items={cards}
              onActiveChange={setActiveIndex}
              className="h-55 w-full max-w-60 sm:h-60 sm:max-w-67.5 lg:h-65 lg:max-w-72.5"
            />

            {/* Dot pagination so the deck's position/progress is
                visible even without reading the "0X / 04" counter
                on the card itself. */}
            <div className="mt-5 flex items-center gap-1.5">
              {features.map((feature, i) => (
                <span
                  key={feature.title}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-5 bg-primary"
                      : "w-1.5 bg-tertiary/40"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
