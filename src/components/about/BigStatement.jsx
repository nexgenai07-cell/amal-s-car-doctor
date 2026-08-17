/**
 * ================================================================
 * BigStatement.jsx
 * ================================================================
 * The large closing statement: "We Don't Cut Corners. We Find Them."
 * with the second line highlighted in red, matching the design's
 * bold, minimal closing section.
 *
 * BACKGROUND EFFECT (Animated Beam Grid):
 * <AnimatedBeamBackground /> renders a dark grid of thin diagonal
 * lines behind the statement, with a handful of them carrying a
 * bright streak of light sliding down on a loop, for a bold,
 * technical feel that matches the confident tone of the statement
 * itself. See src/components/shared/AnimatedBeamBackground.jsx for
 * how the beam grid itself works.
 * ================================================================ */
import { motion } from "motion/react";
import Container from "../layout/Container";
import AnimatedBeamBackground from "../shared/AnimatedBeamBackground";

export default function BigStatement() {
  return (
    // "relative isolate overflow-hidden" lets the beam background
    // fill and clip to this exact section, without its z-index
    // layering leaking into sections above or below it.
    <section className="relative isolate overflow-hidden py-24 lg:py-36">
      <AnimatedBeamBackground className="-z-10" />
      <Container>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-center leading-tight"
        >
          We Don't Cut Corners. <br />
          <span className="text-primary">We Find Them.</span>
        </motion.h2>
      </Container>
    </section>
  );
}
