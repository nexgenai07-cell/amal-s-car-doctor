/**
 * ================================================================
 * ServicesOrbitDiagram.jsx
 * ================================================================
 * The circular "hub" diagram on the Home page: "Engine Diagnostics"
 * sits in a highlighted red center node, with 5 other services
 * positioned around it as satellite nodes (pulled from
 * orbitSatelliteServices in src/data/services.js), each connected
 * to the center with a thin dotted line.
 *
 * "LIGHT TRAVELING OUTWARD, THEN LOCKING IN" EFFECT:
 * On scroll-into-view, each dotted connector line PROGRESSIVELY
 * fills in from the center outward (using Motion's `pathLength`
 * animation on the SVG line itself, so the dashed stroke visibly
 * "grows" toward the satellite instead of just being static). A
 * bright glowing pulse rides at the very tip of that growing line,
 * like the leading edge of a beam of light. The instant the line
 * finishes filling and the pulse arrives at a satellite, that
 * satellite's icon and box PERMANENTLY switch into a lit gradient
 * state (solid gradient box, white icon) — it does not fade back
 * out. The label text underneath stays in its normal neutral color
 * throughout (it never turns red), so only the icon box itself
 * communicates the "lit up" state. The LINE itself, however, slowly
 * eases back down to a faint, resting dotted line right after the
 * light passes through it (only the destination node stays
 * permanently lit, not the connector line). Each line/node is
 * staggered slightly so the light visibly radiates outward one
 * spoke after another.
 *
 * HOW THE LAYOUT WORKS:
 * We use a fixed coordinate system (a 400x300 "canvas") for both
 * the SVG connector lines AND the positioning of each icon node
 * (converted to percentages). Because everything is percentage-based
 * relative to the container, this whole diagram scales proportionally
 * on any screen size — the container itself is set to keep a 4:3
 * aspect ratio via Tailwind's aspect-[4/3] utility.
 * ================================================================
 */
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Container from "../layout/Container";
import SectionLabel from "../shared/SectionLabel";
import IconBox from "../ui/IconBox";
import { centerService, orbitSatelliteServices } from "../../data/services";
import { getServiceLinkPath } from "../../constants/routes";
import { Link } from "react-router-dom";

// Fixed coordinate system used for both the SVG lines and node
// positions below (canvas size: 400 wide x 300 tall).
const CANVAS = { width: 400, height: 300 };
const CENTER_POINT = { x: 200, y: 150 };

// Position of each of the 5 satellite nodes around the center,
// arranged to match the design's layout (2 nodes top, 2 nodes
// bottom-corners, 1 node bottom-center).
const satellitePositions = [
  { x: 80, y: 60 }, // Tires (top-left)
  { x: 320, y: 60 }, // Brake Service (top-right)
  { x: 80, y: 240 }, // Oil Change (bottom-left)
  { x: 320, y: 240 }, // AC Repair (bottom-right)
  { x: 200, y: 260 }, // Electrical (bottom-center)
];

// Converts a canvas coordinate into a CSS percentage position.
const toPercent = (point) => ({
  left: `${(point.x / CANVAS.width) * 100}%`,
  top: `${(point.y / CANVAS.height) * 100}%`,
});

// Timing for the "light travels out, then locks in" sequence.
const FILL_DURATION = 1.1; // seconds for one line to draw fully
const STAGGER = 0.22; // seconds between each spoke starting

export default function ServicesOrbitDiagram() {
  const canvasRef = useRef(null);
  const isInView = useInView(canvasRef, { once: true, amount: 0.5 });

  // Tracks which satellites have been permanently "lit" once the
  // traveling light has reached them.
  const [litUp, setLitUp] = useState(() =>
    orbitSatelliteServices.map(() => false),
  );

  useEffect(() => {
    if (!isInView) return;
    const timers = orbitSatelliteServices.map((_, i) => {
      const arrivalMs = (STAGGER * i + FILL_DURATION) * 1000;
      return setTimeout(() => {
        setLitUp((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, arrivalMs);
    });
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section className="relative py-4 lg:py-5">
      <Container>
        <SectionLabel className="mb-1 mt-3">Our Services</SectionLabel>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-center mb-1">
          {centerService.title.split(" ")[0].toUpperCase()}
        </h2>
        <p className="font-label text-xs uppercase tracking-wider text-neutral text-center mb-2">
          {centerService.title}
        </p>

        {/* Diagram canvas — relative container that keeps a 4:3 ratio
            so all percentage-based positions stay accurate at any size */}
        <div
          ref={canvasRef}
          className="relative mx-auto aspect-4/3 w-full max-w-2xl"
        >
          {/* Soft ambient backdrop glow for a more premium, "lit room"
              feel behind the whole diagram. */}
          <div
            aria-hidden="true"
            className="orbit-backdrop-glow pointer-events-none absolute inset-0 -z-10"
          />

          {/* ---------------- CONNECTOR LINES (SVG) ---------------- */}
          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
            preserveAspectRatio="none"
          >
            <defs>
              {satellitePositions.map((point, i) => (
                <linearGradient
                  key={i}
                  id={`orbit-line-gradient-${i}`}
                  gradientUnits="userSpaceOnUse"
                  x1={CENTER_POINT.x}
                  y1={CENTER_POINT.y}
                  x2={point.x}
                  y2={point.y}
                >
                  {/* Solid, bright red at the center end -- this is
                      the "light source" the glowing center node is
                      emitting from. */}
                  <stop
                    offset="0%"
                    stopColor="var(--color-primary-light)"
                    stopOpacity="0.95"
                  />
                  <stop
                    offset="45%"
                    stopColor="var(--color-primary)"
                    stopOpacity="0.65"
                  />
                  {/* Still lands on a visible red glow at the
                      satellite end (rather than fading to grey) so
                      the fully-drawn line reads as "energized" all
                      the way to the lit-up node. */}
                  <stop
                    offset="100%"
                    stopColor="var(--color-primary)"
                    stopOpacity="0.45"
                  />
                </linearGradient>
              ))}
            </defs>

            {/* Faint static track behind each line, so the un-filled
                portion of the path is still subtly visible before the
                light reaches it. */}
            {satellitePositions.map((point, i) => (
              <line
                key={`track-${i}`}
                x1={CENTER_POINT.x}
                y1={CENTER_POINT.y}
                x2={point.x}
                y2={point.y}
                stroke="var(--color-tertiary)"
                strokeOpacity="0.18"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
            ))}

            {/* The animated "light fill" line: pathLength grows from
                0 -> 1 on scroll-into-view, so the dashed, gradient
                stroke visibly travels from the center out to each
                satellite, fully bright while the light is traveling.
                Once it finishes drawing, it stays fully drawn (the
                dotted line shape never disappears) but its opacity
                slowly eases back down to a faint, resting dotted
                line -- only the destination node (icon/box) stays
                permanently lit, not the line itself. */}
            {satellitePositions.map((point, i) => (
              <motion.line
                key={i}
                x1={CENTER_POINT.x}
                y1={CENTER_POINT.y}
                x2={point.x}
                y2={point.y}
                stroke={`url(#orbit-line-gradient-${i})`}
                strokeWidth="1.75"
                strokeDasharray="4 4"
                strokeLinecap="round"
                className="orbit-line-glow"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={
                  isInView
                    ? { pathLength: 1, opacity: 0.3 }
                    : { pathLength: 0, opacity: 1 }
                }
                transition={{
                  pathLength: {
                    duration: FILL_DURATION,
                    delay: i * STAGGER,
                    ease: "easeInOut",
                  },
                  opacity: {
                    duration: 1.4,
                    delay: i * STAGGER + FILL_DURATION,
                    ease: "easeInOut",
                  },
                }}
              />
            ))}

            {/* Bright glowing pulse riding the leading edge of each
                line as it fills -- the "light" that arrives and
                triggers the satellite lighting up permanently. */}
            {satellitePositions.map((point, i) => (
              <motion.circle
                key={`pulse-${i}`}
                r="4"
                fill="var(--color-primary-light)"
                initial={{ cx: CENTER_POINT.x, cy: CENTER_POINT.y, opacity: 0 }}
                animate={
                  isInView
                    ? {
                        cx: [CENTER_POINT.x, point.x],
                        cy: [CENTER_POINT.y, point.y],
                        opacity: [0, 1, 1, 0],
                      }
                    : { opacity: 0 }
                }
                transition={{
                  duration: FILL_DURATION,
                  delay: i * STAGGER,
                  ease: "easeInOut",
                  times: [0, 0.08, 0.92, 1],
                }}
                className="orbit-pulse-glow"
              />
            ))}
          </svg>

          {/* ---------------- CENTER NODE: Engine Diagnostics ---------------- */}
          <Link
            to={getServiceLinkPath(centerService.slug)}
            style={toPercent(CENTER_POINT)}
            className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
          >
            <div className="relative flex items-center justify-center">
              {/* Continuously breathing outer glow ring behind the
                  center node, reinforcing it as the diagram's "light
                  source" even before you notice the lines/pulses. */}
              <motion.span
                aria-hidden="true"
                animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.25, 1] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-2xl bg-primary/40 blur-xl"
              />
              <motion.div whileHover={{ scale: 1.1 }} className="relative">
                <IconBox
                  icon={centerService.icon}
                  variant="gradient"
                  size="lg"
                />
              </motion.div>
            </div>
          </Link>

          {/* ---------------- SATELLITE NODES ---------------- */}
          {orbitSatelliteServices.map((service, i) => (
            <Link
              key={service.slug}
              to={getServiceLinkPath(service.slug)}
              style={toPercent(satellitePositions[i])}
              className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
            >
              <div className="relative flex items-center justify-center">
                {/* Glow that ramps up once the traveling light
                    arrives, then settles into a steady permanent
                    halo behind the now-lit icon box. */}
                <motion.span
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    litUp[i]
                      ? { opacity: 0.55, scale: 1.3 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 rounded-xl bg-primary blur-md"
                />
                <motion.div
                  initial={{ scale: 0.92 }}
                  animate={litUp[i] ? { scale: 1 } : { scale: 0.92 }}
                  whileHover={{ scale: 1.12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative"
                >
                  <IconBox
                    icon={service.icon}
                    variant={litUp[i] ? "gradient" : "outline"}
                    size="sm"
                    className="transition-[background,box-shadow,border-color] duration-500 ease-out group-hover:shadow-[0_0_18px_-4px_var(--color-primary)]"
                  />
                </motion.div>
              </div>
              {/* Label text stays in its normal (neutral) color at
                  all times -- it never turns red/gradient, even once
                  the icon box above it is permanently lit. Only a
                  gentle hover color-shift remains, same as before. */}
              <span className="whitespace-nowrap font-label text-[9px] uppercase tracking-wider text-neutral transition-colors group-hover:text-primary sm:text-[10px]">
                {service.title}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
