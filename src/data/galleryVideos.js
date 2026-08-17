/**
 * ================================================================
 * galleryVideos.js  (UPDATED — real video file paths added)
 * ================================================================
 * The 4 "Behind the Repairs" video entries.
 *
 * IMPORTANT: videos live in the public/videos/ folder, NOT
 * src/assets/. This means we do NOT import them like images —
 * we just write the path as a plain string starting with "/",
 * since anything in public/ is served exactly as-is from the site's
 * root URL (public/videos/x.mp4 becomes "/videos/x.mp4" in the browser).
 * ================================================================
 */
export const galleryVideos = [
  {
    id: "video-1",
    title: "Brake Overhaul in 60 Seconds",
    thumbnail: null, // no separate thumbnail image provided yet
    videoUrl: "/videos/brake-overhaul.mp4", // was empty string, now points to the real file
  },
  {
    id: "video-2",
    title: "Engine Rebuild Timelapse",
    thumbnail: null,
    videoUrl: "/videos/engine-rebuild.mp4",
  },
  {
    id: "video-3",
    title: "Precision Alignment Walkthrough",
    thumbnail: null,
    videoUrl: "/videos/alignment-walkthrough.mp4",
  },
  {
    id: "video-4",
    title: "Performance Tuning Session",
    thumbnail: null,
    videoUrl: "/videos/tuning-session.mp4",
  },
];

// A separate "workshop tour" video (used by WorkshopVideoSection on
// the About page), also served straight from public/videos/.
export const workshopTourVideoUrl = "/videos/workshop-tour.mp4";
