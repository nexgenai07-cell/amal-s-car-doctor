/**
 * ================================================================
 * IconBox.jsx
 * ================================================================
 * The small square/rounded box with an icon inside, seen in the
 * WhyChooseUs feature cards, the Services orbit diagram nodes, and
 * the About page certification badges.
 * ================================================================
 */
import { cn } from "../../utils/cn";

/**
 * @param {React.ElementType} icon - the react-icons component to render
 * @param {"filled"|"outline"|"gradient"} [variant] - "filled" = solid red bg,
 *   "outline" = dark bg with red border (default/resting state),
 *   "gradient" = premium diagonal red gradient with glow (used for the
 *   orbit diagram's center node, and for satellite nodes once the
 *   traveling light has permanently "lit" them up)
 * @param {"sm"|"md"|"lg"} [size]
 */
export default function IconBox({
  icon: Icon,
  variant = "outline",
  size = "md",
  className = "",
}) {
  const sizeStyles = {
    sm: "w-10 h-10 text-base",
    md: "w-14 h-14 text-xl",
    lg: "w-20 h-20 text-3xl",
  };

  const variantStyles = {
    filled: "bg-primary text-white shadow-[0_0_25px_-5px_var(--color-primary)]",
    outline: "bg-secondary border border-tertiary/30 text-primary",
    gradient:
      "bg-gradient-to-br from-primary-light via-primary to-primary-dark text-white shadow-[0_0_22px_-4px_var(--color-primary)] ring-1 ring-primary-light/40",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl shrink-0",
        sizeStyles[size],
        variantStyles[variant],
        className,
      )}
    >
      <Icon />
    </div>
  );
}
