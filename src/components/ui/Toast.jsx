/**
 * ================================================================
 * Toast.jsx
 * ================================================================
 * A small feedback banner shown after the Contact form submits —
 * either a green "success" message or a red "error" message.
 * Not a floating/fixed-position toast (no external library needed);
 * it renders inline near the form so it's simple and reliable.
 * ================================================================
 */
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { cn } from "../../utils/cn";

/**
 * @param {"success"|"error"} type
 * @param {string} message
 */
export default function Toast({ type, message }) {
  const isSuccess = type === "success";

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-body border",
        isSuccess
          ? "bg-success/10 border-success/30 text-success"
          : "bg-red-500/10 border-red-500/30 text-red-500",
      )}
    >
      {isSuccess ? <FaCircleCheck /> : <FaCircleExclamation />}
      <span>{message}</span>
    </div>
  );
}
