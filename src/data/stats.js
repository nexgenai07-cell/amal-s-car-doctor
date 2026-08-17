/**
 * ================================================================
 * stats.js
 * ================================================================
 */
import {
  FaCarSide,
  FaAward,
  FaThumbsUp,
  FaHeadset,
  FaCertificate,
  FaHandshake,
  FaStar,
  FaShieldHalved,
  FaGem,
} from "react-icons/fa6";

export const homeStats = [
  {
    icon: FaCarSide,
    value: 12000,
    suffix: "+",
    label: "Cars Serviced",
    animate: true,
  },
  {
    icon: FaAward,
    value: 15,
    suffix: "",
    label: "Years Experience",
    animate: true,
  },
  {
    icon: FaThumbsUp,
    value: 98,
    suffix: "%",
    label: "Client Satisfaction",
    animate: true,
  },
  {
    icon: FaHeadset,
    value: 24,
    suffix: "/7",
    label: "Emergency Support",
    animate: false,
  },
];

// The 5 trust badges shown in the About page's "Certified & Trusted"
// section. Icons are assigned generically since we don't have the
// client's actual certification logos yet.

export const trustBadges = [
  { icon: FaCertificate, label: "ISO Certified" },
  { icon: FaHandshake, label: "Bosch Partner" },
  { icon: FaStar, label: "5-Star Rated" },
  { icon: FaShieldHalved, label: "Licensed Workshop" },
  { icon: FaGem, label: "Premium Quality" },
];
