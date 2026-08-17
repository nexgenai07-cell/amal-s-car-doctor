/**
 * ================================================================
 * contact.api.js
 * ================================================================
 * Handles sending the Contact form's data via EmailJS, so the
 * workshop owner receives an email every time someone submits a
 * booking request — all without needing a real backend server.
 *
 *  SETUP REQUIRED BEFORE THIS WORKS:
 * 1. Create a free account at https://www.emailjs.com
 * 2. Connect an email service (e.g. Gmail) -> get a SERVICE_ID
 * 3. Create an email template -> get a TEMPLATE_ID
 *    (the template should use variables matching the keys sent
 *    below: full_name, phone_number, service_needed,
 *    preferred_date, message)
 * 4. Get your PUBLIC_KEY from EmailJS account settings
 * 5. Put all 3 values into a .env file at the project root:
 *      VITE_EMAILJS_SERVICE_ID=your_service_id
 *      VITE_EMAILJS_TEMPLATE_ID=your_template_id
 *      VITE_EMAILJS_PUBLIC_KEY=your_public_key
 *
 * FUTURE BACKEND MIGRATION:
 * When a real backend is built later, ONLY the inside of
 * sendContactForm() needs to change (e.g. to an axios.post call).
 * BookingForm.jsx and useContactForm.js never need to change,
 * since they only call this function and don't care how it works
 * internally.
 * ================================================================
 */
import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Sends the contact/booking form data to the workshop owner's email
 * via EmailJS.
 *
 * @param {object} formData - validated form data from React Hook Form
 * @param {string} formData.fullName
 * @param {string} formData.phoneNumber
 * @param {string} formData.serviceNeeded
 * @param {string} formData.preferredDate
 * @param {string} [formData.message]
 * @returns {Promise<void>} - throws an error if sending fails, so the
 *   calling code (useContactForm) can catch it and show an error toast
 */
export async function sendContactForm(formData) {
  // Maps our form's field names to the variable names used inside
  // the EmailJS email template (snake_case is the EmailJS convention).
  const templateParams = {
    full_name: formData.fullName,
    phone_number: formData.phoneNumber,
    service_needed: formData.serviceNeeded,
    preferred_date: formData.preferredDate,
    message: formData.message || "No additional message provided.",
  };

  await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
    publicKey: PUBLIC_KEY,
  });
}
