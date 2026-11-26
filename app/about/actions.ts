"use server";

import { Resend } from "resend";
import { CONTACT_SEND_ERROR, validateContact, type ContactState } from "@/lib/contact";

const DEFAULT_FROM = "Arcade Vault <onboarding@resend.dev>";

/** FormData value as a string; files or missing fields become "". */
function field(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/**
 * Contact form of /about. Revalidates on the server, drops honeypot hits silently
 * and sends one plain-text email to the team through Resend.
 * Errors are logged here and reach the client only as a generic message.
 */
export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const result = validateContact({
    name: field(formData, "name"),
    email: field(formData, "email"),
    message: field(formData, "message"),
  });
  if (!result.ok) {
    return { status: "error", reason: "validation", detail: result.detail };
  }
  const { name, email, message } = result.data;

  // Honeypot: bots fill the hidden `website` field. Fake success, no email.
  if (field(formData, "website")) {
    return { status: "success", name };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error(
      `[contact] Missing env: ${[!apiKey && "RESEND_API_KEY", !to && "CONTACT_TO_EMAIL"].filter(Boolean).join(", ")}`,
    );
    return { status: "error", reason: "send", detail: CONTACT_SEND_ERROR };
  }

  try {
    // Instantiated per call so a missing key never breaks the build.
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
      to,
      replyTo: email,
      subject: `[Arcade Vault] Mensaje de ${name}`,
      text: [
        "Nuevo mensaje desde el formulario de contacto de Arcade Vault",
        "",
        `Nombre: ${name}`,
        `Correo: ${email}`,
        "",
        "Mensaje:",
        message,
      ].join("\n"),
    });
    if (error) {
      console.error("[contact] Resend error:", error);
      return { status: "error", reason: "send", detail: CONTACT_SEND_ERROR };
    }
  } catch (err) {
    console.error("[contact] Resend request failed:", err);
    return { status: "error", reason: "send", detail: CONTACT_SEND_ERROR };
  }

  return { status: "success", name };
}
