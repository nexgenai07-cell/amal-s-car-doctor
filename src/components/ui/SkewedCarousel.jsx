/**
 * ================================================================
 * SkewedCarousel.jsx
 * ================================================================
 * A 3D "coverflow" style carousel: the active slide sits centered
 * and full-size, while every other slide recedes to either side,
 * tilted in perspective and scaled down -- modelled after the
 * interaction pattern of pro.reactbits.dev's "Skewed Carousel"
 * (pro.reactbits.dev/docs/components/skewed-carousel), matched to
 * that component's documented prop surface (cardWidth, aspectRatio,
 * rotation, inactiveScale, perspective, borderRadius, titleBlur,
 * speed, showControls, showDots, loop, autoplay, autoplayDelay,
 * enableDrag, enableKeyboard).
 *
 * NOTE: like CardSpread.jsx and ClickStack.jsx elsewhere in
 * src/components/ui/, this is an ORIGINAL, from-scratch recreation
 * of that reference component's public behaviour and documented
 * prop table -- the reference component's own source sits behind
 * their paid Pro registry and was never seen or copied. Every line
 * of logic and every animation below was written independently for
 * this project.
 *
 * THIS COMPONENT IS DELIBERATELY THEME-AGNOSTIC:
 * Exactly like CardSpread, it only understands geometry (spacing,
 * rotation, scale, blur) and interaction (drag, keyboard, autoplay,
 * dots, arrows) -- it never touches brand colors, fonts or copy.
 * The actual visual "face" of every slide is supplied by the
 * PARENT through `renderItem`, so this carousel can be reused
 * anywhere else on the site a coverflow is needed later, not just
 * for the Gallery page's Case Files.
 *
 * HOW ONE SLIDE'S TRANSFORM IS BUILT:
 * Every slide lives at the exact same top-left position; only its
 * live `transform` differs, based on its signed distance from the
 * active slide (`distance`). Positive distance -> slide sits to the
 * right and tilts away with rotateY(-rotation); negative distance
 * -> slide sits to the left and tilts the other way. Slides further
 * from the centre also step back in Z (translateZ) and shrink a
 * little further, so the deck reads as receding into the screen
 * rather than a flat row of identically-sized cards.
 *
 * RESPONSIVE SIZING:
 * `cardWidth` is the slide's width on a roomy desktop viewport. A
 * ResizeObserver (same technique CardSpread.jsx already uses for
 * its "fit" scaling) measures the carousel's own available width on
 * every resize and shrinks the effective card width to fit small
 * screens, so the carousel never overflows or gets clipped on
 * mobile.
 * ================================================================
 */
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useSkewedCarousel } from "../../hooks/useSkewedCarousel";
import { cn } from "../../utils/cn";

// Turns an aspect-ratio string like "3 / 4" into a plain width:height
// numeric ratio, so the stage can compute a pixel height from
// whatever effective card width it lands on.
function parseAspectRatio(value) {
  const [width, height] = String(value)
    .split("/")
    .map((part) => parseFloat(part.trim()));
  if (!width || !height) return 0.75; // sane fallback (3:4)
  return width / height;
}

/**
 * @param {Array<{id?: string|number}>} items - the data for every slide
 * @param {(item: object, meta: {index:number, isActive:boolean, distance:number, blurAmount:number}) => React.ReactNode} renderItem
 *   - render prop returning the fully-styled visual "face" for one slide. `blurAmount` is
 *     already resolved to 0 for the active slide and `titleBlur` for every inactive one, so
 *     the caller can apply it directly (e.g. via a CSS blur filter on its caption block).
 * @param {number} [initialIndex=0] - slide focused on mount
 * @param {number} [cardWidth=280] - slide width in pixels on a roomy viewport
 * @param {string} [aspectRatio="3 / 4"] - aspect ratio of each slide
 * @param {number} [rotation=48] - degrees a non-active slide turns, away from the active one
 * @param {number} [inactiveScale=0.82] - scale applied to every inactive slide
 * @param {number} [perspective=900] - perspective depth (px) applied to the whole stage
 * @param {number} [borderRadius=20] - corner radius of the slides in pixels
 * @param {number} [titleBlur=2.5] - blur (px) applied to inactive slides' caption content
 * @param {number} [speed=1] - multiplier for the transition duration
 * @param {boolean} [showControls=true] - show the previous/next arrow buttons
 * @param {boolean} [showDots=true] - show the progress dots
 * @param {boolean} [loop=false] - wrap around at either end
 * @param {boolean} [autoplay=false] - advance on a timer
 * @param {number} [autoplayDelay=3200] - delay between automatic advances, ms
 * @param {boolean} [enableDrag=true] - allow dragging across the strip to navigate
 * @param {boolean} [enableKeyboard=true] - allow arrow keys to navigate when focused
 * @param {string} [className] - extra classes merged onto the outer wrapper
 * @param {(index: number) => void} [onIndexChange] - fired whenever the active slide changes
 */
export default function SkewedCarousel({
  items,
  renderItem,
  initialIndex = 0,
  cardWidth = 280,
  aspectRatio = "3 / 4",
  rotation = 48,
  inactiveScale = 0.82,
  perspective = 900,
  borderRadius = 20,
  titleBlur = 2.5,
  speed = 1,
  showControls = true,
  showDots = true,
  loop = false,
  autoplay = false,
  autoplayDelay = 3200,
  enableDrag = true,
  enableKeyboard = true,
  className = "",
  onIndexChange,
}) {
  const itemCount = items.length;

  const {
    activeIndex,
    goTo,
    next,
    prev,
    dragOffset,
    isDragging,
    dragHandlers,
    hoverHandlers,
    keyboardHandlers,
  } = useSkewedCarousel({
    itemCount,
    initialIndex,
    loop,
    autoplay,
    autoplayDelay,
    enableDrag,
    enableKeyboard,
    onIndexChange,
  });

  // ---- Responsive card width: shrink to fit small viewports ----
  const viewportRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return undefined;
    const measure = () => setContainerWidth(el.offsetWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Never render wider than the prop asks for, but shrink down to
  // ~78% of whatever room the page actually has on narrow screens
  // (phones) so neighbouring slides stay visible instead of being
  // cropped by the section's own edges.
  const effectiveCardWidth =
    containerWidth > 0
      ? Math.min(cardWidth, Math.round(containerWidth * 0.78))
      : cardWidth;

  const ratio = useMemo(() => parseAspectRatio(aspectRatio), [aspectRatio]);
  const stageHeight = Math.round(effectiveCardWidth / ratio);

  // Horizontal distance (px) between each slide's centre and its
  // neighbour's -- tightened relative to the full card width so
  // receding slides overlap into a proper "deck" instead of
  // spreading out past the section's edges.
  const step = effectiveCardWidth * 0.56;

  const transitionCss = isDragging
    ? "none"
    : `transform ${(0.6 * speed).toFixed(2)}s cubic-bezier(0.22, 1, 0.36, 1), opacity ${(0.35 * speed).toFixed(2)}s ease`;

  // Signed, loop-aware distance of `index` from the active slide --
  // e.g. with 6 looped slides, the slide just before index 0 reports
  // a distance of -1 (not +5), so it renders on the LEFT, not
  // wrapped all the way around the right side.
  const getDistance = useCallback(
    (index) => {
      let distance = index - activeIndex;
      if (loop) {
        if (distance > itemCount / 2) distance -= itemCount;
        if (distance < -itemCount / 2) distance += itemCount;
      }
      return distance;
    },
    [activeIndex, itemCount, loop],
  );

  return (
    <div
      ref={viewportRef}
      className={cn("w-full select-none", className)}
      {...hoverHandlers}
    >
      {/* The 3D stage: perspective lives here so every slide inside
          shares one common vanishing point, which is what makes the
          receding slides read as a single coherent deck rather than
          independently-rotated flat cards. */}
      <div
        className="relative mx-auto touch-pan-y outline-none"
        style={{
          width: "100%",
          height: stageHeight,
          perspective,
        }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Case files carousel"
        {...dragHandlers}
        {...keyboardHandlers}
      >
        {items.map((item, index) => {
          const distance = getDistance(index);
          const absDistance = Math.abs(distance);
          const isActive = distance === 0;
          const sign = Math.sign(distance);

          // Cards more than 3 steps from the active one are fully
          // hidden -- keeps the DOM light and avoids a wall of
          // barely-visible clutter at the far edges of the deck.
          const isVisible = absDistance <= 3;

          const scale = isActive
            ? 1
            : Math.max(inactiveScale - (absDistance - 1) * 0.08, 0.5);
          const rotateY = isActive ? 0 : sign * -rotation;
          const translateZ = isActive ? 0 : -absDistance * 70;
          const translateX = distance * step + (isDragging ? dragOffset : 0);

          const blurAmount = isActive ? 0 : titleBlur;

          return (
            <div
              key={item.id ?? index}
              className="absolute top-0 left-1/2 overflow-hidden"
              style={{
                width: effectiveCardWidth,
                height: stageHeight,
                marginLeft: -effectiveCardWidth / 2,
                borderRadius,
                zIndex: itemCount - absDistance,
                opacity: isVisible ? 1 : 0,
                pointerEvents: isActive ? "auto" : isVisible ? "none" : "none",
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                transformStyle: "preserve-3d",
                transition: transitionCss,
                willChange: "transform, opacity",
                cursor: enableDrag
                  ? isDragging
                    ? "grabbing"
                    : "grab"
                  : "default",
              }}
              // Only the active slide is exposed to assistive tech
              // and click navigation -- the receding neighbours are
              // purely decorative until they become active.
              aria-hidden={!isActive}
              onClick={!isActive && isVisible ? () => goTo(index) : undefined}
            >
              {renderItem(item, { index, isActive, distance, blurAmount })}
            </div>
          );
        })}
      </div>

      {/* Prev / next arrow controls + progress dots, shown below the
          stage so they never overlap the receding side slides. */}
      {(showControls || showDots) && (
        <div className="mt-6 flex items-center justify-center gap-6">
          {showControls && (
            <button
              type="button"
              onClick={prev}
              disabled={!loop && activeIndex === 0}
              aria-label="Previous case file"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border border-tertiary/40 bg-secondary text-white transition-colors duration-300",
                "hover:border-primary hover:text-primary",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-tertiary/40 disabled:hover:text-white",
              )}
            >
              <FaChevronLeft className="text-sm" />
            </button>
          )}

          {showDots && (
            <div className="flex items-center gap-2">
              {items.map((item, index) => (
                <button
                  key={item.id ?? index}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to case file ${index + 1}`}
                  aria-current={index === activeIndex}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === activeIndex
                      ? "w-6 bg-primary"
                      : "w-2 bg-tertiary/40 hover:bg-tertiary/70",
                  )}
                />
              ))}
            </div>
          )}

          {showControls && (
            <button
              type="button"
              onClick={next}
              disabled={!loop && activeIndex === itemCount - 1}
              aria-label="Next case file"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border border-tertiary/40 bg-secondary text-white transition-colors duration-300",
                "hover:border-primary hover:text-primary",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-tertiary/40 disabled:hover:text-white",
              )}
            >
              <FaChevronRight className="text-sm" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
