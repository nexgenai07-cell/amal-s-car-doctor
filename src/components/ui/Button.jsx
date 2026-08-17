/**
 * ================================================================
 * Button.jsx
 * ================================================================
 * The single, reusable Button component used across the ENTIRE
 * website. Every clickable button/link in the design (e.g.
 * "BOOK A CHECKUP", "VIEW SERVICES", "CONFIRM BOOKING", the small
 * "Learn More →" links on service cards) is built from this ONE
 * component, just with different props.
 *
 * WHY ONE COMPONENT INSTEAD OF MANY:
 * If tomorrow the client wants the primary button's corner radius
 * changed from rounded to sharp, we change it in ONE place here,
 * and every button across all 6 pages updates automatically.
 *
 * VARIANTS (matched exactly to the design):
 * - "primary"  -> solid red background, white text.
 *                 Used for: "BOOK NOW", "BOOK A CHECKUP",
 *                 "CONFIRM BOOKING", "BOOK THIS TREATMENT"
 * - "outline"  -> transparent background, red/grey border.
 *                 Used for: "VIEW SERVICES"
 * - "ghost"    -> no background, no border, just red text with an
 *                 arrow icon. Used for: "Learn More →" on service
 *                 cards, "VIEW SERVICE →" on related services
 *
 * SMART NAVIGATION BEHAVIOUR:
 * This component automatically decides what HTML element to render:
 * - If a `to` prop is passed      -> renders React Router's <Link>
 *   (internal navigation, e.g. to="/services")
 * - If an `href` prop is passed   -> renders a plain <a> tag
 *   (external links, e.g. tel:, mailto:, wa.me)
 * - Otherwise                     -> renders a normal <button>
 *   (used for form submits, opening modals, etc.)
 * This means the calling component never has to think about which
 * HTML tag to use — this Button figures it out itself.
 * ================================================================
 */

import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { cn } from "../../utils/cn";

/**
 * @param {"primary"|"outline"|"ghost"} variant - visual style of the button
 * @param {"sm"|"md"|"lg"} size - controls padding/font-size
 * @param {string} [to] - internal route path (renders <Link>)
 * @param {string} [href] - external URL (renders <a>)
 * @param {boolean} [showArrow] - shows a right-arrow icon after the text
 *   (defaults to true for "ghost" variant since every ghost button in
 *   the design has an arrow, e.g. "Learn More →")
 * @param {React.ElementType} [icon] - optional icon component to show
 *   BEFORE the text (e.g. a phone icon for "Book Now" on the contact CTA)
 * @param {boolean} [fullWidth] - makes the button stretch to 100% width
 *   (used in the Contact page's "Confirm Booking" button on mobile)
 * @param {string} [className] - extra classes from the parent, merged safely
 * @param {React.ReactNode} children - the button's label text
 */
export default function Button({
  variant = "primary",
  size = "md",
  to,
  href,
  showArrow,
  icon: Icon,
  fullWidth = false,
  className = "",
  children,
  ...rest // catches any other native props like onClick, type, disabled, target
}) {
  // ----------------------------------------------------------------
  // Base styles shared by EVERY button, regardless of variant.
  // ----------------------------------------------------------------
  const baseStyles = cn(
    "inline-flex items-center justify-center gap-2",
    "font-label font-medium uppercase tracking-wide", // matches the mono-font, uppercase button text seen in the design
    "rounded-lg transition-all duration-300 ease-out",
    "cursor-pointer whitespace-nowrap",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    fullWidth && "w-full",
  );

  // ----------------------------------------------------------------
  // Size styles — controls how big/small the button is.
  // ----------------------------------------------------------------
  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  // ----------------------------------------------------------------
  // Variant styles — the actual visual "look" of each button type.
  // ----------------------------------------------------------------
  const variantStyles = {
    primary: cn(
      "bg-primary text-white",
      "hover:bg-primary-dark",
      "shadow-[0_0_20px_-5px_var(--color-primary)]", // subtle red glow, matches the "techy" aesthetic
      "hover:shadow-[0_0_30px_-5px_var(--color-primary)]",
    ),
    outline: cn(
      "bg-transparent text-white border border-tertiary",
      "hover:border-primary hover:text-primary",
    ),
    ghost: cn(
      "bg-transparent text-primary p-0 uppercase-none normal-case font-body",
      "hover:text-primary-light hover:gap-3", // gap increases on hover -> arrow slides right slightly
    ),
  };

  // Ghost variant buttons (like "Learn More") should not get the
  // padding/size treatment that primary/outline buttons get, since
  // they are meant to look like inline text links, not boxed buttons.
  const finalSizeStyles = variant === "ghost" ? "" : sizeStyles[size];

  // By default, only the "ghost" variant shows the arrow icon
  // (matches "Learn More →" in the design). Other variants only show
  // an arrow if explicitly requested via the `showArrow` prop.
  const shouldShowArrow = showArrow ?? variant === "ghost";

  // Combine everything into the final class string, safely merged.
  const combinedClassName = cn(
    baseStyles,
    finalSizeStyles,
    variantStyles[variant],
    className,
  );

  // ----------------------------------------------------------------
  // The actual inner content (icon + text + arrow), shared across
  // whichever HTML tag ends up being rendered below.
  // ----------------------------------------------------------------
  const content = (
    <>
      {Icon && <Icon className="text-base" />}
      <span>{children}</span>
      {shouldShowArrow && (
        <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  );

  // ----------------------------------------------------------------
  // CASE 1: Internal navigation -> render React Router's <Link>
  // ----------------------------------------------------------------
  if (to) {
    return (
      <Link to={to} className={cn(combinedClassName, "group")} {...rest}>
        {content}
      </Link>
    );
  }

  // ----------------------------------------------------------------
  // CASE 2: External link (tel:, mailto:, wa.me, etc.) -> render <a>
  // ----------------------------------------------------------------
  if (href) {
    return (
      <a href={href} className={cn(combinedClassName, "group")} {...rest}>
        {content}
      </a>
    );
  }

  // ----------------------------------------------------------------
  // CASE 3: Default -> render a normal <button> (form submits, etc.)
  // ----------------------------------------------------------------
  return (
    <button className={cn(combinedClassName, "group")} {...rest}>
      {content}
    </button>
  );
}
