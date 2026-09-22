/**

 * A floating circular button pinned to the bottom-right corner of
 * the viewport, visible on every page of the site (mounted once in
 * App.jsx, alongside BackToTopButton). Tapping/clicking it opens a
 * WhatsApp chat with the workshop's number in a new browser tab,
 * using WhatsApp's official click-to-chat link format — this
 * requires no WhatsApp Business API key or backend integration.
 *
 * ATTENTION-GRABBING RIPPLE:
 * Two rings continuously expand outward from the button and fade
 * out, like ripples spreading from a drop of water, so the button
 * catches the visitor's eye as soon as the page loads rather than
 * blending into the corner unnoticed. This is purely decorative —
 * the rings sit behind the real button and are marked aria-hidden so
 * screen readers skip them entirely.
 *
 * WHERE THE NUMBER COMES FROM:
 * The phone number is never hardcoded here. It is read from
 * siteConfig.js (siteConfig.contact.whatsappRaw), the site's single
 * source of truth for contact details, so updating the number later
 * only requires a change in ONE place.
 *
 * WHY "api.whatsapp.com/send" INSTEAD OF THE SHORTER "wa.me" LINK:
 * Both are official click-to-chat formats and accept the same
 * "phone"/"text" values, but on desktop machines that have the
 * WhatsApp Desktop app installed, a "wa.me" link is sometimes handed
 * off to the app before it finishes reading the phone number, which
 * can leave the app sitting on its home screen instead of the
 * intended chat. Building the link from "api.whatsapp.com/send"
 * instead has proven far more reliable at opening the exact chat
 * (Desktop app if installed, otherwise WhatsApp Web/mobile).
 *
 * PRE-FILLED MESSAGE:
 * The link's "?text=" query parameter pre-fills the chat's message
 * box on the visitor's side (they can still edit or clear it before
 * sending) so they are not left staring at a blank chat. The text is
 * passed through `encodeURIComponent` so spaces/punctuation survive
 * as a valid URL.
 *
 * ALWAYS VISIBLE (UNLIKE BackToTopButton):
 * BackToTopButton only appears after the visitor scrolls down, since
 * it is a scroll-position convenience. This button is a contact
 * shortcut instead, so it stays visible from the moment the page
 * loads and simply plays a one-time entrance animation on mount.
 *
 * RESPONSIVE BEHAVIOUR:
 * The button's size steps up slightly on larger screens (via
 * Tailwind's `sm:` breakpoint) so it stays comfortably tappable on a
 * small phone screen without looking oversized on a desktop monitor.
 * Its fixed position is relative to the viewport, so it stays in the
 * same corner at every screen size without needing separate mobile/
 * desktop layout logic.
 * ================================================================
 */

import { motion } from "motion/react";
import { FaWhatsapp } from "react-icons/fa6";
import { siteConfig } from "../../config/siteConfig";

// Opening message pre-filled into the visitor's chat box. Kept as a
// named constant (instead of inline further down) so it is easy to
// find and reword later without touching the link-building logic.
const DEFAULT_MESSAGE = `Hello ${siteConfig.brandName}! I'd like to know more about your services.`;

// Builds the final click-to-chat link once: the workshop's WhatsApp
// number (digits only, no "+") as the "phone" parameter, followed by
// the URL-encoded greeting as the "text" parameter.
const whatsappChatUrl = `https://api.whatsapp.com/send?phone=${
  siteConfig.contact.whatsappRaw
}&text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

export default function FloatingWhatsAppButton() {
  return (
    // Sized and positioned wrapper: both the ripple rings below and
    // the button itself size themselves to fill this box (w-full/
    // h-full), so the button's own size only ever needs to change in
    // ONE place (here) instead of three.
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.4 }}
      className="fixed bottom-8 right-8 sm:bottom-10 sm:right-10 z-50 w-12 h-12 sm:w-14 sm:h-14"
    >
      {/* First ripple ring — starts its expand-and-fade cycle the
          moment the page loads. */}
      <span
        aria-hidden="true"
        className="whatsapp-ripple-ring absolute inset-0 rounded-full pointer-events-none"
      />

      {/* Second ripple ring — identical animation, but started
          negative-1.1s into its own cycle (half of the 2.2s loop) so
          it is always roughly out of phase with the first ring. This
          is what makes the effect read as continuous overlapping
          ripples instead of both rings pulsing in perfect unison. */}
      <span
        aria-hidden="true"
        className="whatsapp-ripple-ring absolute inset-0 rounded-full pointer-events-none [animation-delay:-1.1s]"
      />

      <motion.a
        href={whatsappChatUrl}
        // Opens in a new tab so the visitor never loses the page they
        // were browsing on this site.
        target="_blank"
        // Prevents the newly opened tab from getting a JavaScript
        // handle back to this window — the standard safe pairing for
        // any link that uses target="_blank".
        rel="noopener noreferrer"
        // Screen-reader label, since the button itself only shows an
        // icon with no visible text.
        aria-label="Chat with us on WhatsApp"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="
          whatsapp-button-glow
          relative
          flex items-center justify-center
          w-full h-full
          rounded-full
          bg-whatsapp text-white
          shadow-lg shadow-black/40
          hover:bg-whatsapp-dark
          focus:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2 focus-visible:ring-offset-background
          transition-colors
          cursor-pointer
        "
      >
        <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7" />
      </motion.a>
    </motion.div>
  );
}
