/**
 * ================================================================
 * CardSpread.jsx
 * ================================================================
 * A fanned "hand of cards" laid out along an invisible arc, that
 * spreads further open around whichever card is hovered, focused
 * (keyboard) or tapped (touch) -- modelled after the interaction
 * pattern of pro.reactbits.dev's "Card Spread" component
 * (pro.reactbits.dev/docs/components/card-spread).
 *
 * NOTE: like ClickStack.jsx elsewhere in src/components/ui/, this
 * is an ORIGINAL, from-scratch recreation of that reference
 * component's public behaviour and prop surface (documented openly
 * on their docs page) -- the reference component's own source code
 * sits behind their paid Pro registry and was never seen or copied.
 * Every line of logic and every animation below was written
 * independently for this project.
 *
 * WHAT MAKES THIS DIFFERENT FROM A STATIC "ROTATED GRID":
 * Every card starts from the exact same invisible pivot point far
 * below the visible cards (`radius` pixels down) and is rotated out
 * to its resting angle along `arc` degrees, like the ribs of a hand
 * fan or the hands of a clock all sharing one centre. Hovering a
 * card slides it further out from that same pivot (`lift`) and
 * nudges its nearest neighbours a few degrees further apart
 * (`push` / `pushReach`) so the hovered card gets breathing room
 * instead of overlapping its neighbours -- exactly the reference
 * component's signature interaction.
 *
 * THIS COMPONENT IS DELIBERATELY THEME-AGNOSTIC:
 * It only understands geometry (angles, radii, pixels) and motion
 * (springs, opacity, stagger) -- it never touches brand colors,
 * fonts or copy. All of that visual identity is supplied by the
 * PARENT through `renderCard`, exactly like ClickStack.jsx is fed
 * fully-styled cards by WhyChooseUs.jsx. This keeps CardSpread
 * reusable anywhere else on the site a fanned deck is needed.
 *
 * WHY A HAND-WRITTEN TRANSFORM STRING INSTEAD OF MOTION'S
 * BUILT-IN x / y / rotate PROPS:
 * Motion (and Framer Motion before it) composes its own x/y/rotate
 * shorthand props as `translate() scale() rotate()`, which rotates
 * a card FIRST and then nudges it by a fixed on-screen offset --
 * that is NOT a fan. A true fan needs the opposite order: push the
 * card outward along its OWN axis first, THEN rotate that pushed
 * position around the shared pivot (the classic "clock hand"
 * trick). The only reliable way to guarantee that exact order is
 * to build the `rotate() translateY()` string ourselves and hand it
 * to Motion as a plain, hand-driven `style.transform` binding.
 * ================================================================
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { cn } from "../../utils/cn";

/**
 * A single fanned card: purely responsible for its own geometry
 * (resting angle, push-away angle, lift distance) and for reporting
 * pointer/focus/tap interaction back up to the parent CardSpread,
 * which owns the single source of truth for "which card is active".
 */
function SpreadCard({
  index, // this card's position in the deck, left to right (0-based)
  total, // how many cards are in the whole deck (needed for angle math)
  arc, // total angle in degrees the whole deck fans across
  radius, // resting distance (px) from the shared pivot to every card
  cardWidth, // fixed pixel width of every card's frame
  cardHeight, // fixed pixel height of every card's frame
  cardRadius, // corner rounding (px) applied to every card's frame
  pivotOffset, // how far below the stage's own bottom edge the shared pivot sits
  shadow, // 0..1 drop-shadow strength under every card
  lift, // how far (px) the ACTIVE card slides further out on hover
  push, // how many degrees the nearest neighbour is nudged aside
  pushReach, // how many neighbours on each side react to the hover at all
  restOpacity, // opacity applied to every card that ISN'T the active one
  stiffness, // spring stiffness shared by every animated value below
  damping, // spring damping shared by every animated value below
  mass, // spring mass shared by every animated value below
  stagger, // seconds between each card's one-time mount fade-in
  interactive, // false disables all pointer/keyboard/tap reactions
  activeIndex, // index of whichever card is currently hovered/focused/tapped, or null
  onEnter, // (index) => void -- parent callback: this card became active
  onLeave, // (index) => void -- parent callback: this card is no longer active
  onToggle, // (index) => void -- parent callback: touch/click toggle
  ariaLabel, // accessible name announced for this card
  children, // the parent-supplied, fully-styled visual content ("face") of the card
}) {
  // This card's angle at rest, evenly distributed across the arc so
  // the whole deck reads as one continuous, symmetrical fan. A
  // single-card deck just sits dead centre (angle 0) since there's
  // nothing to spread it across.
  const restAngle = total > 1 ? -arc / 2 + (arc * index) / (total - 1) : 0;

  const isActive = activeIndex === index;

  // If some OTHER card is active and this one is within `pushReach`
  // steps of it, nudge this card's angle a little further away from
  // the active card so the active card has visible room to lift out
  // without overlapping its neighbours. The nudge fades out the
  // further away this card is from the active one (linear falloff).
  let pushDeg = 0;
  if (activeIndex !== null && !isActive) {
    const distance = Math.abs(index - activeIndex);
    if (distance <= pushReach) {
      const direction = index < activeIndex ? -1 : 1; // which way to push
      const falloff = 1 - (distance - 1) / pushReach; // 1 = adjacent, shrinking outward
      pushDeg = direction * push * falloff;
    }
  }

  // Final target angle/distance/opacity this card should spring
  // towards right now, given the current hover/focus/tap state.
  const targetAngle = restAngle + pushDeg;
  const targetDistance = isActive ? radius + lift : radius;
  const targetOpacity = activeIndex === null ? 1 : isActive ? 1 : restOpacity;

  // Three independent springs (angle / distance / opacity) so each
  // one can settle at its own natural pace using the shared
  // stiffness/damping/mass "feel" -- this is what gives the fan its
  // soft, slightly bouncy, physical quality instead of a robotic
  // linear tween.
  const angleSpring = useSpring(targetAngle, { stiffness, damping, mass });
  const distanceSpring = useSpring(targetDistance, {
    stiffness,
    damping,
    mass,
  });
  const opacitySpring = useSpring(targetOpacity, {
    stiffness,
    damping,
    mass,
  });

  // Whenever the computed targets change (because activeIndex
  // changed), re-point each spring at its new destination -- the
  // spring itself handles the smooth chase from wherever it
  // currently is, so rapid hover changes never "snap" or restart.
  useEffect(() => {
    angleSpring.set(targetAngle);
  }, [targetAngle, angleSpring]);
  useEffect(() => {
    distanceSpring.set(targetDistance);
  }, [targetDistance, distanceSpring]);
  useEffect(() => {
    opacitySpring.set(targetOpacity);
  }, [targetOpacity, opacitySpring]);

  // Combine the angle and distance springs into ONE live CSS
  // transform string every frame. `rotate()` is written first and
  // `translateY()` second on purpose -- see the file header comment
  // for why that exact order is what produces a true radial fan.
  const transform = useTransform(
    [angleSpring, distanceSpring],
    ([angle, distance]) => `rotate(${angle}deg) translateY(${-distance}px)`,
  );

  // Soft, neutral (non-brand) drop shadow under every card, scaled
  // by the `shadow` prop -- kept intentionally colour-neutral here
  // since this file never touches brand tokens; any brand-coloured
  // glow lives on the caller-supplied `children` content instead.
  const boxShadow = useMemo(() => {
    if (shadow <= 0) return "none";
    const blur = Math.round(30 + shadow * 40);
    const spread = Math.round(18 + shadow * 20);
    const alpha = Math.min(0.7, shadow * 1.6);
    return `0 ${spread}px ${blur}px -14px rgba(0, 0, 0, ${alpha})`;
  }, [shadow]);

  // Cards nearer the centre of the fan sit slightly above their
  // outer neighbours at rest (a natural "hand of cards" stacking
  // order), and whichever card is active always jumps to the very
  // top so its lifted, larger state never gets clipped underneath
  // an untouched neighbour.
  const centreDistance = Math.abs(index - (total - 1) / 2);
  const zIndex = isActive ? total + 10 : Math.round(total - centreDistance);

  return (
    <motion.div
      // Every card starts from the SAME horizontal centre and the
      // SAME distance below the stage (the shared pivot) -- only
      // the live `transform` above differs card to card, which is
      // exactly what makes this a fan rather than a static grid.
      style={{
        position: "absolute",
        left: `calc(50% - ${cardWidth / 2}px)`,
        bottom: -pivotOffset,
        width: cardWidth,
        height: cardHeight,
        borderRadius: cardRadius,
        overflow: "hidden",
        transformOrigin: "50% 100%", // rotate around each card's own bottom-centre (the pivot)
        boxShadow,
        zIndex,
        transform, // the live rotate()+translateY() MotionValue string from above
        opacity: opacitySpring, // the live, spring-animated rest/active opacity
        cursor: interactive ? "pointer" : "default",
        willChange: "transform, opacity", // hints the browser to keep this on the GPU compositor
      }}
      tabIndex={interactive ? 0 : -1}
      role="group"
      aria-label={ariaLabel}
      // Mouse hover.
      onMouseEnter={interactive ? () => onEnter(index) : undefined}
      onMouseLeave={interactive ? () => onLeave(index) : undefined}
      // Keyboard users tabbing through the deck get the same reveal.
      onFocus={interactive ? () => onEnter(index) : undefined}
      onBlur={interactive ? () => onLeave(index) : undefined}
      // Touch devices don't fire hover at all, so a tap explicitly
      // toggles this card active/inactive instead.
      onClick={interactive ? () => onToggle(index) : undefined}
    >
      {/* Inner wrapper handles ONLY the one-time "deck is dealt out"
          mount animation (fade + gentle scale-up, staggered card by
          card). Keeping it on a SEPARATE element from the outer div
          above means it can freely use Motion's normal declarative
          `initial`/`whileInView` props without ever fighting over
          the same `transform`/`opacity` style the outer div already
          owns for the live hover-driven springs. */}
      <motion.div
        className="h-full w-full"
        initial={{ opacity: 0, scale: 0.82 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          duration: 0.55,
          delay: index * stagger,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * @param {Array<{id?: string|number}>} cards - the data for every card in the deck
 * @param {(card: object, meta: {index:number, isActive:boolean, total:number}) => React.ReactNode} renderCard
 *   - render prop that returns the fully-styled visual "face" for one card. Receives
 *     whether THIS card is currently the active (hovered/focused/tapped) one, so the
 *     caller can reveal extra detail on the active card if it wants to.
 * @param {number} [cardWidth=168] - width of a single card, in pixels
 * @param {number} [cardHeight=252] - height of a single card, in pixels
 * @param {number} [cardRadius=12] - corner radius of a card, in pixels
 * @param {number} [radius=440] - distance (px) from the shared pivot to every resting card
 * @param {number} [arc=88] - total angle (degrees) the fan covers
 * @param {number} [shadow=0.28] - drop shadow strength, 0 removes it
 * @param {number} [lift=26] - how far (px) the active card slides outward on hover
 * @param {number} [push=3.6] - degrees the nearest neighbour is pushed aside on hover
 * @param {number} [pushReach=3] - how many neighbours on each side react to a hover
 * @param {number} [restOpacity=1] - opacity applied to the cards that are NOT active
 * @param {number} [stiffness=150] - spring stiffness of every animated value
 * @param {number} [damping=16] - spring damping of every animated value
 * @param {number} [mass=1] - spring mass of every animated value
 * @param {number} [stagger=0.06] - seconds between each card fading in on mount
 * @param {boolean} [fit=true] - scale the whole fan down so it always fits its container
 * @param {number} [maxScale=1] - upper bound applied to the automatic fit scale
 * @param {boolean} [interactive=true] - enable pointer/keyboard/tap interaction
 * @param {string} [className] - extra classes merged onto the outer, responsive wrapper
 * @param {object} [style] - extra inline styles merged onto the outer, responsive wrapper
 */
export default function CardSpread({
  cards,
  renderCard,
  cardWidth = 168,
  cardHeight = 252,
  cardRadius = 12,
  radius = 440,
  arc = 88,
  shadow = 0.28,
  lift = 26,
  push = 3.6,
  pushReach = 3,
  restOpacity = 1,
  stiffness = 150,
  damping = 16,
  mass = 1,
  stagger = 0.06,
  fit = true,
  maxScale = 1,
  interactive = true,
  className = "",
  style = {},
}) {
  const total = cards.length;

  // `activeIndex` is the ONE piece of state the whole fan revolves
  // around -- null means "nothing hovered/focused/tapped", any
  // other value is the index of the card currently spread open.
  // Owning this here (rather than per-card) is what lets every
  // OTHER card react (push away / dim) to whichever one is active.
  const [activeIndex, setActiveIndex] = useState(null);

  const handleEnter = (index) => setActiveIndex(index);
  const handleLeave = (index) =>
    setActiveIndex((current) => (current === index ? null : current));
  const handleToggle = (index) =>
    setActiveIndex((current) => (current === index ? null : index));

  // ---- GEOMETRY, computed once per prop change (see the file
  // header for the full derivation) ----
  const halfArcRad = useMemo(() => (arc / 2) * (Math.PI / 180), [arc]);

  // How much extra vertical space the CURVE of the fan eats into,
  // beyond a plain straight-up `radius` -- edge cards sit lower
  // than the centre card because they're rotated away from vertical.
  const arcRise = useMemo(
    () => radius * (1 - Math.cos(halfArcRad)),
    [radius, halfArcRad],
  );

  // How far below the stage's own bottom edge the shared pivot
  // point sits, derived so that the CENTRE card's anchor lands
  // exactly `arcRise` px above the stage's bottom edge, and the two
  // EDGE cards' anchors land exactly at the stage's bottom edge --
  // i.e. every card, at every angle, stays inside the stage box.
  const pivotOffset = useMemo(() => radius - arcRise, [radius, arcRise]);

  // Total pixel height the stage needs to contain every card at
  // rest AND the active card lifted further out, plus a small
  // breathing-room buffer.
  const stageHeight = useMemo(
    () => arcRise + cardHeight + lift + 24,
    [arcRise, cardHeight, lift],
  );

  // Total pixel width from the leftmost card's outer edge to the
  // rightmost card's outer edge -- this is what `fit` scales down
  // to match whatever width the parent page actually has available.
  const naturalWidth = useMemo(
    () => 2 * radius * Math.sin(halfArcRad) + cardWidth,
    [radius, halfArcRad, cardWidth],
  );

  // ---- RESPONSIVE "FIT" SCALING ----
  // The stage itself is always laid out at its fixed, natural pixel
  // size above; this outer, page-width viewport is measured live
  // and the whole stage is scaled down (never up past `maxScale`)
  // to match -- this is what makes the fan genuinely responsive
  // down to small phone screens without changing the fan's geometry
  // math at all, only its final on-screen size.
  const viewportRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const viewportEl = viewportRef.current;
    if (!viewportEl || !fit) {
      setScale(1);
      return undefined;
    }
    const recomputeScale = () => {
      const availableWidth = viewportEl.offsetWidth;
      const nextScale =
        availableWidth > 0
          ? Math.min(maxScale, availableWidth / naturalWidth)
          : 1;
      setScale(nextScale);
    };
    recomputeScale();
    // ResizeObserver re-runs this any time the container's width
    // changes -- window resize, orientation change, or the sidebar
    // layout reflowing -- so the fan never has to be manually
    // re-measured by the parent page.
    const observer = new ResizeObserver(recomputeScale);
    observer.observe(viewportEl);
    return () => observer.disconnect();
  }, [fit, maxScale, naturalWidth]);

  return (
    // Outer viewport: a plain, page-responsive block that reserves
    // exactly the right amount of vertical space for the SCALED
    // stage, so the rest of the page never overlaps or leaves an
    // awkward gap under the fan.
    <div
      ref={viewportRef}
      className={cn("relative w-full", className)}
      style={{ height: stageHeight * scale, ...style }}
    >
      {/* Stage: the fan's true, fixed-pixel geometry lives here,
          centred horizontally and scaled down to fit the viewport
          above via a single CSS transform. */}
      <div
        className="absolute left-1/2 top-0"
        style={{
          width: naturalWidth,
          height: stageHeight,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {cards.map((card, index) => (
          <SpreadCard
            key={card.id ?? index}
            index={index}
            total={total}
            arc={arc}
            radius={radius}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            cardRadius={cardRadius}
            pivotOffset={pivotOffset}
            shadow={shadow}
            lift={lift}
            push={push}
            pushReach={pushReach}
            restOpacity={restOpacity}
            stiffness={stiffness}
            damping={damping}
            mass={mass}
            stagger={stagger}
            interactive={interactive}
            activeIndex={activeIndex}
            onEnter={handleEnter}
            onLeave={handleLeave}
            onToggle={handleToggle}
            ariaLabel={card.ariaLabel}
          >
            {renderCard(card, {
              index,
              isActive: activeIndex === index,
              total,
            })}
          </SpreadCard>
        ))}
      </div>
    </div>
  );
}
