/**
 * Combines ServicesSidebar (the grouped/scrollable service list) and
 * ServiceDetailPanel (the active service's own elevated detail card)
 * into the two-column layout used on the Services Hub page.
 *
 * Layout:
 * The whole explorer is centered inside its section with its own
 * max-width (narrower than the page's full Container), so there is
 * always visible breathing room on the left and right even on very
 * wide screens — it never stretches edge-to-edge.
 *
 * The outer frame is a softly-highlighted shell (a faint border and
 * tinted background) that both columns sit inside, with padding
 * around them so the shell reads as one connected surface. Within
 * that shell, the detail panel on the right is its OWN distinct
 * card (solid background, border, and drop shadow), so it visually
 * stands apart from the plain sidebar list next to it and reads
 * unmistakably as "a card". On large screens the shell has a fixed
 * height, and because flex containers stretch their children by
 * default, the sidebar and the detail card automatically match that
 * same height and occupy equal vertical space.
 */
import ServicesSidebar from "./ServicesSidebar";
import ServiceDetailPanel from "./ServiceDetailPanel";

/**
 * @param {Array<{group: string, items: Array}>} groupedServices
 * @param {object} activeService - the currently selected service object
 * @param {(slug: string) => void} onSelect
 */
export default function ServicesExplorer({
  groupedServices,
  activeService,
  onSelect,
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-[28px] border border-tertiary/20 bg-secondary/30 p-4 sm:p-6 lg:h-160 lg:flex-row lg:gap-8 lg:p-8">
      <ServicesSidebar
        groupedServices={groupedServices}
        activeSlug={activeService.slug}
        onSelect={onSelect}
      />
      <ServiceDetailPanel service={activeService} />
    </div>
  );
}
