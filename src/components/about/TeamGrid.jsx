/**
 * ================================================================
 * TeamGrid.jsx
 * ================================================================
 * "Meet the Specialists" section on the About Us page.
 *
 * Previously a static 2x4 grid of team photos -- now a fanned
 * CardSpread deck (see src/components/ui/CardSpread.jsx) that
 * spreads open around whichever specialist the visitor is
 * hovering, keyboard-focusing, or tapping, revealing their bio.
 * The component is still called "TeamGrid" (rather than being
 * renamed) purely so nothing else importing it elsewhere has to
 * change -- its actual layout is the fan described above.
 * ================================================================
 */
import Container from "../layout/Container";
import CardSpread from "../ui/CardSpread";
import TeamMemberCard from "./TeamMemberCard";
import { team } from "../../data/team";

export default function TeamGrid() {
  // CardSpread's `cards` prop just needs an array of plain data --
  // we hand it the raw team member objects plus a stable `id` (the
  // name) and an accessible label read out by screen readers when a
  // card gains keyboard focus.
  const cards = team.map((member) => ({
    id: member.name,
    member,
    ariaLabel: `${member.name}, ${member.role}`,
  }));

  return (
    <section className="py-10 lg:py-10 bg-secondary/30">
      <Container>
        {/* Heading kept in the same plain h2 style used by the
            sibling About Us sections (JourneyTimeline, Certification
            Badges) so this section reads as part of the same page,
            not a mismatched one-off design. */}
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-center mb-1">
          Meet the Specialists
        </h2>
        <p className="mx-auto mb-1 max-w-md text-center text-xs text-neutral sm:text-sm">
          Four master technicians, four different specialties -- hover or tap a
          card to see who's behind the diagnostics.
        </p>

        {/* The fan itself. Tuned (vs. the reference component's own
            7-image demo defaults) for exactly 4 specialists and this
            brand's card proportions:
              - a wider/taller card than the demo's so a name, role
                badge and bio all comfortably fit
              - a gentler arc (42° across 4 cards is roughly the same
                per-card spacing as the reference demo's 88° across 7)
                so it reads as a refined, professional reveal rather
                than a playful full fan-out
              - a larger `radius` so that gentler arc still produces
                a visibly curved, elegant sweep instead of a flat row
              - `pushReach: 1` since with only 4 cards, only the
                immediate neighbour on each side needs to react to a
                hover at all */}
        <CardSpread
          cards={cards}
          cardWidth={190}
          cardHeight={260}
          cardRadius={18}
          radius={560}
          arc={42}
          shadow={0.34}
          lift={32}
          push={5.5}
          pushReach={1}
          restOpacity={0.5}
          stiffness={170}
          damping={18}
          mass={0.9}
          stagger={0.1}
          fit={true}
          maxScale={1}
          interactive={true}
          className="mx-auto max-w-3xl"
          renderCard={(card, { isActive }) => (
            <TeamMemberCard {...card.member} isActive={isActive} />
          )}
        />
      </Container>
    </section>
  );
}
