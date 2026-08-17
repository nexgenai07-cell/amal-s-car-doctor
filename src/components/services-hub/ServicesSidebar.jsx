/**
 * The left-hand navigator inside the Services Hub explorer: services
 * grouped under small uppercase section labels ("DIAGNOSTICS",
 * "MAINTENANCE & REPAIR", "ELECTRICAL"), with the active service
 * picked out in red, an accent icon, and a left accent bar.
 *
 * This is a fully controlled component — it owns no state itself.
 * `activeSlug` and `onSelect` are passed down from the ServicesHub
 * page, so the sidebar and the detail panel next to it stay in sync
 * through one shared piece of state.
 *
 * Responsive behavior:
 * - Desktop (lg and up): a vertical list with group headings, sharing
 *   the explorer shell's fixed height with the detail card next to
 *   it. If the grouped list is taller than the space available, it
 *   scrolls internally with the scrollbar hidden (see the
 *   `services-sidebar-scroll` class in index.css) so the shell's
 *   surface stays visually clean instead of showing a scroll track.
 * - Mobile/tablet: the grouped layout collapses into a single
 *   horizontal, swipeable row of pills (ungrouped, icon + label).
 */
import { cn } from "../../utils/cn";

/**
 * @param {Array<{group: string, items: Array}>} groupedServices
 * @param {string} activeSlug
 * @param {(slug: string) => void} onSelect
 */
export default function ServicesSidebar({
  groupedServices,
  activeSlug,
  onSelect,
}) {
  return (
    <>
      {/* Desktop: grouped vertical list. The <nav> itself stretches
          to the full height of the shared explorer shell (matching
          the detail card's height); the inner div is the part that
          actually scrolls once the list outgrows that height. It
          sits plainly beside the detail card with no border of its
          own — the gap and the card's own border are what visually
          separate the two columns. */}
      <nav
        aria-label="Services"
        className="hidden shrink-0 lg:flex lg:w-64 lg:flex-col"
      >
        <div className="services-sidebar-scroll flex flex-1 flex-col gap-7 overflow-y-auto">
          {groupedServices.map((section) => (
            <div key={section.group} className="flex flex-col gap-1">
              <p className="mb-2 font-label text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral">
                {section.group}
              </p>
              {section.items.map((service) => {
                const isActive = service.slug === activeSlug;
                return (
                  <button
                    key={service.slug}
                    type="button"
                    onClick={() => onSelect(service.slug)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg py-2.5 pl-3 pr-2 text-left text-sm transition-all duration-200 cursor-pointer",
                      isActive
                        ? "border-l-2 border-primary bg-primary/10 font-medium text-primary"
                        : "border-l-2 border-transparent text-neutral hover:border-tertiary/50 hover:text-white",
                    )}
                  >
                    <service.icon
                      className={cn(
                        "shrink-0 text-sm transition-colors duration-200",
                        isActive
                          ? "text-primary"
                          : "text-tertiary group-hover:text-white",
                      )}
                    />
                    <span>{service.title}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile/tablet: horizontal scroll pills, ungrouped */}
      <nav
        aria-label="Services"
        className="lg:hidden -mx-4 mb-6 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6"
      >
        {groupedServices
          .flatMap((section) => section.items)
          .map((service) => {
            const isActive = service.slug === activeSlug;
            return (
              <button
                key={service.slug}
                type="button"
                onClick={() => onSelect(service.slug)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2.5 font-label text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer",
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-tertiary/30 bg-secondary text-neutral hover:border-tertiary/60 hover:text-white",
                )}
              >
                <service.icon className="text-sm" />
                {service.title}
              </button>
            );
          })}
      </nav>
    </>
  );
}
