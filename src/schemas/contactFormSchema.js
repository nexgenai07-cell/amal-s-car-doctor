/**
 * ================================================================
 * contactFormSchema.js
 * ================================================================
 * The Zod validation schema for the Contact page's booking form.
 * This defines the RULES for each field — React Hook Form uses
 * this schema (via @hookform/resolvers/zod) to automatically
 * validate the form and generate error messages, so we never have
 * to write manual if/else validation checks ourselves.
 *
 * FIELDS MATCH THE DESIGN EXACTLY:
 * Full Name, Phone Number, Service Needed, Preferred Date,
 * Message (optional).
 * ================================================================
 */
import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters"),

  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    // Accepts digits, spaces, +, and - (covers formats like
    // "+966 5X XXX XXXX"). Keeps validation loose since phone
    // formats vary, but still catches obviously invalid input.
    .regex(/^[+\d\s-]{8,20}$/, "Enter a valid phone number"),

  serviceNeeded: z.string().min(1, "Please select a service"),

  preferredDate: z.string().min(1, "Please select a preferred date"),

  // Message is optional, matching the design's "(Optional)" label.
  // z.string().optional() allows it to be empty/undefined entirely.
  message: z.string().optional(),
});
