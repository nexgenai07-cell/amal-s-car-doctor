/**
 * ================================================================
 * AboutUs.jsx
 * ================================================================
 * The About Us page. Assembles all sections in the order seen in
 * the design:
 * 1. AboutHero
 * 2. JourneyTimeline
 * 3. TeamGrid
 * 4. WorkshopVideoSection
 * 5. CertificationBadges
 * 6. BigStatement
 * ================================================================
 */
import AboutHero from "../components/about/AboutHero";
import JourneyTimeline from "../components/about/JourneyTimeline";
import TeamGrid from "../components/about/TeamGrid";
import WorkshopVideoSection from "../components/about/WorkshopVideoSection";
import CertificationBadges from "../components/about/CertificationBadges";
import BigStatement from "../components/about/BigStatement";

export default function AboutUs() {
  return (
    <>
      <AboutHero />
      <JourneyTimeline />
      <TeamGrid />
      <WorkshopVideoSection />
      <CertificationBadges />
      <BigStatement />
    </>
  );
}
