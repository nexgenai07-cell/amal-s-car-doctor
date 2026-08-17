/**
 * ================================================================
 * ServicesHero.jsx
 * ================================================================
 * The intro section at the top of the Services Hub page:
 * "OUR SERVICES" label -> "Every Service. Precisely Delivered."
 * heading -> description paragraph.
 *
 * BACKGROUND EFFECT (Rising Particles):
 * <RisingParticles /> renders a field of small glowing red motes
 * that continuously drift upward through the section, sitting
 * fully behind the text content. See
 * src/components/shared/RisingParticles.jsx for how the particle
 * field itself works.
 *
 * "BREATHING" HEADING:
 * The heading gently widens and narrows in place -- its
 * letter-spacing animates from normal, out to slightly wider,
 * and back, on an infinite loop. This is a "width" breathing
 * effect rather than a scale (grow/shrink) effect: the text never
 * changes size or height, only how loosely its letters sit next to
 * each other, so nothing else on the page shifts around it. Matches
 * the same breathing heading used on the About Us page hero.
 * ================================================================
 */
import { motion } from "motion/react";
import Container from "../layout/Container";
import SectionLabel from "../shared/SectionLabel";
import RisingParticles from "../shared/RisingParticles";

export default function ServicesHero() {
  return (
    <section className="relative isolate overflow-hidden pt-10 pb-10 lg:pt-10">
      <RisingParticles className="-z-10" />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <SectionLabel>Our Services</SectionLabel>
          <motion.h1
            animate={{ letterSpacing: ["0em", "0.045em", "0em"] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="font-heading font-bold text-4xl sm:text-5xl mb-4"
          >
            Every Service. Precisely Delivered.
          </motion.h1>
          <p className="text-neutral text-base sm:text-lg">
            From routine maintenance to complex diagnostics, we handle it all
            with certified precision.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
