/**
 * ================================================================
 * BeforeAfterSlider.jsx
 * ================================================================
 * A draggable before/after image comparison slider. Two images are
 * stacked on top of each other; the "after" image is clipped with
 * a CSS clip-path based on the drag handle's position, revealing
 * more or less of it as the user drags left/right.
 *
 * REUSED IN:
 * - Service Detail page ("See the Difference") -- default props,
 *   no autoplay, standard 16:9 size.
 * - Gallery page ("Transformations") -- passes `autoPlay` and a
 *   shorter, more compact `containerClassName`.
 *
 * NOTE ON IMAGES: beforeImage/afterImage should be real photo URLs.
 * Since we don't have the actual workshop photos yet, this renders
 * a colored placeholder block with a label when no image URL is
 * provided, so the component still looks correct during development
 * and can be swapped with real images later without code changes.
 * ================================================================
 */
import { FaArrowsLeftRight } from "react-icons/fa6";
import { useBeforeAfterSlider } from "../../hooks/useBeforeAfterSlider";

/**
 * @param {string} [beforeImage] - URL of the "before" image
 * @param {string} [afterImage] - URL of the "after" image
 * @param {string} [caption] - optional caption shown below the slider
 * @param {boolean} [autoPlay] - if true, the divider gently sweeps
 *   back and forth on its own until the visitor drags it themselves
 *   (see useBeforeAfterSlider.js for exactly how this behaves)
 * @param {string} [containerClassName] - Tailwind sizing classes for
 *   the image container. Defaults to a standard 16:9 box; pass a
 *   fixed responsive height instead (e.g. "h-[240px] sm:h-[300px]")
 *   for a more compact result on a specific page.
 */
export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  caption,
  autoPlay = false,
  containerClassName = "aspect-video",
}) {
  const {
    containerRef,
    sliderPosition,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleTouchMove,
  } = useBeforeAfterSlider({ autoPlay });

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className={`relative w-full ${containerClassName} rounded-xl overflow-hidden select-none border border-tertiary/20`}
      >
        {/* ---------------- BEFORE IMAGE (full width, base layer) ---------------- */}
        <div className="absolute inset-0 bg-secondary flex items-center justify-center">
          {beforeImage ? (
            <img
              src={beforeImage}
              alt="Before"
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <span className="font-label text-xs text-neutral uppercase tracking-wider">
              Before Image
            </span>
          )}
          <span className="absolute top-4 left-4 font-label text-[10px] uppercase tracking-wider bg-background/70 px-3 py-1 rounded-full">
            Before
          </span>
        </div>

        {/* ---------------- AFTER IMAGE (clipped based on slider position) ---------------- */}
        <div
          className="absolute inset-0 bg-secondary-light flex items-center justify-center overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
        >
          {afterImage ? (
            <img
              src={afterImage}
              alt="After"
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <span className="font-label text-xs text-neutral uppercase tracking-wider">
              After Image
            </span>
          )}
          <span className="absolute top-4 right-4 font-label text-[10px] uppercase tracking-wider bg-primary px-3 py-1 rounded-full">
            After
          </span>
        </div>

        {/* ---------------- DRAG HANDLE (red vertical line + circle) ---------------- */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <FaArrowsLeftRight className="text-white text-sm" />
          </span>
        </div>
      </div>

      {caption && (
        <p className="text-center text-neutral text-xs mt-3 font-body">
          {caption}
        </p>
      )}
    </div>
  );
}
