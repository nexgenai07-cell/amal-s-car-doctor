/**
 * ================================================================
 * Gallery.jsx
 * ================================================================
 * The Gallery page. Assembles all 4 sections in the order seen in
 * the design:
 * 1. GalleryHero
 * 2. CaseFilesGrid
 * 3. TransformationSection
 * 4. VideoGrid
 * ================================================================
 */
import GalleryHero from "../components/gallery/GalleryHero";
import CaseFilesGrid from "../components/gallery/CaseFilesGrid";
import TransformationSection from "../components/gallery/TransformationSection";
import VideoGrid from "../components/gallery/VideoGrid";

export default function Gallery() {
  return (
    <>
      <GalleryHero />
      <CaseFilesGrid />
      <TransformationSection />
      <VideoGrid />
    </>
  );
}
