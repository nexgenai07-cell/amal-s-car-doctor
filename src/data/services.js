/**
 * Central data source for every service the workshop offers.
 *
 * This feeds the Services Hub page's sidebar + detail-panel
 * explorer. Each entry carries everything the explorer needs to
 * render that service on its own, without a separate detail page:
 *
 * - group        : which sidebar section the service is listed under
 *                  ("Diagnostics" / "Maintenance & Repair" / "Electrical")
 * - description  : the paragraph shown in the detail panel
 * - symptoms     : the "Are You Experiencing These?" checklist items
 */
import {
  FaGears,
  FaCarSide,
  FaSnowflake,
  FaOilCan,
  FaBolt,
  FaCarBurst,
  FaFilter,
  FaWind,
  FaGaugeHigh,
} from "react-icons/fa6";

// The 3 sidebar section labels used to group services in the
// Services Hub explorer.
export const SERVICE_GROUPS = {
  DIAGNOSTICS: "Diagnostics",
  MAINTENANCE: "Maintenance & Repair",
  ELECTRICAL: "Electrical",
};

export const services = [
  {
    slug: "engine-diagnostics",
    title: "Engine Diagnostics",
    icon: FaGears,
    group: SERVICE_GROUPS.DIAGNOSTICS,
    description:
      "Modern vehicles are highly computerized. Our advanced engine diagnostic service utilizes state-of-the-art telemetry and scanning tools to interface directly with your vehicle's Engine Control Unit (ECU). We perform comprehensive error code analysis, live data-stream monitoring, and performance tuning to pinpoint issues before they escalate into catastrophic failures.",
    symptoms: [
      "Check Engine Light On",
      "Loss of Power or Acceleration",
      "Poor Fuel Economy",
      "Strange Engine Noises or Misfires",
    ],
  },
  {
    slug: "brake-service",
    title: "Brake Service & Repair",
    icon: FaCarSide,
    group: SERVICE_GROUPS.MAINTENANCE,
    description:
      "Your brakes are your vehicle's single most important safety system. We inspect pads, rotors, calipers, and fluid on every visit, then resurface or replace only what's actually worn — using OEM-grade parts throughout — to restore full, confident stopping power.",
    symptoms: [
      "Squeaking or Grinding When Braking",
      "Vehicle Pulls to One Side",
      "Soft or Spongy Brake Pedal",
      "Vibration Through the Steering Wheel",
    ],
  },
  {
    slug: "oil-change",
    title: "Oil Change",
    icon: FaOilCan,
    group: SERVICE_GROUPS.MAINTENANCE,
    description:
      "Fresh oil is the foundation of engine health. We use premium full-synthetic oil and OEM filters, and every oil change includes a quick multipoint check of fluid levels and belts, so small issues get caught long before they become expensive ones.",
    symptoms: [
      "Oil Change Warning Light Is On",
      "Engine Oil Looks Dark or Gritty",
      "Louder Engine Noise Than Usual",
      "It's Been Over 5,000 Miles Since Your Last Change",
    ],
  },
  {
    slug: "steering-suspension",
    title: "Steering & Suspension Repair",
    icon: FaCarBurst,
    group: SERVICE_GROUPS.MAINTENANCE,
    description:
      "Feeling every bump in the road, or a wheel that pulls under its own weight, usually means your steering or suspension needs attention. We inspect shocks, struts, tie rods, and alignment to restore a smooth, controlled, and safe ride.",
    symptoms: [
      "Excessive Bouncing After a Bump",
      "Vehicle Pulls to One Side While Driving",
      "Uneven Tire Wear",
      "Clunking or Knocking Noise Over Bumps",
    ],
  },
  {
    slug: "air-cabin-filter",
    title: "Air & Cabin Filter Replacement",
    icon: FaFilter,
    group: SERVICE_GROUPS.MAINTENANCE,
    description:
      "A clogged engine air filter chokes performance and fuel economy, and a dirty cabin filter fills your interior with dust, pollen, and odors. We replace both with OEM-spec filters, keeping your engine breathing clean and your cabin air fresh.",
    symptoms: [
      "Reduced Fuel Efficiency",
      "Musty or Dusty Smell From the Vents",
      "Weak Airflow From the AC or Heater",
      "Engine Feels Sluggish on Acceleration",
    ],
  },
  {
    slug: "ac-repair",
    title: "AC Repair",
    icon: FaSnowflake,
    group: SERVICE_GROUPS.MAINTENANCE,
    description:
      "Weak or warm airflow in a Riyadh summer isn't optional to fix. We diagnose the complete AC system — refrigerant charge, compressor, condenser, and leaks — and restore genuinely ice-cold, reliable performance, not just a temporary recharge.",
    symptoms: [
      "AC Blowing Warm or Weak Air",
      "Strange Smell From the Vents",
      "Unusual Noise When AC Is Running",
      "Visible Refrigerant Leak Under the Vehicle",
    ],
  },
  {
    slug: "exhaust-repair",
    title: "Exhaust Repair",
    icon: FaWind,
    group: SERVICE_GROUPS.MAINTENANCE,
    description:
      "A failing exhaust system costs you power, fuel economy, and can let dangerous fumes into the cabin. We inspect the full run — manifold, catalytic converter, muffler, and pipes — and repair or replace exactly what's compromised.",
    symptoms: [
      "Loud Rumbling or Rattling Noise",
      "Smell of Exhaust Fumes Inside the Cabin",
      "Visible Rust or Hanging Pipe Sections",
      "Reduced Power or Fuel Economy",
    ],
  },
  {
    slug: "transmission-repair",
    title: "Transmission Repair",
    icon: FaGaugeHigh,
    group: SERVICE_GROUPS.MAINTENANCE,
    description:
      "Rough or delayed shifting is a warning sign, not something to drive through. We diagnose automatic and manual transmissions with the same precision telemetry used on the engine, then service or repair the exact fault before it becomes a full rebuild.",
    symptoms: [
      "Delayed or Rough Gear Shifts",
      "Slipping Gears While Driving",
      "Burning Smell or Leaking Fluid",
      "Whining, Clunking, or Humming Noises",
    ],
  },
  {
    slug: "battery-electrical",
    title: "Battery & Electrical",
    icon: FaBolt,
    group: SERVICE_GROUPS.ELECTRICAL,
    description:
      "From a dead battery to intermittent dashboard faults, our technicians trace and repair even the most complex wiring, battery, and alternator issues — with proper load-testing and circuit diagnostics, not guesswork part-swapping.",
    symptoms: [
      "Battery Dies Frequently or Won't Hold Charge",
      "Dashboard Warning Lights Flicker or Stay On",
      "Car Struggles to Start",
      "Power Windows or Locks Stop Responding",
    ],
  },
];

// Feeds the Home page's ServicesOrbitDiagram: the center node plus
// exactly 5 satellites, matching that diagram's fixed 5-position
// layout.
export const centerService = services[0];
export const orbitSatelliteServices = services.slice(1, 6);

// Looks up a single service by its slug. Used by the Services Hub
// page to resolve the ?service=<slug> query parameter into a full
// service object.
export const getServiceBySlug = (slug) =>
  services.find((service) => service.slug === slug);

// Fixed display order for the 3 sidebar sections, independent of the
// order services happen to appear in the array above.
const GROUP_ORDER = [
  SERVICE_GROUPS.DIAGNOSTICS,
  SERVICE_GROUPS.MAINTENANCE,
  SERVICE_GROUPS.ELECTRICAL,
];

// Groups the flat `services` array into the 3 sidebar sections
// (Diagnostics -> Maintenance & Repair -> Electrical) for the
// Services Hub explorer's sidebar.
export const groupedServices = GROUP_ORDER.map((group) => ({
  group,
  items: services.filter((service) => service.group === group),
})).filter((section) => section.items.length > 0);
