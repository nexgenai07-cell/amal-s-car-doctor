/**
 * ================================================================
 * CaseFilesGrid.jsx
 * ================================================================
 * The "Case Files" section on the Gallery page. Presents all case
 * files as a 3D skewed carousel (see src/components/ui/SkewedCarousel.jsx)
 * instead of a static grid: the centered case sits sharp and
 * full-size, while the surrounding cases recede to either side,
 * tilted and scaled down -- exactly the interaction pattern of
 * pro.reactbits.dev's "Skewed Carousel" component.
 *
 * WHY `initialIndex` STARTS IN THE MIDDLE:
 * Opening the section with the middle case active immediately shows
 * receding neighbours on BOTH sides, so the coverflow effect reads
 * clearly the moment the section scrolls into view, rather than
 * only revealing one side of the deck.
 * ================================================================
 */
import Container from "../layout/Container";
import SkewedCarousel from "../ui/SkewedCarousel";
import CaseFileCard from "./CaseFileCard";
import { galleryCaseFiles } from "../../data/galleryCaseFiles";

export default function CaseFilesGrid() {
  return (
    <section className="py-16 lg:py-20 overflow-hidden">
      <Container>
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-center mb-4">
          Case Files
        </h2>
        <p className="text-neutral text-sm sm:text-base text-center max-w-xl mx-auto mb-12">
          Drag, swipe, or use the arrows to browse real repair stories from the
          workshop floor.
        </p>
      </Container>

      {/* Rendered OUTSIDE <Container> (full-bleed) so the receding
          side cards have room to extend toward the edge of the
          viewport instead of being clipped by the page's max-width
          content column. */}
      <div className="px-4 sm:px-6 lg:px-8">
        <SkewedCarousel
          items={galleryCaseFiles}
          initialIndex={Math.floor(galleryCaseFiles.length / 2)}
          cardWidth={300}
          // Taller than the reference's plain image-only "3 / 4" --
          // our slides also carry a title + 3 text rows below the
          // photo, so the box needs extra height to fit that
          // content in full (see CaseFileCard.jsx) without clipping
          // the last row on the longer case files.
          aspectRatio="5 / 9"
          rotation={48}
          inactiveScale={0.82}
          perspective={1000}
          borderRadius={20}
          titleBlur={3}
          speed={1}
          loop
          autoplay
          autoplayDelay={3200}
          enableDrag
          enableKeyboard
          showControls
          showDots
          renderItem={(caseFile, { isActive, blurAmount }) => (
            <CaseFileCard
              {...caseFile}
              isActive={isActive}
              blurAmount={blurAmount}
            />
          )}
        />
      </div>
    </section>
  );
}
