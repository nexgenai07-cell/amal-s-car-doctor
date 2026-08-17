/**
 * ================================================================
 * AnimatedBeamBackground.jsx
 * ================================================================
 * A dark backdrop made of thin diagonal divider lines, where a
 * handful of the lines carry a bright streak of light sliding down
 * them on a continuous loop -- like light traveling through a
 * fibre-optic grid. Used behind the "We Don't Cut Corners. We Find
 * Them." closing statement on the About Us page for a bold,
 * technical, high-end feel.
 *
 * (Note: this is an ORIGINAL recreation of the "Animated Beam"
 * background visual idea from the Animata component library.
 * Animata ships that component as a shadcn-style registry file
 * meant for Next.js/shadcn projects, not as an installable package,
 * so it was not available to copy from directly. This version is
 * rebuilt from scratch for this project -- using this brand's red
 * and near-black color tokens, this project's own plain CSS
 * keyframe convention (see the "ANIMATED BEAM GRID BACKGROUND"
 * section in src/index.css, which mirrors how `.rising-particle`
 * already works in that same file), and no extra dependencies.)
 *
 * WHY EACH BEAM IS RANDOMISED IN JAVASCRIPT:
 * Every lane that gets a beam needs its own animation speed, start
 * delay, streak length, and peak brightness so the grid reads as
 * organic rather than a mechanically repeating pattern -- exactly
 * the same reasoning already used for the dot field in
 * RisingParticles.jsx in this same folder. Those per-beam numbers
 * are only knowable at render time (they're randomly generated), so
 * they are passed down as inline CSS custom properties consumed by
 * the `.beam-streak` keyframes in src/index.css. Every OTHER visual
 * detail (the streak color, the glow, the timing curve) is fixed
 * and lives in that CSS file instead, never inline.
 *
 * WHY THE LANE COUNT IS FIXED RATHER THAN MEASURED:
 * Rendering a generous fixed number of fixed-width lanes and
 * letting the section's own `overflow-hidden` clip whatever doesn't
 * fit keeps this fully responsive on every screen size without ever
 * needing to measure the container with JavaScript or listen for
 * window resize events -- the row simply grows or shrinks with the
 * section automatically.
 * ================================================================ */
import { useMemo } from "react";

// Width of each diagonal lane, in pixels. Combined with LANE_COUNT
// below, this needs to comfortably cover the widest screens this
// site supports -- any extra lanes beyond the visible width are
// simply clipped by the section's overflow-hidden, so being
// generous here costs nothing visually.
const LANE_WIDTH_PX = 40;

// Enough lanes to cover very wide desktop monitors at the lane
// width above. Extra lanes on narrower screens are clipped, so the
// grid always looks intentional instead of running out partway
// across the section.
const LANE_COUNT = 48;

// Roughly this fraction of lanes get an animated streak riding
// them; the rest stay as plain, still, faint divider lines. Keeping
// most lanes streak-free is what makes the handful of moving beams
// stand out instead of the whole grid feeling busy.
const BEAM_LANE_CHANCE = 0.3;

// Within the lanes that DO get a streak, this fraction move quickly
// and brightly (like a real meteor); the remainder drift slowly.
const FAST_BEAM_CHANCE = 0.3;

/**
 * Builds the randomised per-lane definitions once per mount. Wrapped
 * in useMemo by the component below so the random layout doesn't
 * get regenerated (and visibly reshuffled) on every re-render.
 */
function generateLanes() {
  return Array.from({ length: LANE_COUNT }, (_, index) => {
    const hasBeam = Math.random() < BEAM_LANE_CHANCE;

    if (!hasBeam) {
      return { id: index, hasBeam: false };
    }

    const isFastBeam = Math.random() < FAST_BEAM_CHANCE;

    return {
      id: index,
      hasBeam: true,
      // Fast beams zip past quickly; slow beams take a long, lazy
      // drift down the line.
      durationSeconds: isFastBeam
        ? 1.4 + Math.random() * 2
        : 6 + Math.random() * 8,
      // Negative animation-delay so beams start already mid-loop
      // instead of every single one beginning at the same instant
      // the page loads.
      negativeDelaySeconds: Math.random() * 9,
      // Visible length of the light streak itself, in pixels.
      lengthPx: Math.round(28 + Math.random() * 64),
      // Peak opacity reached while the streak is fully visible --
      // fast beams read brighter, like real meteors.
      peakOpacity: isFastBeam
        ? 0.75 + Math.random() * 0.25
        : 0.35 + Math.random() * 0.5,
    };
  });
}

export default function AnimatedBeamBackground({ className = "" }) {
  const lanes = useMemo(() => generateLanes(), []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Soft red ambient glow sitting behind the entire line grid. */}
      <div className="beam-grid-backdrop-glow absolute inset-0" />

      {/* Row of fixed-width lanes, centered so the grid crops evenly
          on both edges rather than running off one side only.
          "beam-grid-mask" fades these lines out behind the middle
          of the section -- exactly where the heading text sits --
          so the grid frames the text instead of running directly
          behind the letters at full strength. */}
      <div className="beam-grid-mask relative flex h-full w-full flex-row justify-center">
        {lanes.map((lane) => (
          <div
            key={lane.id}
            className="flex h-full shrink-0 justify-center"
            style={{ width: `${LANE_WIDTH_PX}px` }}
          >
            {/* The faint diagonal divider line itself -- always
                rendered, whether or not this lane also carries a
                moving beam. */}
            <div className="relative h-full w-px rotate-12 bg-tertiary/15">
              {lane.hasBeam && (
                <div
                  className="beam-streak absolute left-1/2 top-0 -translate-x-1/2"
                  style={{
                    width: "3px",
                    "--beam-duration": `${lane.durationSeconds.toFixed(2)}s`,
                    "--beam-opacity": lane.peakOpacity.toFixed(2),
                    animationDelay: `-${lane.negativeDelaySeconds.toFixed(2)}s`,
                  }}
                >
                  <div
                    className="beam-streak-core w-full"
                    style={{ height: `${lane.lengthPx}px` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Blends the whole grid into the page background at the very
          top and bottom edges, so it never reads as a hard-edged
          box against the rest of the page. */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
    </div>
  );
}
