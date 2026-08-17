/**
 * ================================================================
 * StatsSection.jsx
 * ================================================================
 * The 4-stat row on the Home page: 12,000+ Cars Serviced,
 * 15 Years Experience, 98% Client Satisfaction, 24/7 Emergency Support.
 *
 * RESPONSIVE GRID:
 * - 2 columns on mobile (keeps each stat wide enough to breathe),
 *   with extra vertical gap since there's no card border to
 *   separate wrapped rows.
 * - 4 columns from sm breakpoint upward, with a thin vertical
 *   divider between columns -- each StatCard has no card/border of
 *   its own (see StatCard.jsx), so this divider is what visually
 *   separates the 4 stats into one tied-together strip.
 * ================================================================
 */
import Container from "../layout/Container";
import StatCard from "../shared/StatCard";
import { homeStats } from "../../data/stats";

export default function StatsSection() {
  return (
    <section className="border-y border-tertiary/20 py-8 lg:py-10">
      <Container>
        <div
          className="
            grid grid-cols-2 gap-y-6 gap-x-4
            sm:grid-cols-4 sm:gap-x-6 sm:divide-x sm:divide-tertiary/20
          "
        >
          {homeStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </Container>
    </section>
  );
}
