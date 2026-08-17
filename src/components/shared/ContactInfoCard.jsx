/**
 * ================================================================
 * ContactInfoCard.jsx
 * ================================================================
 * A single "reach us" card (Call Us / WhatsApp / Email Us), used in
 * the Contact page's ReachUsGrid. Renders as a clickable link that
 * opens the phone dialer, WhatsApp chat, or email client directly.
 * ================================================================
 */
import IconBox from "../ui/IconBox";

/**
 * @param {React.ElementType} icon
 * @param {string} title
 * @param {string} value - the displayed contact value (phone/email)
 * @param {string} href - the actual link (tel:, https://wa.me/, mailto:)
 */
export default function ContactInfoCard({ icon, title, value, href }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="flex flex-col items-center text-center gap-3 bg-secondary border border-tertiary/20 rounded-xl p-6 hover:border-primary/40 transition-colors duration-200"
    >
      <IconBox icon={icon} variant="filled" size="md" />
      <h3 className="font-heading font-semibold text-base">{title}</h3>
      <p className="text-neutral text-sm">{value}</p>
    </a>
  );
}
