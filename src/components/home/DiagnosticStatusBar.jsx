/**
 * ================================================================
 * DiagnosticStatusBar.jsx
 * ================================================================
 * The thin strip directly below the hero section showing 4 live-
 * style status bars: Engine, Brakes, Battery, AC Unit — each with
 * a percentage. Matches the "SYS. ENGINE 91%" style readout row
 * seen right under the hero in the design.
 *
 * MODERNIZED VERSION:
 * - Each bar now gets its own icon (see statusItems below) instead
 *   of being plain text, and fades/slides in on scroll.
 * - Responsive: 1 column on mobile, 2 on tablet, 4 on desktop.
 *
 * NOTE: Percentages below are read from the design mockup. If the
 * client provides exact real diagnostic values later, only this
 * array needs to change.
 * ================================================================
 */
import { motion } from "motion/react";
import {
  FaGaugeHigh,
  FaCircleStop,
  FaCarBattery,
  FaSnowflake,
} from "react-icons/fa6";
import Container from "../layout/Container";
import ProgressBar from "../ui/ProgressBar";

const statusItems = [
  { icon: FaGaugeHigh, label: "SYS. ENGINE", percentage: 91 },
  { icon: FaCircleStop, label: "SYS. BRAKES", percentage: 88 },
  { icon: FaCarBattery, label: "SYS. BATTERY", percentage: 95 },
  { icon: FaSnowflake, label: "SYS. AC UNIT", percentage: 90 },
];

export default function DiagnosticStatusBar() {
  return (
    <div className="border-y border-tertiary/20 bg-secondary/30 py-6 sm:py-7">
      <Container>
        {/* ---- Status bars ---- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="
            grid grid-cols-1 gap-6
            sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6
            lg:grid-cols-4 lg:gap-x-8
          "
        >
          {statusItems.map((item) => (
            <ProgressBar
              key={item.label}
              icon={item.icon}
              label={item.label}
              percentage={item.percentage}
            />
          ))}
        </motion.div>
      </Container>
    </div>
  );
}
