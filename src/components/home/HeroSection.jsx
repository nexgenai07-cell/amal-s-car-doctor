/**
 * ================================================================
 * HeroSection.jsx
 * ================================================================
 * The very first thing visitors see on the Home page.
 *
 * MATCHES THE DESIGN:
 * - Left side: small badge "PROCESSOR DIAGNOSTICS" -> big heading
 *   "We Don't Just Repair. We Diagnose." (with "Diagnose." in red)
 *   -> description paragraph -> two buttons (Book a Checkup /
 *   View Services) -> small "Certified: Master Techs" and
 *   "Equipment: OEM Diagnostic" info pair at the bottom
 * - Right side: the TelemetryWidget (live diagnostics panel)

 * ================================================================
 */

import { motion } from "motion/react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Container from "../layout/Container";
import TelemetryWidget from "./TelemetryWidget";
import { ROUTES } from "../../constants/routes";

export default function HeroSection() {
  return (
    <section className="pt-16 pb-20 lg:pt-24 lg:pb-28">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* ---------------- LEFT: TEXT CONTENT ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <Badge variant="outline">Processor Diagnostics</Badge>

            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight">
              We Don't Just Repair. We{" "}
              <span className="text-primary">Diagnose.</span>
            </h1>

            <p className="text-neutral text-base sm:text-lg max-w-lg font-body leading-relaxed">
              Advanced automotive care for Riyadh's premier vehicles. Utilizing
              state of the art telemetry and certified engineering to ensure
              your vehicle operates at peak performance.
            </p>

            {/* ---------------- CTA BUTTONS ---------------- */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button variant="primary" size="md" to={ROUTES.CONTACT}>
                Book a Checkup
              </Button>
              <Button variant="outline" size="md" to={ROUTES.SERVICES}>
                View Services
              </Button>
            </div>

            {/* ---------------- CERTIFIED / EQUIPMENT INFO PAIR ---------------- */}
            <div className="flex items-center gap-10 pt-6 border-t border-tertiary/20 mt-4">
              <div className="flex flex-col gap-1">
                <span className="font-label text-[10px] uppercase tracking-wider text-neutral">
                  Certified
                </span>
                <span className="font-body text-sm text-white">
                  Master Techs
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label text-[10px] uppercase tracking-wider text-neutral">
                  Equipment
                </span>
                <span className="font-body text-sm text-white">
                  OEM Diagnostic
                </span>
              </div>
            </div>
          </motion.div>

          {/* ---------------- RIGHT: TELEMETRY WIDGET ---------------- */}
          <div className="flex justify-center lg:justify-end">
            <TelemetryWidget />
          </div>
        </div>
      </Container>
    </section>
  );
}
