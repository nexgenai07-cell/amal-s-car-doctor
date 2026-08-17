/**
 * ================================================================
 * ReachUsGrid.jsx
 * ================================================================
 * "Reach Us Directly" — 4 compact, cursor-reactive pill strips
 * arranged in a diamond formation: Location on top, Call Us and
 * WhatsApp spread left/right in the middle, Email Us on the
 * bottom. All values are pulled from siteConfig.js, the site's
 * single source of truth for contact/address info.
 *
 * The diamond layout + "burst from center" entrance + cursor-
 * parallax drift all live in the reusable <ParallaxPills />
 * component — this file only builds the 4 pills' data, in the
 * exact order that component expects: [top, left, right, bottom].
 * ================================================================
 */
import {
  FaLocationDot,
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa6";
import Container from "../layout/Container";
import ParallaxPills from "../ui/ParallaxPills";
import { siteConfig } from "../../config/siteConfig";

export default function ReachUsGrid() {
  // Order matters here: [top, left, right, bottom].
  const pills = [
    {
      // TOP — the address is the longest value, so it gets the
      // widest single-pill row instead of being squeezed to one
      // side of a 2-column layout.
      icon: FaLocationDot,
      label: "Our Location",
      value: siteConfig.address.full,
      // No physical booking link for an address — points to the
      // LocationMap section further down the same page instead.
      href: "#location",
    },
    {
      // LEFT
      icon: FaPhone,
      label: "Call Us",
      value: siteConfig.contact.phone,
      href: `tel:${siteConfig.contact.phoneRaw}`,
    },
    {
      // RIGHT
      icon: FaWhatsapp,
      label: "WhatsApp",
      value: siteConfig.contact.whatsapp,
      href: `https://wa.me/${siteConfig.contact.whatsappRaw}`,
    },
    {
      // BOTTOM
      icon: FaEnvelope,
      label: "Email Us",
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
    },
  ];

  return (
    <section className="sm:py-10 md:py-1 ">
      <Container>
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-center mb-5 sm:mb-6 lg:mb-10">
          Reach Us Directly
        </h2>

        <ParallaxPills pills={pills} className="max-w-xl mx-auto " />
      </Container>
    </section>
  );
}
