/**
 * ================================================================
 * SectionHeading.jsx
 * ================================================================
 * The big heading used at the top of most sections. Supports an
 * optional "highlight" word/phrase that gets rendered in red,
 * matching headings like "Nothing Hidden. Everything Certified."
 * where "Certified." is red, or "We Don't Cut Corners. We Find Them."
 * ================================================================
 */
import { cn } from "../../utils/cn";

/**
 * @param {string} text - the main heading text (non-highlighted part)
 * @param {string} [highlight] - text to render in red, placed after `text`
 * @param {"center"|"left"} [align]
 * @param {string} [className]
 */
export default function SectionHeading({
  text,
  highlight,
  align = "center",
  className = "",
}) {
  return (
    <h2
      className={cn(
        "font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      {text} {highlight && <span className="text-primary">{highlight}</span>}
    </h2>
  );
}
