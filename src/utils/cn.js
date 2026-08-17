/**
 * ================================================================
 * cn.js  (short for "className")
 * ================================================================
 * A tiny helper function that safely combines multiple Tailwind
 * class strings together, including conditional ones.
 *
 * WHY WE NEED THIS:
 * When a component has a base style PLUS conditional variant styles
 * PLUS a className passed in from a parent, plain string
 * concatenation causes bugs. Example problem WITHOUT this helper:
 *
 *   className={`px-4 py-2 ${isPrimary ? "bg-primary" : "bg-secondary"} ${className}`}
 *
 * If the parent passes className="bg-blue-500", now there are TWO
 * conflicting "bg-*" classes in the string, and which one wins
 * becomes unpredictable (Tailwind doesn't know which one you meant).
 *
 * HOW THIS FIXES IT:
 * - clsx: lets us conditionally include/exclude classes cleanly,
 *   and safely handles arrays, objects, undefined/null/false values
 *   (e.g. cn("px-4", isActive && "bg-primary"))
 * - tailwind-merge: intelligently resolves conflicting Tailwind
 *   classes, keeping only the LAST one that applies for a given
 *   CSS property (e.g. "bg-primary bg-blue-500" -> keeps bg-blue-500)
 *
 * USAGE (used inside almost every component in this project):
 *   <button className={cn("px-4 py-2 rounded-lg", variant === "primary" && "bg-primary", className)}>
 *
 * INSTALL REQUIRED (run this once in the project terminal):
 *   npm install clsx tailwind-merge
 * ================================================================
 */

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and safely merges class names.
 * @param  {...any} inputs - any number of strings, arrays, or objects of classNames
 * @returns {string} - final, conflict-free className string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
