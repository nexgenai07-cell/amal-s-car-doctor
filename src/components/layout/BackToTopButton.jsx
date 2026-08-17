/**
 * ================================================================
 * BackToTopButton.jsx
 * ================================================================
 * A floating circular button pinned to the bottom-right corner of
 * the viewport. It stays hidden while the visitor is near the top
 * of the page, and fades/slides into view once they scroll down
 * past a small threshold. Clicking it smoothly scrolls the window
 * back to the very top of the page.
 *
 * This is a pure UI convenience for long pages (Gallery, Services,
 * About, etc.) so the visitor never has to manually drag the
 * scrollbar all the way back up.
 *
 * HOW VISIBILITY IS TRACKED:
 * A scroll listener on `window` checks `window.scrollY` and flips
 * a boolean state once the visitor has scrolled past 300px. That
 * boolean controls both the button's presence (AnimatePresence)
 * and its enter/exit animation (Motion).
 *
 * WHY A NATIVE SCROLL LISTENER INSTEAD OF A LIBRARY:
 * The show/hide logic here is a single numeric comparison, so a
 * plain `window.addEventListener("scroll", ...)` is simpler and
 * lighter than pulling in a dedicated scroll-tracking hook for it.
 * The listener is passive (does not block scrolling) and is always
 * cleaned up on unmount to avoid leaking listeners between page
 * navigations.
 *
 * Usage: rendered once, near the top of App.jsx, alongside
 * ScrollToTop, so it is available on every page of the site.
 * ================================================================
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FaArrowUp } from "react-icons/fa6";

// Distance (in pixels) the visitor must scroll down before the
// button appears. Small enough to feel responsive, large enough
// that it does not pop up immediately on tiny scrolls.
const SCROLL_SHOW_THRESHOLD = 300;

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > SCROLL_SHOW_THRESHOLD);
    }

    // Run once on mount too, in case the page is already scrolled
    // down when this component first mounts (e.g. a route change
    // that lands mid-page via an anchor link).
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          initial={{ opacity: 0, y: 16, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="
            fixed bottom-5 right-5 z-50
            flex items-center justify-center
            w-11 h-11 sm:w-12 sm:h-12
            rounded-full
            bg-primary text-white
            shadow-lg shadow-black/40
            hover:bg-primary-dark
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background
            transition-colors
            cursor-pointer
          "
        >
          <FaArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
