/**
 * ================================================================
 * siteConfig.js
 * ================================================================
 * SINGLE SOURCE OF TRUTH for every piece of brand/business
 * information used across the entire website.
 *
 * RULE FOR THIS PROJECT:
 * Never hardcode the brand name, phone number, email, address, or
 * working hours directly inside any component (Navbar, Footer,
 * Contact page, etc). Always import it from this file instead.
 *
 * WHY: If the workshop changes its phone number or address next
 * month, we only update it HERE, in one place, and it updates
 * automatically everywhere it's used across all 6 pages.
 *
 * All values below are taken directly from the provided design
 * (Home, Contact, About, Footer sections).
 * ================================================================
 */

export const siteConfig = {
  // ---------------- BRAND ----------------
  brandName: "Amal Car's Doctor",

  // Short one-line description used for SEO meta tags / footer tagline
  tagline: "Premium Automotive Care in Riyadh",

  // Slightly longer, more descriptive line (2 short sentences) used
  // ONLY inside the Footer's first column, under the logo. Kept here
  // instead of hardcoded inside Footer.jsx so it follows the same
  // "single source of truth" rule as every other brand string.
  footerTagline:
    "Precision diagnostics, certified repairs, and honest service — engineered to keep Riyadh's finest vehicles running at their peak.",

  // Used in the browser tab title and SEO meta description
  description:
    "Advanced automotive care for Riyadh's premier vehicles. Utilizing state-of-the-art telemetry and certified engineering to ensure your vehicle operates at peak performance.",

  // ---------------- CONTACT INFO ----------------
  // Used in: Navbar (Book Now links to phone), Footer, Contact page,
  // CTA banners ("Or call +966...")
  contact: {
    phone: "+966 59 103 7543",
    // Phone number formatted for use in tel: links (no spaces/symbols)
    phoneRaw: "+966591037543",
    whatsapp: "+966 59 103 7543",
    whatsappRaw: "966591037543", // used for wa.me/ links (no + sign)
    email: "info@amalcardoc.com",
  },

  // ---------------- ADDRESS ----------------
  // Used in: Footer, Contact page, LocationMap component
  address: {
    line1: "6426 Abi Hourairah, An Nasim Al Gharbi",
    city: "Riyadh",
    postalCode: "14244",
    country: "Saudi Arabia",
    // Full formatted string, ready to display directly
    full: "6426 Abi Hourairah, An Nasim Al Gharbi, Riyadh 14244",
  },

  // ---------------- WORKING HOURS ----------------
  // Used in: Footer, Contact page (WorkingHoursCard), Home hero
  workingHours: {
    weekdaysLabel: "Sat-Thu",
    weekdaysTime: "8:00 AM - 10:00 PM",
    fridayLabel: "Friday",
    fridayStatus: "Closed",
    // Combined string used in places like the footer
    displayString: "Sat-Thu: 8:00 AM - 10:00 PM",
  },

  // ---------------- SOCIAL LINKS ----------------
  // Currently empty/placeholder — fill these in when the client
  // provides their social media handles. Components should read
  // from here so adding a new platform later is a 1-line change.
  socials: {
    instagram: "",
    facebook: "",
    twitter: "",
    tiktok: "",
  },

  // ---------------- SYSTEM STATUS ----------------
  // Used in: Home hero "TelemetryWidget" and Contact page map card,
  // which show a live-style "operational" status indicator as seen
  // in the design.
  systemStatus: "OPERATIONAL",

  // ---------------- LEGAL LINKS ----------------
  // Used in: Footer "Legal" column. Pages don't exist yet, but the
  // links are centralized here so the Footer component doesn't need
  // to change when these pages are eventually built.
  legal: {
    privacyPolicyPath: "/privacy-policy",
    termsOfServicePath: "/terms-of-service",
  },

  // ---------------- COPYRIGHT ----------------
  // Used in: Footer bottom bar. We calculate the year dynamically
  // so it never needs to be manually updated every year.
  copyrightText: `© ${new Date().getFullYear()} Amal Car's Doctor. Premium Automotive Care in Riyadh.`,
};
