/**
 * ================================================================
 * useBeforeAfterSlider.js
 * ================================================================
 * Drag/interaction logic for the before-after image comparison
 * slider. Handles both mouse drag and touch drag, and calculates
 * the slider's horizontal position as a percentage (0-100) of the
 * container's width, which is used to clip the "after" image.
 *
 * OPTIONAL AUTOPLAY:
 * When `autoPlay` is true, the divider gently sweeps back and forth
 * on its own between `autoPlayMin` and `autoPlayMax` (as a percent
 * of the container's width) using a smooth sine-wave path, purely
 * to catch a visitor's eye and hint that the image is interactive
 * before they've noticed they can drag it themselves. The full
 * 0-100 manual drag range is never restricted -- autoplay only
 * controls the RESTING motion; a visitor can always drag the handle
 * anywhere across the whole image. The instant the visitor drags or
 * touches the handle, autoplay stops for good (it never fights the
 * visitor's own control by jumping back into motion later).
 * ================================================================ */
import { useState, useRef, useCallback, useEffect } from "react";

export function useBeforeAfterSlider({
  autoPlay = false,
  // Narrower sweep (was 32-68, a 36-point swing) so the divider
  // stays closer to the center and never travels too far to either
  // side.
  autoPlayMin = 42,
  autoPlayMax = 58,
  // Longer duration = a slower, more relaxed sweep (was 4200ms for
  // one full back-and-forth cycle).
  autoPlayDurationMs = 8000,
} = {}) {
  // sliderPosition = how far across the container the divider line
  // sits, as a percentage. 50 = exactly in the middle.
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Tracks whether the visitor has ever manually grabbed the handle.
  // A ref (not state) on purpose -- the autoplay animation loop below
  // reads this on every single frame, and a ref avoids re-running
  // that effect on every frame the way a state value would.
  const hasInteractedRef = useRef(false);
  const animationFrameRef = useRef(null);

  // Calculates the new slider position based on a clientX coordinate
  // (works for both mouse and touch events).
  const updatePosition = useCallback((clientX) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    // How far the cursor/touch is from the container's left edge
    const offsetX = clientX - rect.left;
    // Convert to a percentage, clamped between 0 and 100 so the
    // divider never goes outside the image bounds
    const percentage = Math.min(100, Math.max(0, (offsetX / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => {
    // Any deliberate grab of the handle permanently hands control to
    // the visitor, whether or not autoplay was ever turned on.
    hasInteractedRef.current = true;
    setIsDragging(true);
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handleTouchMove = (e) => {
    hasInteractedRef.current = true;
    updatePosition(e.touches[0].clientX);
  };

  // Runs the automatic back-and-forth sweep described above. Skipped
  // entirely when autoPlay is false, and self-cancels the moment the
  // visitor interacts (checked on every animation frame).
  useEffect(() => {
    if (!autoPlay) return;

    const midpoint = (autoPlayMin + autoPlayMax) / 2;
    const amplitude = (autoPlayMax - autoPlayMin) / 2;
    let startTimestamp = null;

    const runFrame = (timestamp) => {
      // Stops scheduling further frames as soon as the visitor has
      // taken over -- this is what makes autoplay stop "for good"
      // rather than only pausing.
      if (hasInteractedRef.current) return;

      if (startTimestamp === null) startTimestamp = timestamp;
      const elapsedMs = timestamp - startTimestamp;
      const angle = (elapsedMs / autoPlayDurationMs) * Math.PI * 2;

      setSliderPosition(midpoint + amplitude * Math.sin(angle));
      animationFrameRef.current = requestAnimationFrame(runFrame);
    };

    animationFrameRef.current = requestAnimationFrame(runFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [autoPlay, autoPlayMin, autoPlayMax, autoPlayDurationMs]);

  return {
    containerRef,
    sliderPosition,
    isDragging,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleTouchMove,
  };
}
