/**
 * ================================================================
 * Navbar.jsx
 * ================================================================
 * The main site navigation bar, shown at the top of every page.
 *
 * Layout behavior:
 * - Below the `lg` breakpoint (mobile and tablet), the nav links
 *   collapse behind a hamburger button. Tapping it opens a sidebar
 *   that slides in from the left edge of the screen, with a dimmed
 *   backdrop behind it that closes the menu when tapped.
 * - From `lg` upward, the full link row, plus the Book Now button,
 *   is shown inline next to the logo.
 *
 * Active / hover state:
 * - Each link gets a thin red underline that grows in from the left
 *   on hover.
 * - The link matching the current page keeps that underline fully
 *   drawn and its text colored red, so the active page is always
 *   visually clear.
 * ================================================================
 */

import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaXmark } from "react-icons/fa6";
import { motion, AnimatePresence } from "motion/react";
import Button from "../ui/Button";
import Container from "./Container";
import { NAV_LINKS, ROUTES } from "../../constants/routes";
import { siteConfig } from "../../config/siteConfig";

// Logo lives in public/, NOT src/assets/, so we reference it with a
// plain string path (no import needed) — anything in public/ is
// served exactly as-is from the site's root URL.
const logoPath = "/logo.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-tertiary/20"
            : "bg-background/50 backdrop-blur-sm"
        }`}
      >
        <Container>
          <nav className="flex items-center justify-between h-20">
            {/* ---------------- LOGO ---------------- */}
            <NavLink
              to={ROUTES.HOME}
              className="flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {/* The actual logo image mark */}
              <img
                src={logoPath}
                alt={siteConfig.brandName}
                className="h-10 w-auto object-contain"
              />
              {/* Brand name text next to the logo mark — hidden on very
                  small screens so the navbar doesn't feel cramped, since
                  the logo image alone is still recognizable */}
              <span className="hidden sm:inline font-heading font-bold text-lg tracking-wide">
                {siteConfig.brandName.toUpperCase()}
              </span>
            </NavLink>

            {/* ---------------- DESKTOP NAV LINKS ----------------
                Switches on at the `lg` breakpoint rather than `md`.
                With 5 links (including the two-word "About Us"), plus
                the logo, brand name, and Book Now button all sharing
                the same row, `md` (768px, tablet width) does not leave
                enough horizontal room and forces labels like "About Us"
                onto two lines. `lg` (1024px) guarantees enough space
                for every item to sit on a single line, and tablets fall
                back to the mobile hamburger menu instead. */}
            <ul className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    end={link.path === ROUTES.HOME}
                    className={({ isActive }) =>
                      `group relative inline-block whitespace-nowrap py-1 font-label text-xs uppercase tracking-wider transition-colors duration-200 ${
                        isActive
                          ? "text-primary"
                          : "text-white hover:text-primary"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        {/* Underline indicator: grows in from the left
                            on hover for inactive links, and stays fully
                            drawn in red for whichever link matches the
                            current page. */}
                        <span
                          aria-hidden="true"
                          className={`absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-primary transition-transform duration-300 ease-out ${
                            isActive
                              ? "scale-x-100"
                              : "scale-x-0 group-hover:scale-x-100"
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* ---------------- DESKTOP BOOK NOW BUTTON ---------------- */}
            <div className="hidden lg:block">
              <Button variant="primary" size="sm" to={ROUTES.CONTACT}>
                Book Now
              </Button>
            </div>

            {/* ---------------- MOBILE / TABLET HAMBURGER TOGGLE ---------------- */}
            <button
              className="lg:hidden text-white text-2xl"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <FaXmark /> : <FaBars />}
            </button>
          </nav>
        </Container>
      </header>

      {/* ---------------- MOBILE / TABLET SIDEBAR MENU ----------------
          Rendered as a sibling of <header>, NOT nested inside it.
          <header> uses backdrop-blur, which — like `transform` or
          `filter` — creates its own containing block for any
          position:fixed descendant. Nesting the sidebar inside it
          was trapping the "fixed" sidebar to the header's own 80px
          height instead of the full viewport, which is why it was
          rendering as a squashed sliver at the top of the screen.
          Keeping it here, outside <header>, lets it size itself
          against the real viewport. */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop: dims the rest of the page behind the
                sidebar and closes the menu when tapped. */}
            <motion.div
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Sidebar panel itself — fixed to the left edge, slides
                in on the x-axis from fully off-screen (-100%) to its
                resting position (0). */}
            <motion.aside
              key="sidebar-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 flex h-screen w-[80%] max-w-xs flex-col bg-background border-r border-tertiary/20"
            >
              {/* Sidebar header: logo on the left, close button on
                  the right, matching the height of the main navbar. */}
              <div className="flex h-20 shrink-0 items-center justify-between border-b border-tertiary/20 px-5">
                <NavLink
                  to={ROUTES.HOME}
                  className="flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <img
                    src={logoPath}
                    alt={siteConfig.brandName}
                    className="h-9 w-auto object-contain"
                  />
                  <span className="font-heading font-bold text-base tracking-wide">
                    {siteConfig.brandName.toUpperCase()}
                  </span>
                </NavLink>
                <button
                  className="text-white text-2xl"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <FaXmark />
                </button>
              </div>

              {/* Nav links, stacked vertically down the sidebar */}
              <ul className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-6">
                {NAV_LINKS.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      end={link.path === ROUTES.HOME}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `group relative inline-block w-fit py-3 font-label text-sm uppercase tracking-wider ${
                          isActive ? "text-primary" : "text-white"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {link.label}
                          {/* Same underline treatment as the desktop
                              links, kept for visual consistency
                              between the two nav layouts. */}
                          <span
                            aria-hidden="true"
                            className={`absolute -bottom-0.5 left-0 h-0.5 w-full origin-left bg-primary transition-transform duration-300 ease-out ${
                              isActive
                                ? "scale-x-100"
                                : "scale-x-0 group-hover:scale-x-100"
                            }`}
                          />
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
                <li className="pt-4">
                  <Button
                    variant="primary"
                    size="md"
                    to={ROUTES.CONTACT}
                    fullWidth
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Book Now
                  </Button>
                </li>
              </ul>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
