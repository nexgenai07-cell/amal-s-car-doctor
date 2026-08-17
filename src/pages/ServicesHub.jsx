/**
 * The Services Hub page: a single-page explorer combining a grouped
 * sidebar of every service on the left with a live detail panel on
 * the right that swaps in place when a different service is
 * selected, so no page navigation is required to browse services.
 *
 * URL as the single source of truth:
 * The active service is derived directly from the URL's
 * `?service=<slug>` query parameter on every render, falling back to
 * the first service in the list if the parameter is missing or
 * doesn't match a real slug. This keeps the page shareable and
 * bookmarkable at whatever service is currently showing, and means
 * links built with getServiceLinkPath() (from the Footer or the Home
 * page's orbit diagram) land directly on the right service.
 *
 * Section order:
 * 1. ServicesHero
 * 2. ServicesExplorer (sidebar + detail panel)
 * 3. ComparisonSection
 */
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ServicesHero from "../components/services-hub/ServicesHero";
import ServicesExplorer from "../components/services-hub/ServicesExplorer";
import ComparisonSection from "../components/services-hub/ComparisonSection";
import Container from "../components/layout/Container";
import { services, groupedServices, getServiceBySlug } from "../data/services";

const DEFAULT_SLUG = services[0].slug;

export default function ServicesHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const explorerRef = useRef(null);

  // Resolve the active service directly from the URL, falling back
  // to the first service if the parameter is missing or invalid.
  const requestedSlug = searchParams.get("service");
  const activeSlug = getServiceBySlug(requestedSlug)
    ? requestedSlug
    : DEFAULT_SLUG;
  const activeService = getServiceBySlug(activeSlug);

  // Updates the URL to reflect the newly selected service, and
  // smoothly scrolls the explorer into view — used by the sidebar
  // inside ServicesExplorer when a different service is picked.
  function handleSelectService(slug) {
    setSearchParams({ service: slug }, { replace: true });
    explorerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <ServicesHero />

      <section ref={explorerRef} className="scroll-mt-24 pb-20 lg:pb-21">
        <Container>
          <ServicesExplorer
            groupedServices={groupedServices}
            activeService={activeService}
            onSelect={handleSelectService}
          />
        </Container>
      </section>

      <ComparisonSection />
    </>
  );
}
