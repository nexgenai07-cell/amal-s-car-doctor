/**
 * ================================================================
 * TelemetryWidget.jsx
 * ================================================================
 * The small "live diagnostics" panel shown on the RIGHT side of the
 * Home page hero section in the design. It shows:
 * - A green pulsing dot + "TELEMETRY LINK ACTIVE" status text
 * - Today's date
 * - A simple car silhouette illustration (SVG, drawn with CSS-var
 *   colors so it themes correctly)
 * - A bottom readout row: diagnostic code + engine status +
 *   version number + garage ID (matches the "techy dashboard" feel)
 *
 * This is a purely decorative/illustrative component — no real data
 * is being fetched, it just recreates the visual from the design.
 * ================================================================
 */

import { motion } from "motion/react";

export default function TelemetryWidget() {
  // Today's date, formatted like "25.02.1998" style (DD.MM.YY) seen
  // in the design's top-right corner of the widget.
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}.${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}.${String(today.getFullYear()).slice(-2)}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-secondary border border-tertiary/30 rounded-2xl p-6 w-full max-w-md"
    >
      {/* ---------------- TOP ROW: STATUS + DATE ---------------- */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* Pulsing green dot indicates a "live" active connection */}
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full w-2 h-2 bg-success" />
          </span>
          <span className="font-label text-[10px] uppercase tracking-wider text-success">
            Telemetry Link Active
          </span>
        </div>
        <span className="font-label text-[10px] text-neutral">
          {formattedDate}
        </span>
      </div>

      {/* ---------------- CAR SILHOUETTE ILLUSTRATION ---------------- */}
      {/* Simple line-art car top-down silhouette, drawn in SVG so it
          scales cleanly and uses our theme colors. Matches the
          minimal wireframe car icon seen in the hero widget. */}
      <div className="flex items-center justify-center py-10 border-y border-tertiary/20 mb-4">
        <svg
          width="200"
          height="90"
          viewBox="0 0 200 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 60 Q20 40 45 38 L70 20 Q80 12 100 12 Q120 12 130 20 L155 38 Q180 40 180 60 L180 65 Q180 70 175 70 L160 70 Q158 78 148 78 Q138 78 136 70 L64 70 Q62 78 52 78 Q42 78 40 70 L25 70 Q20 70 20 65 Z"
            stroke="var(--color-tertiary)"
            strokeWidth="1.5"
          />
          <circle
            cx="52"
            cy="70"
            r="8"
            stroke="var(--color-primary)"
            strokeWidth="1.5"
          />
          <circle
            cx="148"
            cy="70"
            r="8"
            stroke="var(--color-primary)"
            strokeWidth="1.5"
          />
          <line
            x1="70"
            y1="20"
            x2="70"
            y2="38"
            stroke="var(--color-tertiary)"
            strokeWidth="1"
          />
          <line
            x1="130"
            y1="20"
            x2="130"
            y2="38"
            stroke="var(--color-tertiary)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* ---------------- BOTTOM READOUT ROW ---------------- */}
      <div className="flex items-center justify-between font-label text-[10px] text-neutral">
        <div className="flex flex-col gap-1">
          <span>01 | DIAGNOSTIC... ENGINE STATUS: OPTIMAL</span>
          <span>V 2.4.1</span>
        </div>
        <span className="text-primary">RIYADH_GARAGE_01</span>
      </div>
    </motion.div>
  );
}
