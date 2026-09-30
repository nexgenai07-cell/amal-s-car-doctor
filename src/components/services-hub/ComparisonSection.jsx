/**
 * ================================================================
 * ComparisonSection.jsx
 * ================================================================
 * "Popular Comparisons" — 3 pricing/duration cards, each showing a
 * row-by-row breakdown (Duration, Price Range, Includes Inspection).
 * ================================================================
 */
import { motion } from "motion/react";
import Container from "../layout/Container";
import { comparisons } from "../../data/comparisons";

// Reusable row inside each comparison card: label on the left,
// value on the right, separated by a thin bottom border. When
// "negotiable" is true, a small red-bordered "Negotiable" tag is
// shown right before the value.
function ComparisonRow({ label, value, negotiable = false }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1 border-b border-tertiary/20 last:border-0">
      <span className="text-neutral text-sm">{label}</span>
      <span className="flex flex-wrap items-center justify-end gap-2">
        {negotiable && (
          <span className="font-label text-[10px] leading-none uppercase tracking-wide text-primary border border-primary rounded px-1.5 py-0.5">
            Negotiable
          </span>
        )}
        <span className="font-label text-sm text-white font-medium">
          {value}
        </span>
      </span>
    </div>
  );
}

export default function ComparisonSection() {
  return (
    <section className="py-5 lg:py-8 bg-secondary/30">
      <Container>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-center mb-12">
          Popular Comparisons
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {comparisons.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-secondary border border-tertiary/20 rounded-xl p-6"
            >
              <h3 className="font-heading font-semibold text-base text-center mb-3 pb-3 border-b border-tertiary/20">
                {item.title}
              </h3>
              <ComparisonRow label="Duration" value={item.duration} />
              <ComparisonRow
                label="Price Range"
                value={item.priceRange}
                negotiable
              />
              <ComparisonRow
                label="Includes Inspection"
                value={item.inspection}
              />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
