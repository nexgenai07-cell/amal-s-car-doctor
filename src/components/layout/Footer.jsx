/**
 * The site-wide footer: a 4-column, fully responsive layout.
 *   1. Logo + brand name + tagline
 *   2. Pages      -> every page link (Home, Services, About, etc.)
 *   3. Services   -> deep links into the 3 broad service groups
 *                    (Diagnostics, Maintenance & Repair, Electrical)
 *   4. Contact    -> address, phone, working hours, social icons
 * Includes a slow-growing red underline on every link when hovered,
 * and a subtle red glow/gradient accent matching the site's brand
 * identity (see index.css design tokens).
 *
 * Responsive / alignment behavior:
 * - Mobile (<640px): everything (logo, text, nav links, icons) is
 *   centered horizontally, so the whole footer reads as one neat
 *   centered stack instead of text hugging the left edge.
 * - Tablet+ (sm and up): everything switches to normal left-aligned
 *   columns, which reads better once there's room for multiple
 *   columns side by side.
 *
 * Every piece of text/data below (brand name, tagline, phone,
 * address, hours, page routes, service slugs) is pulled from the
 * project's single-source-of-truth files — src/config/siteConfig.js
 * and src/constants/routes.js — nothing is hardcoded here that isn't
 * already real project data.
 */

import { Link } from "react-router-dom";
import {
  FaLocationDot,
  FaPhone,
  FaClock,
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaTiktok,
} from "react-icons/fa6";
// "motion/react" is the same animation library already used in
// Navbar.jsx (for the mobile menu slide-down) — reusing it here
// keeps the whole site's animation style consistent.
import { motion } from "motion/react";
import Container from "./Container";
import { siteConfig } from "../../config/siteConfig";
import { ROUTES, NAV_LINKS, getServiceLinkPath } from "../../constants/routes";

// Logo lives in public/, so it's referenced as a plain root-relative
// string path, exactly the same way Navbar.jsx does it.
const logoPath = "/logo.png";

// The footer links straight into the Services Hub explorer, deep
// linking to one representative service per broad category
// (Diagnostics / Maintenance & Repair / Electrical) using the
// getServiceLinkPath() helper from routes.js, which builds a
// "/services?service=<slug>" URL. The Services Hub page reads that
// query parameter on load and pre-selects the matching service in
// the sidebar.
const FOOTER_SERVICE_LINKS = [
  { label: "Diagnostics", path: getServiceLinkPath("engine-diagnostics") },
  { label: "Maintenance & Repair", path: getServiceLinkPath("oil-change") },
  { label: "Electrical", path: getServiceLinkPath("battery-electrical") },
];

// Reads the actual URLs from siteConfig.socials (single source of
// truth). Values are empty strings until the client shares real
// handles, so a safe "#" placeholder is used as the href fallback
// directly on the <a> tag below. Once real links are added inside
// siteConfig.js, they start working here automatically.
const SOCIAL_LINKS = [
  { icon: FaInstagram, href: siteConfig.socials.instagram, label: "Instagram" },
  { icon: FaFacebookF, href: siteConfig.socials.facebook, label: "Facebook" },
  { icon: FaXTwitter, href: siteConfig.socials.twitter, label: "X (Twitter)" },
  { icon: FaTiktok, href: siteConfig.socials.tiktok, label: "TikTok" },
];

/**
 * FooterLink
 * Reusable link used for every text link in the "Pages" and
 * "Services" columns (and the phone number), so the hover animation
 * only needs to be written once instead of being repeated for every
 * link.
 *
 * Hover effect: a thin red line, hidden by default, that slowly
 * grows from the left edge to the right when hovered.
 *  - `group` on the wrapper marks this element as the "parent" that
 *    child elements can react to on hover (via group-hover:).
 *  - the <span> line starts at `scale-x-0` (zero width) with
 *    `origin-left` so that when it grows, it grows FROM the left
 *    edge outward, not from the center in both directions.
 *  - on hover, `group-hover:scale-x-100` grows the line to its full
 *    natural width (100%).
 *  - `duration-500 ease-out` controls the speed of that growth —
 *    500 milliseconds, reading as a slow/smooth grow rather than an
 *    instant snap.
 *
 * `to`   -> internal page route, rendered as React Router's <Link>
 * `href` -> external / special link (e.g. "tel:+966...", "mailto:"),
 *           rendered as a plain <a> tag instead, since React
 *           Router's <Link> is only meant for internal app routes.
 */
function FooterLink({ to, href, children }) {
  const linkClassName =
    "group relative inline-block w-fit text-sm text-neutral transition-colors duration-300 hover:text-white";

  // The animated underline element, shared by both the internal-link
  // and external-link versions below so it looks identical either way.
  const animatedUnderline = (
    <span
      aria-hidden="true"
      className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-x-100"
    />
  );

  // External link (currently only used for the "tel:" phone number).
  if (href) {
    return (
      <a href={href} className={linkClassName}>
        {children}
        {animatedUnderline}
      </a>
    );
  }

  // Internal app route (Pages column, Services column).
  return (
    <Link to={to} className={linkClassName}>
      {children}
      {animatedUnderline}
    </Link>
  );
}

/**
 * FooterColumnHeading
 * The small uppercase "PAGES" / "SERVICES" / "CONTACT" label shown
 * above every column. Uses the same monospace "label" font used for
 * badges/status text everywhere else on the site, colored red so the
 * 3 column headings act as a small accent row across the footer.
 */
function FooterColumnHeading({ children }) {
  return (
    <h4 className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-primary">
      {children}
    </h4>
  );
}

// A shared "fade up into view" animation setting, applied to each of
// the 4 columns below with a slightly increasing delay per column so
// they animate in one after another (left to right) instead of all
// popping in at once.
const columnAnimation = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }, // only play the animation the first time it scrolls into view
  transition: { duration: 0.5, delay },
});

// Shared alignment classes reused by every column below:
// - By default (mobile), items stack centered (items-center + text-center).
// - From `sm:` upward, they switch to normal left alignment
//   (sm:items-start + sm:text-left), which looks right once the grid
//   splits into multiple side-by-side columns.
const columnAlignment =
  "flex flex-col items-center text-center sm:items-start sm:text-left";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-tertiary/20 bg-secondary pt-9 pb-5 px-2 md:px-10 lg:px-20">
      {/* Decorative top edge: a hairline gradient (transparent -> red
          -> transparent) across the very top of the footer, instead
          of a plain flat grey border. */}
      <div className="absolute top-0 left-0 h-px w-full bg-linear-to-r from-transparent via-primary to-transparent" />

      {/* Soft background glow: one large, heavily-blurred red circle
          placed off-screen at the top-left corner, behind column 1.
          pointer-events-none so it never blocks clicks on the real
          content sitting above it. */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />

      <Container className="relative">
        {/* Main 4-column grid:
            - Mobile (default, <640px): 1 column, fully stacked,
              every column centered (see columnAlignment above).
            - Tablet (sm: >=640px): 2 columns, left-aligned.
            - Desktop (lg: >=1024px): a 12-column grid, so the two
              content-heavy columns (Brand, Contact) get more space
              (4/12 each) than the two short link columns in the
              middle (2/12 each) — 4 + 2 + 2 + 4 = 12. */}
        <div className="grid grid-cols-1 g md:gap-x-4 md:gap-y-12  gap-y-6 pb-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Column 1 — Brand */}
          <motion.div
            {...columnAnimation(0)}
            className={`${columnAlignment} gap-4 lg:col-span-4`}
          >
            {/* Logo mark + brand name, side by side, clickable back
                to the homepage — same pattern used in Navbar.jsx, so
                the logo lockup looks identical in the header and
                footer. */}
            <Link to={ROUTES.HOME} className="flex w-fit items-center gap-2">
              <img
                src={logoPath}
                alt={siteConfig.brandName}
                className="h-10 w-auto object-contain"
              />
              <span className="font-heading text-lg font-bold tracking-wide text-white">
                {siteConfig.brandName}
              </span>
            </Link>

            {/* Short tagline — pulled from siteConfig so the
                marketing copy stays editable from one place. */}
            <p className=" max-w-80 md:max-w-50  text-sm leading-relaxed font-bold text-neutral">
              {siteConfig.footerTagline}
            </p>
          </motion.div>

          {/* Column 2 — Pages */}
          <motion.div
            {...columnAnimation(0.1)}
            className={`${columnAlignment} gap-5 lg:col-span-2`}
          >
            <FooterColumnHeading>Pages</FooterColumnHeading>
            {/* items-center/sm:items-start here too, so the nav links
                themselves stack centered on mobile, not just the
                heading above them. */}
            <nav className="flex flex-col items-center gap-2 sm:items-start">
              {/* NAV_LINKS is imported straight from routes.js — the
                  exact same array the Navbar uses — so this column
                  can never drift out of sync with the main nav bar. */}
              {NAV_LINKS.map((link) => (
                <FooterLink key={link.path} to={link.path}>
                  {link.label}
                </FooterLink>
              ))}
            </nav>
          </motion.div>

          {/* Column 3 — Services */}
          <motion.div
            {...columnAnimation(0.2)}
            className={`${columnAlignment} gap-4 lg:col-span-2`}
          >
            <FooterColumnHeading>Services</FooterColumnHeading>
            <nav className="flex flex-col items-center gap-3 sm:items-start">
              {FOOTER_SERVICE_LINKS.map((link) => (
                <FooterLink key={link.path} to={link.path}>
                  {link.label}
                </FooterLink>
              ))}
            </nav>
          </motion.div>

          {/* Column 4 — Contact */}
          <motion.div
            {...columnAnimation(0.3)}
            className={`${columnAlignment} gap-5 lg:col-span-4`}
          >
            <FooterColumnHeading>Contact</FooterColumnHeading>

            {/* items-center on mobile so this whole info block sits in
                the middle of the column; sm:items-start pulls it back
                to the left once there's a proper multi-column layout. */}
            <div className="flex flex-col items-center gap-4 sm:items-start">
              {/* Full workshop address */}
              <div className="flex items-start gap-3 text-sm text-neutral">
                <FaLocationDot className="mt-0.5 shrink-0 text-primary" />
                <span>{siteConfig.address.full}</span>
              </div>

              {/* Phone number — wrapped in FooterLink with `href`
                  (not `to`) so it opens as a real tel: link and gets
                  the same slow red underline hover as the nav links. */}
              <div className="flex items-center gap-2 text-sm text-neutral">
                <FaPhone className="shrink-0 text-primary" />
                <FooterLink href={`tel:${siteConfig.contact.phoneRaw}`}>
                  {siteConfig.contact.phone}
                </FooterLink>
              </div>

              {/* Working hours */}
              <div className="flex items-center gap-3 text-sm text-neutral">
                <FaClock className="shrink-0 text-primary" />
                <span>{siteConfig.workingHours.displayString}</span>
              </div>
            </div>

            {/* Social icons row — centered on mobile
                (justify-center), pushed back to the left from sm:
                upward (sm:justify-start), matching every other block
                above. */}
            <div className="flex items-center justify-center gap-2 pt-1 sm:justify-start">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex h-8 w-8 items-center justify-center rounded-full border border-tertiary/40 text-neutral transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white"
                >
                  <Icon className="text-sm transition-transform duration-300 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar: a thin strip below a divider line containing
            the copyright text (left) and the Legal links (right) —
            centered on mobile (flex-col + items-center) and switches
            to a left/right row from `sm:` upward (sm:flex-row). */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-tertiary/20 pt-6 sm:flex-row">
          <p className="font-label text-xs text-neutral">
            {siteConfig.copyrightText}
          </p>
          <div className="flex items-center gap-6">
            <Link
              to={siteConfig.legal.privacyPolicyPath}
              className="font-label text-xs text-neutral transition-colors duration-300 hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              to={siteConfig.legal.termsOfServicePath}
              className="font-label text-xs text-neutral transition-colors duration-300 hover:text-primary"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
