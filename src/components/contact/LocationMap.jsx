/**
 * ================================================================
 * LocationMap.jsx
 * ================================================================
 * A REAL, fully interactive Google Maps embed pinned to the
 * workshop's exact geocoded coordinates. No API key is needed:
 * this uses Google's public "maps?...&output=embed" iframe format,
 * the same technique behind the "Share > Embed a map" link Google
 * Maps itself generates.
 *
 * NOTE on the coordinate query below: this is the ONE query format
 * that reliably renders the actual street-level map (place_id: and
 * address-text queries were both tried and either failed to render
 * at all without a paid Google Maps API key, or rendered but showed
 * a broken "Place info couldn't load" bubble on click — a known
 * limitation of Google's free classic embed, not something fixable
 * from this side without adding a billed API key). The map itself,
 * zoom, and panning all work correctly either way; our OWN styled
 * info card below (with the real brand name, status, and address)
 * is what actually communicates the location's info to visitors,
 * rather than relying on Google's native marker click-bubble.
 *
 * Because it's a real <iframe> map (not a static image), scroll-
 * to-zoom, click-and-drag panning, and the on-map +/- zoom controls
 * all work natively — zoom is fully functional out of the box.
 *
 * Rendered as the RIGHT column inside the shared, highlighted
 * "form + map" card on the Contact page (see Contact.jsx). Kept
 * compact (min-h-[260px]) and matches the left column's height via
 * the parent grid's "items-stretch".
 * ================================================================
 */
import { motion } from "motion/react";
import { FaLocationDot } from "react-icons/fa6";
import { siteConfig } from "../../config/siteConfig";

// Exact coordinates for siteConfig.address.full ("6426 Abi
// Hourairah, An Nasim Al Gharbi, Riyadh 14244"), geocoded once so
// the pin lands precisely on the real building rather than an
// approximate street-level guess.
const LATITUDE = 24.7170063;
const LONGITUDE = 46.8521382;
const DEFAULT_ZOOM = 16;

export default function LocationMap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
      className="relative h-full min-h-65 lg:min-h-0 overflow-hidden rounded-xl border border-tertiary/20"
    >
      {/* The real, interactive map. Centered + pinned on the exact
          workshop coordinates, with scroll/drag/+-button zoom all
          working natively since this is a genuine Google Maps
          iframe, not a static screenshot. */}
      <iframe
        title={`${siteConfig.brandName} — Location Map`}
        src={`https://www.google.com/maps?q=${LATITUDE},${LONGITUDE}&z=${DEFAULT_ZOOM}&output=embed`}
        className="absolute inset-0 h-full w-full"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Status info card, bottom-left, matching the design.
          Wrapped in a "pointer-events-none" full-width strip so the
          empty space around the card never blocks map dragging —
          only the visible card itself ("pointer-events-auto")
          re-enables clicks, and it's small/corner-anchored so it
          never sits over the zoom controls or blocks scroll-zoom
          on the rest of the map. */}
      <div className="pointer-events-none absolute inset-x-4 bottom-4 sm:right-auto">
        <div className="pointer-events-auto inline-flex max-w-full flex-col rounded-lg border border-tertiary/20 bg-background/90 px-4 py-3 backdrop-blur-sm">
          <p className="flex items-center gap-1.5 font-heading font-semibold text-sm">
            <FaLocationDot className="shrink-0 text-xs text-primary" />
            {siteConfig.brandName}
          </p>
          <p className="mt-1 flex items-center gap-1.5 font-label text-[10px] uppercase tracking-wider text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Status: {siteConfig.systemStatus}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-neutral">
            {siteConfig.address.line1} <br />
            {siteConfig.address.city} {siteConfig.address.postalCode}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
