/**
 * ================================================================
 * App.jsx
 * ================================================================
 * The root layout component. This renders on EVERY page and sets
 * up the consistent structure seen across the whole site:
 *
 *   Navbar (always visible)
 *   ------------------------
 *   Page content (changes based on the current route)
 *   ------------------------
 *   Footer (always visible)
 *
 * The actual page content in the middle is controlled entirely by
 * AppRoutes, which decides which page component to render based
 * on the current URL.
 * ================================================================
 */

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import BackToTopButton from "./components/layout/BackToTopButton";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    // min-h-screen + flex-col ensures the footer always stays at
    // the bottom of the viewport, even on pages with very little
    // content (instead of floating in the middle of the screen).
    <div className="flex flex-col min-h-screen bg-background">
      {/* Renders nothing visible — just resets scroll position to
          the top every time the route changes, so every page opens
          starting from the top instead of keeping the previous
          page's scroll position. */}
      <ScrollToTop />

      <Navbar />

      {/* flex-1 makes this main content area stretch to fill all
          available space, pushing the footer down to the bottom */}
      <main className="flex-1">
        <AppRoutes />
      </main>

      <Footer />

      {/* Floating bottom-left button. Hidden near the top of the
          page, fades in once the visitor scrolls down, and smoothly
          scrolls back to the top of the page when clicked. */}
      <BackToTopButton />
    </div>
  );
}
