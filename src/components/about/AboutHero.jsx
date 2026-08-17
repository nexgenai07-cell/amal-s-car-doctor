/**
 * ================================================================
 * AboutHero.jsx
 * ================================================================
 * Intro section: "ABOUT US" label -> "Precision Meets Passion"
 * heading -> tagline about the company's founding.
 *
 * BACKGROUND EFFECT ("Shadow Bars" style):
 * A row of tall, softly blurred vertical bars sits behind the
 * content, each one continuously breathing up/down in height and
 * opacity on a staggered loop -- like slow-moving shafts of shadow
 * and light. The bars fade to the page background at the very top
 * and bottom edges so they blend seamlessly into the rest of the
 * page instead of reading as a hard-edged box.
 * (Note: reactbits.dev Pro's "Shadow Bars" component itself sits
 * behind their paid registry, so this is an original recreation of
 * that same visual idea -- built from scratch for this brand's red
 * palette rather than copied from their source.)
 *
 * BACKGROUND EFFECT (Rising Particles):
 * Layered on top of the Shadow Bars (but still behind the text),
 * <RisingParticles /> adds a field of small glowing red motes that
 * continuously drift upward through the section for extra depth
 * and movement. See src/components/shared/RisingParticles.jsx for
 * how the particle field itself works.
 *
 * "BREATHING" HEADING:
 * Instead of scaling the heading up/down (which would also change
 * its height and could push the tagline below it around), the
 * heading breathes by animating its letter-spacing only -- so the
 * text gently widens and narrows in place, in and out, while its
 * line-height/vertical footprint stays perfectly stable.
 * ================================================================
 */
import { motion } from "motion/react";
import Container from "../layout/Container";
import SectionLabel from "../shared/SectionLabel";
import RisingParticles from "../shared/RisingParticles";

const BAR_COUNT = 10;

function ShadowBarsBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="flex h-full w-full items-end justify-between gap-[2%] px-[2%]">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <motion.div
            key={i}
            className="h-full w-full origin-bottom rounded-full"
            style={{
              background:
                "linear-gradient(to top, color-mix(in srgb, var(--color-primary) 30%, transparent), color-mix(in srgb, var(--color-primary) 6%, transparent) 55%, transparent 100%)",
              filter: "blur(7px)",
            }}
            initial={{ scaleY: 0.25, opacity: 0.2 }}
            animate={{ scaleY: [0.25, 1, 0.25], opacity: [0.18, 0.45, 0.18] }}
            transition={{
              duration: 3.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.16,
            }}
          />
        ))}
      </div>
      {/* Blends the bars into the page background at every edge. */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
      <div className="absolute inset-0 bg-linear-to-r from-background via-transparent to-background" />
    </div>
  );
}

export default function AboutHero() {
  return (
    <section className="relative isolate overflow-hidden py-10 lg:py-12">
      <ShadowBarsBackground />
      {/* Rising particles render as a second background layer, sitting
          in normal DOM order after the shadow bars and before the
          content below -- so it is visually on top of the bars but
          still fully behind the text. */}
      <RisingParticles className="-z-10" />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <SectionLabel className="mb-2">About Us</SectionLabel>
          <motion.h1
            animate={{ letterSpacing: ["0em", "0.045em", "0em"] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-2"
          >
            Precision Meets Passion
          </motion.h1>
          <p className="text-neutral text-sm sm:text-base lg:text-lg">
            Redefining automotive excellence in Riyadh since 2011.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
