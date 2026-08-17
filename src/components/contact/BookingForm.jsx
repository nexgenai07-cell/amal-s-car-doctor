/**
 * ================================================================
 * BookingForm.jsx
 * ================================================================
 * The appointment booking form shown on the Contact page. This
 * component purely handles RENDERING the form fields — all
 * validation and submission logic lives in useContactForm().
 * Fields: Full Name, Phone Number, Service Needed, Preferred Date,
 * Message.
 *
 * Rendered as the LEFT column inside the shared, highlighted
 * "form + map" card on the Contact page (see Contact.jsx) — this
 * component itself stays unboxed (no own background/border/
 * padding) so it blends into that shared card instead of creating
 * a double-boxed look, and its internal gaps are kept compact
 * (gap-4) to match the tighter, more compact card.
 * ================================================================
 */
import { motion } from "motion/react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import Toast from "../ui/Toast";
import { useContactForm } from "../../hooks/useContactForm";
import { services } from "../../data/services";

// Builds the dropdown options list from our services data, so if a
// new service is added to data/services.js, it automatically shows
// up here too — no need to update this file separately.
const serviceOptions = services.map((service) => ({
  value: service.title,
  label: service.title,
}));

export default function BookingForm() {
  // register  -> binds each input to react-hook-form
  // errors    -> field-level validation error messages
  // status    -> "idle" | "loading" | "success" | "error"
  // handleFormSubmit -> validated submit handler
  const { register, errors, status, handleFormSubmit } = useContactForm();

  return (
    // Fades and slides in slightly after the hero above it, so the
    // page feels sequential rather than everything popping in at
    // once. Padding scales up across breakpoints (mobile -> tablet)
    // for better spacing on larger screens.
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="h-full"
    >
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-4"
        noValidate
      >
        {/* Full Name + Phone Number: stacked on mobile, side-by-side
            from the "sm" breakpoint upward */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            error={errors.fullName?.message}
            {...register("fullName")}
          />
          <Input
            label="Phone Number"
            placeholder="+966 5X XXX XXXX"
            error={errors.phoneNumber?.message}
            {...register("phoneNumber")}
          />
        </div>

        {/* Service dropdown, options generated from data/services.js */}
        <Select
          label="Service Needed"
          placeholder="Select Diagnostic or Repair"
          options={serviceOptions}
          error={errors.serviceNeeded?.message}
          {...register("serviceNeeded")}
        />

        {/* Native date picker for the preferred appointment date */}
        <Input
          label="Preferred Date"
          type="date"
          error={errors.preferredDate?.message}
          {...register("preferredDate")}
        />

        {/* Optional free-text field for describing the car's symptoms */}
        <Textarea
          label="Message (Optional)"
          placeholder="Describe the symptoms..."
          error={errors.message?.message}
          {...register("message")}
        />

        {/* Submit button: shows a spinner + "Sending..." text while
            the request is in flight, and is disabled during that
            time to prevent duplicate submissions */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={status === "loading"}
          showArrow={status !== "loading"}
        >
          {status === "loading" ? (
            <>
              <Spinner /> Sending...
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>

        {/* Success/error feedback banner, shown only after a submit
            attempt has completed */}
        {status === "success" && (
          <Toast
            type="success"
            message="Booking request sent! We'll contact you shortly to confirm."
          />
        )}
        {status === "error" && (
          <Toast
            type="error"
            message="Something went wrong. Please try again or call us directly."
          />
        )}
      </form>
    </motion.div>
  );
}
