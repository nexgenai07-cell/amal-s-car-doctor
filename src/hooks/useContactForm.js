/**
 * ================================================================
 * useContactForm.js
 * ================================================================
 * Handles ALL the logic for the Contact page's booking form:
 * - Form state (via React Hook Form)
 * - Validation (via the Zod schema, connected through zodResolver)
 * - Submission (calls sendContactForm from api/contact.api.js)
 * - Loading / success / error state, so BookingForm.jsx can show a
 *   spinner while sending and a toast message after
 *
 * WHY THIS LOGIC LIVES IN A HOOK, NOT IN BookingForm.jsx DIRECTLY:
 * Keeps BookingForm.jsx focused purely on rendering UI. If we ever
 * need this exact same form logic somewhere else (e.g. a popup
 * "quick booking" modal elsewhere on the site), we just call this
 * same hook again instead of duplicating logic.
 * ================================================================
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "../schemas/contactFormSchema";
import { sendContactForm } from "../api/contact.api";

export function useContactForm() {
  // "idle" -> "loading" -> "success" | "error"
  // Drives the submit button's spinner and the toast message shown
  // after submission finishes.
  const [status, setStatus] = useState("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      serviceNeeded: "",
      preferredDate: "",
      message: "",
    },
  });

  // This function only runs if Zod validation PASSES — React Hook
  // Form automatically blocks submission and populates `errors` if
  // any field fails validation.
  const onSubmit = async (data) => {
    setStatus("loading");
    try {
      await sendContactForm(data);
      setStatus("success");
      reset(); // clears the form back to empty after a successful send
    } catch (error) {
      console.error("Failed to send contact form:", error);
      setStatus("error");
    }
  };

  return {
    register,
    errors,
    status,
    // handleSubmit wraps our onSubmit, so BookingForm.jsx just does
    // <form onSubmit={handleFormSubmit}> without worrying about
    // validation logic itself.
    handleFormSubmit: handleSubmit(onSubmit),
  };
}
