/**
 * Single source of truth for every page URL in the website.
 *
 * Rule for this project: never hardcode a URL string like "/services"
 * directly inside a <Link> or navigate() call anywhere in the app.
 * Always import ROUTES from this file instead.
 *
 * This means if a URL ever needs to be renamed, it only has to change
 * in one place here, and every Navbar link, Footer link, and internal
 * <Link> across the whole app updates automatically.
 */

// The actual URL paths used in <Route path="..."> and in React
// Router's <Link to={...}> throughout the app.
export const ROUTES = {
  HOME: "/",
  SERVICES: "/services",
  GALLERY: "/gallery",
  ABOUT: "/about",
  CONTACT: "/contact",
};

/**
 * Builds a deep link straight into one service inside the Services
 * Hub page's sidebar + detail-panel explorer.
 *
 * The Services Hub is a single page (no per-service route). It reads
 * a `?service=<slug>` query parameter on load and pre-selects the
 * matching service in the sidebar, so any part of the app that wants
 * to link directly to one specific service uses this helper to build
 * that URL consistently.
 *
 * Example usage:
 *   <Link to={getServiceLinkPath("engine-diagnostics")}>
 */
export const getServiceLinkPath = (slug) =>
  `${ROUTES.SERVICES}?service=${slug}`;

// The exact list of links shown in the Navbar, in the exact order
// seen in the design (Home, Services, About Us, Gallery, Contact).
// The Navbar component loops over this array instead of hardcoding
// separate <Link> tags for every page.
export const NAV_LINKS = [
  { label: "Home", path: ROUTES.HOME },
  { label: "Services", path: ROUTES.SERVICES },
  { label: "About Us", path: ROUTES.ABOUT },
  { label: "Gallery", path: ROUTES.GALLERY },
  { label: "Contact", path: ROUTES.CONTACT },
];
