/**
 * ================================================================
 * galleryCaseFiles.js  (UPDATED — case-6.jpg added, all 6 cases
 * now have real photos)
 * ================================================================
 */

// All 6 case file photos
import case1 from "../assets/images/gallery/case-1.jpg";
import case2 from "../assets/images/gallery/case-2.jpg";
import case3 from "../assets/images/gallery/case-3.jpg";
import case4 from "../assets/images/gallery/case-4.jpg";
import case5 from "../assets/images/gallery/case-5.jpg";
import case6 from "../assets/images/gallery/case-6.jpg";

// Before/after photos used by the "Transformations" slider section
import transformationBefore from "../assets/images/gallery/transformation-before.jpg";
import transformationAfter from "../assets/images/gallery/transformation-after.jpg";

export const galleryCaseFiles = [
  {
    id: "case-1",
    title: "911 Turbo S Performance Tune",
    image: case1,
    problem: "Loss of boost pressure at high RPMs",
    solution: "Upgraded turbo actuators & custom ECU remap",
    result: "Optimal boost restored, +45hp gain",
  },
  {
    id: "case-2",
    title: "M5 Electrical Diagnostics",
    image: case2,
    problem: "Intermittent dashboard failure & sensor faults",
    solution: "Deep CAN bus analysis and wiring harness repair",
    result: "All systems nominal, no further faults",
  },
  {
    id: "case-3",
    title: "Huracan Brake Upgrade",
    image: case3,
    problem: "Brakes fade during track sessions",
    solution: "Installed carbon-ceramic rotors and racing pads",
    result: "Consistent stopping power under extreme load",
  },
  {
    id: "case-4",
    title: "G-Wagon Engine Restoration",
    image: case4,
    problem: "Severe engine overheating under load",
    solution: "Complete cooling system overhaul, new radiator & water pump",
    result: "Operating temps stabilized, reliable performance",
  },
  {
    id: "case-5",
    title: "RS7 Suspension Overhaul",
    image: case5,
    problem: "Air suspension failure, uneven ride height",
    solution: "Replaced adaptive struts and recalibrated system",
    result: "Factory ride quality restored",
  },
  {
    id: "case-6",
    title: "Range Rover Transmission Rebuild",
    image: case6, // was null, now the real imported photo — all 6 cases complete
    problem: "Harsh shifting and slipping gears",
    solution: "Complete transmission teardown and rebuild",
    result: "Smooth shifting, fully functional drivetrain",
  },
];

// The before/after image pair + caption for the "Transformations"
// section's BeforeAfterSlider on the Gallery page.
export const transformationImages = {
  before: transformationBefore,
  after: transformationAfter,
};
export const transformationCaption =
  "Full exterior detailing and paint correction";
