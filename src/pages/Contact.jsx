/**
 * ================================================================
 * Contact.jsx
 * ================================================================
 * The Contact Us page. Assembles all sections in this order:
 *
 * 1. ContactHero      -> "Get In Touch" / "Book Your Appointment"
 *                         intro, centered and full-width, matching
 *                         the About Us / Gallery page hero style.
 *                         This is always the first thing visitors
 *                         see on the page.
 * 2. Form + Map       -> ONE highlighted "glass" card (matching the
 *                         same frosted-glass recipe used by
 *                         CTABanner / WorkingHoursCard) holding the
 *                         booking form on the left and a real
 *                         interactive Google Maps embed (pinned to
 *                         the exact workshop coordinates, fully
 *                         zoomable) on the right. Side-by-side from
 *                         the "lg" breakpoint up; stacked (form,
 *                         then map) on mobile/tablet. The whole
 *                         card is width-capped and centered so
 *                         there's visible breathing room on both
 *                         sides, instead of stretching edge-to-edge.
 * 3. ReachUsGrid       -> Call / WhatsApp / Email quick-contact
 *                         cards.
 * 4. WorkingHoursCard  -> opening hours + live open/closed status.
 * ================================================================
 */
import Container from "../components/layout/Container";
import ContactHero from "../components/contact/ContactHero";
import BookingForm from "../components/contact/BookingForm";
import LocationMap from "../components/contact/LocationMap";
import ReachUsGrid from "../components/contact/ReachUsGrid";
import WorkingHoursCard from "../components/contact/WorkingHoursCard";

export default function Contact() {
  return (
    <>
      {/* Section 1: page intro / hero — always first on the page */}
      <ContactHero />

      {/* Section 2: ONE highlighted glass card holding the form
          (left) and the real map (right). "max-w-4xl mx-auto" caps
          the card's width and centers it inside the page container,
          so there's visible left/right space around it rather than
          the card touching the container's own edges. "items-
          stretch" makes the map column match the form column's
          height. Single column (form, then map) below "lg". */}
      <section className="pb-16">
        <Container>
          <div className="mx-auto max-w-4xl rounded-3xl border border-tertiary/25 bg-secondary/40 backdrop-blur-xl shadow-[0_0_50px_-15px_rgba(0,0,0,0.7)] p-5 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <BookingForm />
              <LocationMap />
            </div>
          </div>
        </Container>
      </section>

      {/* Remaining sections stay in their original order */}
      <ReachUsGrid />
      <WorkingHoursCard />
    </>
  );
}
