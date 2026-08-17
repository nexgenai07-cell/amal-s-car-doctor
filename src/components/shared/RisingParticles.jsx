/**
 * ================================================================
 * RisingParticles.jsx
 * ================================================================
 * A field of small glowing red motes that continuously drift
 * upward from the bottom of the section to the top, gently swaying
 * side to side as they climb, then fading out and looping forever.
 * Used as an ambient background layer behind the first ("hero")
 * section of the Services, About Us, and Gallery pages, sitting
 * behind the text content to add movement/depth without ever
 * distracting from it.
 *
 * (Note: this is an ORIGINAL recreation of the "Rising Particles"
 * visual idea referenced from reactbits.dev Pro. Their actual
 * component source code sits behind their paid registry and was
 * not available to copy from, so this version is built from
 * scratch for this project -- using this brand's red color tokens,
 * plain CSS keyframe animations (see the "RISING PARTICLES"
 * section in src/index.css), and no extra dependencies.)
 *
 * WHY EACH PARTICLE IS RANDOMISED IN JAVASCRIPT:
 * Every particle needs its own starting X position, size, sideways
 * drift distance, animation speed, and start delay so the field
 * reads as organic/natural rather than a repeating grid. Those
 * per-particle numbers are only knowable at render time (they're
 * randomly generated), so -- exactly like the diagram node
 * positions in ServicesOrbitDiagram.jsx -- they are passed down as
 * inline styles / CSS custom properties on each dot. Every OTHER
 * visual detail (the glow color, the animation curve, the keyframe
 * steps themselves) is fixed and lives in index.css instead, never
 * inline.
 * ================================================================
 */
import { useMemo } from "react";

// Default number of particles rendered when no `count` prop is
// passed. Kept moderate (not hundreds) since these are real DOM
// nodes animated with CSS, not a canvas/WebGL particle system --
// this count comfortably keeps things smooth on low-end phones.
const DEFAULT_PARTICLE_COUNT = 36;

/**
 * Builds an array of randomised particle definitions. Wrapped in
 * useMemo by the component below so the random layout is only
 * generated ONCE per mount, not regenerated (and re-shuffled) on
 * every re-render.
 */
function generateParticles(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    // Horizontal starting position across the section, as a percent.
    startXPercent: Math.random() * 100,
    // Diameter of the glowing dot, in pixels.
    sizePx: 2 + Math.random() * 4,
    // How far the particle sways sideways (left/right) as it rises,
    // in pixels. Randomly signed so some drift left, some drift right.
    driftPx: (Math.random() - 0.5) * 70,
    // How many seconds one full rise-and-fade loop takes. Varied per
    // particle so they don't all move in visual lock-step.
    durationSeconds: 8 + Math.random() * 10,
    // Negative animation-delay so particles start the loop already
    // "mid-flight" instead of every single one beginning at the
    // bottom at the same time the page loads.
    negativeDelaySeconds: Math.random() * 18,
    // Peak opacity this particle reaches while rising (nearer/bigger
    // particles read as slightly brighter than smaller/further ones).
    peakOpacity: 0.35 + Math.random() * 0.5,
  }));
}

export default function RisingParticles({
  count = DEFAULT_PARTICLE_COUNT,
  className = "",
}) {
  const particles = useMemo(() => generateParticles(count), [count]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="rising-particle absolute bottom-0 rounded-full"
          style={{
            left: `${particle.startXPercent}%`,
            width: `${particle.sizePx}px`,
            height: `${particle.sizePx}px`,
            // Custom properties consumed by the .rising-particle
            // keyframes in index.css.
            "--particle-drift": `${particle.driftPx}px`,
            "--particle-opacity": particle.peakOpacity,
            animationDuration: `${particle.durationSeconds}s`,
            animationDelay: `-${particle.negativeDelaySeconds}s`,
          }}
        />
      ))}
      {/* Soft top/bottom fade so particles never appear to "cut off"
          with a hard edge at the section boundaries. */}
      <div className="absolute inset-0 bg-linear-to-b from-background/40 via-transparent to-background/40" />
    </div>
  );
}
