/**
 * The right-hand detail card inside the Services Hub explorer. Shows
 * whichever service is currently selected in ServicesSidebar: an
 * icon and title, a description paragraph, an "Are You Experiencing
 * These?" symptom checklist, and two action buttons ("Book This
 * Service" / "Call Now").
 *
 * This is its own distinct, elevated card (solid background, border,
 * rounded corners, and drop shadow) rather than a plain panel, so it
 * visually reads as "a card" sitting next to the plain sidebar list
 * inside the shared explorer shell (see ServicesExplorer). It grows
 * to fill the shell's full height (`flex-1`) and scrolls its own
 * content internally if a particular service's description and
 * symptom list run taller than the available space, keeping the
 * shell itself at a fixed height instead of stretching the page.
 *
 * Uses Motion's AnimatePresence, keyed on the service's slug, so
 * switching services replaces the content with a springy "flying
 * in" entrance (scaling and lifting into place) instead of a flat
 * cross-fade, making each selection feel alive.
 */
import { AnimatePresence, motion } from "motion/react";
import { FaCircleCheck } from "react-icons/fa6";
import IconBox from "../ui/IconBox";
import Button from "../ui/Button";
import { ROUTES } from "../../constants/routes";
import { siteConfig } from "../../config/siteConfig";

/**
 * @param {object} service - the currently active service object
 *   (slug, title, icon, description, symptoms)
 */
export default function ServiceDetailPanel({ service }) {
  return (
    <div className="service-detail-card relative flex-1 overflow-y-auto rounded-2xl border border-tertiary/20 bg-secondary p-6 sm:p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={service.slug}
          initial={{ opacity: 0, y: 28, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="flex flex-col gap-6"
        >
          {/* Icon and title */}
          <div className="flex items-center gap-4">
            <IconBox icon={service.icon} variant="filled" size="md" />
            <h2 className="font-heading font-bold text-2xl sm:text-3xl">
              {service.title}
            </h2>
          </div>

          {/* Description paragraph */}
          <p className="max-w-2xl text-sm leading-relaxed text-neutral sm:text-base">
            {service.description}
          </p>

          {/* Symptom checklist */}
          <div>
            <p className="mb-4 font-label text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Are You Experiencing These?
            </p>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {service.symptoms.map((symptom) => (
                <li
                  key={symptom}
                  className="flex items-start gap-2.5 text-sm text-white/90"
                >
                  <FaCircleCheck className="mt-0.5 shrink-0 text-primary" />
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action buttons */}
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" size="md" to={ROUTES.CONTACT}>
              Book This Service
            </Button>
            <Button
              variant="outline"
              size="md"
              href={`tel:${siteConfig.contact.phoneRaw}`}
              showArrow={false}
            >
              Call Now
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
