/**
 * ================================================================
 * team.js  (UPDATED — real team photos added)
 * ================================================================
 * The 4 specialists shown in the About page's "Meet the Specialists"
 * section.
 *
 * NOTE ON IMAGE FILE NAMES: the actual uploaded photo files are
 * generically named (imageone.jpg, imagetwo.jpg, etc.) rather than
 * named per-person, so we assign them here in order:
 * imageone -> Tariq, imagetwo -> Omar, imagethree -> Kareem,
 * imagefour -> Fahad. If the photos need to be swapped to different
 * people, just change which import goes with which team member below.
 * ================================================================
 */

// Importing images (not videos) from src/assets/ means Vite will
// process/optimize them at build time, and this import gives us
// back the final, correct URL to use in the "photo" field below.
import imageone from "../assets/images/team/imageone.jpg";
import imagetwo from "../assets/images/team/imagetwo.jpg";
import imagethree from "../assets/images/team/imagethree.jpg";
import imagefour from "../assets/images/team/imagefour.jpg";

export const team = [
  {
    name: "Tariq Al-Faisal",
    role: "Engine Specialist",
    bio: "Master of high-performance engine diagnostics and rebuilds.",
    photo: imageone, // was null, now points to the real imported photo
  },
  {
    name: "Omar Yassin",
    role: "Electrical Expert",
    bio: "Specialist in complex wiring, hybrid, and EV systems.",
    photo: imagetwo,
  },
  {
    name: "Kareem Naser",
    role: "Diagnostics Lead",
    bio: "Precision telemetry and advanced fault-tracing expert.",
    photo: imagethree,
  },
  {
    name: "Fahad Saad",
    role: "AC & Cooling Expert",
    bio: "Ensuring optimal climate control for every vehicle.",
    photo: imagefour,
  },
];
