/**
 * ================================================================
 * Home.jsx
 * ================================================================
 * The Home page — assembles every section in the exact order seen
 * in the design:
 * 1. HeroSection
 * 2. DiagnosticStatusBar (thin strip)
 * 3. ServicesOrbitDiagram
 * 4. WhyChooseUs
 * 5. StatsSection
 * 6. TestimonialsSection
 * 7. CTABanner ("Your Car Deserves to Run Like New Again")
 *    -> Redesigned as a glassy, gradient-accented CTA card. All
 *       the text below is real Amal Car's Doctor content (free
 *       diagnostic call, transparent pricing, honest timelines),
 *       not placeholder copy.
 * ================================================================
 */
import HeroSection from "../components/home/HeroSection";
import DiagnosticStatusBar from "../components/home/DiagnosticStatusBar";
import ServicesOrbitDiagram from "../components/home/ServicesOrbitDiagram";
import WhyChooseUs from "../components/home/WhyChooseUs";
import StatsSection from "../components/home/StatsSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import CTABanner from "../components/shared/CTABanner";

export default function Home() {
  return (
    <>
      <HeroSection />
      <DiagnosticStatusBar />
      <ServicesOrbitDiagram />
      <WhyChooseUs />
      <StatsSection />
      <TestimonialsSection />

      {/* ----------------------------------------------------------
          FINAL CTA — the last thing a visitor sees before leaving
          the homepage, so it needs to be the most persuasive
          section on the page.

          heading + accent:
            "Your Car Deserves to" stays plain white, while
            "Run Like New Again" is painted with the brand's red
            gradient — same visual trick as the reference design's
            "Become Reality" gradient text, but in OUR brand color.

          subheading:
            Short, punchy 3-word promise line — free inspection,
            transparent pricing, honest timeline — no phone call or
            long paragraph needed, just the 3 things customers care
            about most before they trust a workshop with their car.

          buttonText / secondaryButtonText:
            Matches the reference image's two-button pattern:
            a strong gradient primary action ("Book Free Checkup")
            next to a lower-commitment secondary action
            ("Explore Services") for visitors who aren't ready to
            book yet and want to browse services first.
      ---------------------------------------------------------- */}
      <CTABanner
        heading="Your Car Deserves to Run Like New Again"
        accent="Run Like New Again"
        subheading="Free inspection, transparent pricing, honest timeline — no guesswork, no hidden charges."
        buttonText="Book Now"
        secondaryButtonText="Explore Services"
      />
    </>
  );
}
