/**
 * ================================================================
 * useSkewedCarousel.js
 * ================================================================
 * All the INTERACTION LOGIC behind <SkewedCarousel />, kept in its
 * own hook exactly the way this project already separates logic
 * from markup for the before/after slider (see
 * src/hooks/useBeforeAfterSlider.js). SkewedCarousel.jsx only ever
 * deals with how things LOOK; this file only ever deals with WHICH
 * slide is active and HOW that active slide changes.
 *
 * RESPONSIBILITIES:
 * - Owns the single source of truth: `activeIndex`.
 * - Dragging: pointer events (covers mouse, touch and pen with one
 *   code path) track how far the user has dragged, live, so the
 *   carousel can follow the finger/cursor in real time. On release,
 *   if the drag passed `dragThreshold` pixels, the active slide
 *   moves one step in that direction; otherwise it springs back.
 * - Keyboard: ArrowLeft / ArrowRight move the active slide by one
 *   when the carousel has focus.
 * - Autoplay: advances one slide every `autoplayDelay` ms, but
 *   automatically pauses while the user is hovering OR mid-drag, so
 *   it never fights an active interaction.
 * - Looping: when `loop` is true, going past the last slide wraps
 *   to the first (and vice-versa). When false, the index simply
 *   clamps at each end.
 * ================================================================
 */
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * @param {number} itemCount - total number of slides
 * @param {number} [initialIndex=0] - slide focused on mount
 * @param {boolean} [loop=false] - wrap around at either end
 * @param {boolean} [autoplay=false] - advance on a timer
 * @param {number} [autoplayDelay=3000] - ms between automatic advances
 * @param {boolean} [enableDrag=true] - allow dragging to navigate
 * @param {boolean} [enableKeyboard=true] - allow arrow keys to navigate
 * @param {number} [dragThreshold=60] - px of drag needed to change slide
 * @param {(index: number) => void} [onIndexChange] - fired whenever the active slide changes
 */
export function useSkewedCarousel({
  itemCount,
  initialIndex = 0,
  loop = false,
  autoplay = false,
  autoplayDelay = 3000,
  enableDrag = true,
  enableKeyboard = true,
  dragThreshold = 60,
  onIndexChange,
}) {
  // Clamps (or wraps, if looping) any target index back into the
  // valid [0, itemCount - 1] range. Every navigation action funnels
  // through this one function so "how the edges behave" only ever
  // has to be decided in one place.
  const clampIndex = useCallback(
    (index) => {
      if (itemCount <= 0) return 0;
      if (loop) return ((index % itemCount) + itemCount) % itemCount;
      return Math.min(itemCount - 1, Math.max(0, index));
    },
    [itemCount, loop],
  );

  const [activeIndex, setActiveIndex] = useState(() =>
    clampIndex(initialIndex),
  );
  // Live pixel offset while the user is actively dragging -- added
  // straight onto every slide's on-screen position so the whole
  // carousel visibly follows the pointer before snapping to the
  // nearest slide on release.
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const pointerStartX = useRef(0);
  const isPointerDown = useRef(false);

  const goTo = useCallback(
    (index) => setActiveIndex(() => clampIndex(index)),
    [clampIndex],
  );
  const next = useCallback(
    () => setActiveIndex((current) => clampIndex(current + 1)),
    [clampIndex],
  );
  const prev = useCallback(
    () => setActiveIndex((current) => clampIndex(current - 1)),
    [clampIndex],
  );

  // Notify the parent page any time the active slide actually
  // changes (e.g. so a caller could sync an external UI element).
  useEffect(() => {
    onIndexChange?.(activeIndex);
  }, [activeIndex, onIndexChange]);

  // ---- Autoplay ----
  // Paused whenever the pointer is hovering the carousel, or a drag
  // is in progress, so autoplay never yanks a slide out from under
  // an interaction the visitor already started.
  useEffect(() => {
    if (!autoplay || isHovered || isDragging || itemCount <= 1) {
      return undefined;
    }
    const intervalId = setInterval(() => {
      setActiveIndex((current) => clampIndex(current + 1));
    }, autoplayDelay);
    return () => clearInterval(intervalId);
  }, [autoplay, autoplayDelay, isHovered, isDragging, itemCount, clampIndex]);

  // ---- Drag (pointer events -> works for mouse, touch and pen) ----
  const handlePointerDown = useCallback(
    (event) => {
      if (!enableDrag) return;
      isPointerDown.current = true;
      pointerStartX.current = event.clientX;
      setIsDragging(true);
      // Pointer capture keeps receiving move/up events even if the
      // cursor leaves the carousel while dragging fast.
      event.currentTarget.setPointerCapture?.(event.pointerId);
    },
    [enableDrag],
  );

  const handlePointerMove = useCallback((event) => {
    if (!isPointerDown.current) return;
    setDragOffset(event.clientX - pointerStartX.current);
  }, []);

  const endDrag = useCallback(() => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    setIsDragging(false);
    // Read the final drag distance straight out of state (via the
    // functional updater) so this callback never needs `dragOffset`
    // itself as a dependency -- keeps endDrag's identity stable.
    setDragOffset((offset) => {
      if (offset <= -dragThreshold) next();
      else if (offset >= dragThreshold) prev();
      return 0;
    });
  }, [dragThreshold, next, prev]);

  // ---- Keyboard ----
  const handleKeyDown = useCallback(
    (event) => {
      if (!enableKeyboard) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        prev();
      }
    },
    [enableKeyboard, next, prev],
  );

  return {
    activeIndex,
    goTo,
    next,
    prev,
    dragOffset,
    isDragging,
    // Spread these three groups directly onto the carousel's DOM
    // elements in SkewedCarousel.jsx -- keeps that file from ever
    // having to know HOW dragging/hover/keyboard detection works,
    // only WHERE to attach it.
    dragHandlers: enableDrag
      ? {
          onPointerDown: handlePointerDown,
          onPointerMove: handlePointerMove,
          onPointerUp: endDrag,
          onPointerLeave: endDrag,
          onPointerCancel: endDrag,
        }
      : {},
    hoverHandlers: {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
    },
    keyboardHandlers: enableKeyboard
      ? { onKeyDown: handleKeyDown, tabIndex: 0 }
      : {},
  };
}
