import { motion } from "motion/react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Container from "../layout/Container";
import { ROUTES } from "../../constants/routes";
// Used as the video's "poster" frame -- the still image the browser
// shows BEFORE the video has finished loading (slow connections,
// or the brief instant right after the page loads). Reusing this
// real repair close-up photo (instead of a plain gray box) means
// visitors never see an empty flash before the video kicks in.
import heroPosterImage from "../../assets/images/hero/service-before.jpg";

// ------------------------------------------------------------------
// ENTRANCE ANIMATION VARIANTS
// ------------------------------------------------------------------
// "heroContainerVariants" controls the PARENT: it doesn't move or
// fade itself, it just tells its children to animate in one after
// another (staggerChildren) instead of all at once, which is what
// creates the "content flying in piece by piece" effect on load.
const heroContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15, // gap between each child's animation start
      delayChildren: 0.1, // small pause before the first child starts
    },
  },
};

// "heroItemVariants" controls each individual piece of content
// (badge, heading, paragraph, buttons). Each one starts well ABOVE
// its final position (y: -50) and fully invisible, then drops down
// into place while fading in -- this is the "flying in from the
// top" motion the client asked for.
const heroItemVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export default function HeroSection() {
  return (
    // "relative" + "overflow-hidden" so the absolutely-positioned
    // video/overlay below stay clipped to this section's rounded
    // bounds and never bleed into the sections above/below it.
    // "min-h-[...]" makes the video hero feel like a full, modern
    // "cinematic" opener instead of a short thin strip, on every
    // screen size -- flex + items-center then keeps the whole
    // centered column vertically centered inside that taller space.
    <section className="relative flex min-h-140 items-center overflow-hidden pt-8 pb-2 sm:min-h-160 lg:min-h-[85vh] lg:pt-8 lg:pb-2">
      {/* ---------------- BACKGROUND VIDEO ---------------- */}
      {/* autoPlay + loop + muted + playsInline together are what
          let this video autoplay on load across all browsers,
          including iOS Safari (which blocks autoplay entirely if
          "muted" or "playsInline" is missing). "object-cover" makes
          the video always fill this section without distorting,
          cropping evenly on whichever side is needed. */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/workshop-tour.mp4"
        poster={heroPosterImage}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      {/* ---------------- DARK SCRIM OVERLAY ---------------- */}
      {/* Sits directly above the video: darkens the top/bottom edges
          so the heading/paragraph/buttons stay readable against any
          frame of the video underneath. Now that the content is a
          single CENTERED column (not just on the left), this overlay
          darkens evenly left-to-right instead of favoring one side. */}
      <div className="hero-video-overlay absolute inset-0" aria-hidden="true" />

      {/* ---------------- BRAND EMBER GLOW ---------------- */}
      {/* A soft red ambient glow centered low in the section, so the
          video hero still carries this site's signature red
          "diagnostic scan" warmth instead of reading as a plain
          stock video. Repositioned to sit centered (rather than
          weighted to the left) now that the content itself is
          centered. */}
      <div className="hero-ember-glow absolute inset-0" aria-hidden="true" />

      {/* ---------------- FOREGROUND CONTENT ---------------- */}
      {/* "relative z-10" lifts all of the actual content above the
          video + overlay + glow layers, which are all absolutely
          positioned behind it at this point. */}
      <Container className="relative z-10 w-full">
        {/* The outer motion.div is the STAGGER PARENT (see
            heroContainerVariants above) -- it doesn't animate
            itself, it just triggers each motion.* child below to
            fly in one after another instead of all at once.
            "mx-auto" + "max-w-3xl" + "text-center" + "items-center"
            together are what actually CENTER this whole block, both
            horizontally on the page and internally (badge/buttons
            centered instead of left-aligned), now that there is no
            second column beside it. */}
        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto flex max-w-3xl flex-col items-center gap-7 text-center"
        >
          <motion.div variants={heroItemVariants}>
            <Badge variant="outline">Processor Diagnostics</Badge>
          </motion.div>

          {/* "hero-text-shadow" (index.css) adds a soft dark drop
              shadow behind the heading, on top of the overlay above,
              guaranteeing contrast against every video frame --
              including brighter ones like reflective metal or
              workshop ceiling lights. */}
          <motion.h1
            variants={heroItemVariants}
            className="hero-text-shadow font-heading text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl"
          >
            We Don't Just Repair. We{" "}
            <span className="text-primary">Diagnose.</span>
          </motion.h1>

          <motion.p
            variants={heroItemVariants}
            className="hero-text-shadow max-w-lg font-body text-base leading-relaxed text-neutral sm:text-lg"
          >
            Advanced automotive care for Riyadh's premier vehicles. Utilizing
            state of the art telemetry and certified engineering to ensure your
            vehicle operates at peak performance.
          </motion.p>

          {/* ---------------- CTA BUTTONS ---------------- */}
          <motion.div
            variants={heroItemVariants}
            className="flex flex-col gap-4 pt-2 sm:flex-row"
          >
            <Button variant="primary" size="md" to={ROUTES.CONTACT}>
              Book a Checkup
            </Button>
            <Button variant="outline" size="md" to={ROUTES.SERVICES}>
              View Services
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
