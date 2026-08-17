/**
 * ================================================================
 * Navbar.jsx  (UPDATED — real logo.png image now used instead of
 * just text. The brand name text stays next to it as a fallback/
 * accessible label, matching how most real sites pair a logo mark
 * with a wordmark.)
 * ================================================================
 * The main site navigation bar, shown at the top of EVERY page.
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

          {/* ---------------- DESKTOP NAV LINKS ---------------- */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === ROUTES.HOME}
                  className={({ isActive }) =>
                    `font-label text-xs uppercase tracking-wider transition-colors duration-200 ${
                      isActive
                        ? "text-primary"
                        : "text-white hover:text-primary"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* ---------------- DESKTOP BOOK NOW BUTTON ---------------- */}
          <div className="hidden md:block">
            <Button variant="primary" size="sm" to={ROUTES.CONTACT}>
              Book Now
            </Button>
          </div>

          {/* ---------------- MOBILE HAMBURGER TOGGLE ---------------- */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <FaXmark /> : <FaBars />}
          </button>
        </nav>
      </Container>

      {/* ---------------- MOBILE DROPDOWN MENU ---------------- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-background border-t border-tertiary/20"
          >
            <Container>
              <ul className="flex flex-col gap-1 py-6">
                {NAV_LINKS.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      end={link.path === ROUTES.HOME}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `block py-3 font-label text-sm uppercase tracking-wider ${
                          isActive ? "text-primary" : "text-white"
                        }`
                      }
                    >
                      {link.label}
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
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
