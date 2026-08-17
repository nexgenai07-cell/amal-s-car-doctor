/**
 * ================================================================
 * Container.jsx
 * ================================================================
 * A simple wrapper that constrains content to a max-width and adds
 * consistent horizontal padding, used inside every section across
 * the site so content never touches the edge of very wide screens,
 * and has consistent side spacing on mobile.
 * ================================================================
 */

import { cn } from "../../utils/cn";

/**
 * @param {string} [className] - extra classes merged onto the container
 * @param {React.ReactNode} children
 */
export default function Container({ className = "", children }) {
  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
