export const CONTACT_LIMITS = {
  name: 60,
  email: 120,
  message: 2000,
} as const;

export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactState =
  | { status: "idle" }
  | { status: "success"; name: string } // name ya recortado; la UI lo pasa a mayúsculas
  | { status: "error"; reason: "validation" | "send"; detail: string };

export const CONTACT_SEND_ERROR = "NO SE PUDO TRANSMITIR EL MENSAJE. INTÉNTALO DE NUEVO.";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Recorta y valida. Devuelve los datos limpios o el primer error en español. */
export function validateContact(
  raw: ContactInput,
): { ok: true; data: ContactInput } | { ok: false; detail: string } {
  const data: ContactInput = {
    name: raw.name.trim(),
    email: raw.email.trim(),
    message: raw.message.trim(),
  };

  if (!data.name || !data.email || !data.message) {
    return { ok: false, detail: "FALTAN CAMPOS OBLIGATORIOS" };
  }
  if (data.name.length > CONTACT_LIMITS.name) {
    return { ok: false, detail: `NOMBRE DEMASIADO LARGO (MÁX. ${CONTACT_LIMITS.name})` };
  }
  if (data.email.length > CONTACT_LIMITS.email) {
    return { ok: false, detail: `CORREO DEMASIADO LARGO (MÁX. ${CONTACT_LIMITS.email})` };
  }
  if (!EMAIL_RE.test(data.email)) {
    return { ok: false, detail: "CORREO ELECTRÓNICO NO VÁLIDO" };
  }
  if (data.message.length > CONTACT_LIMITS.message) {
    return { ok: false, detail: `MENSAJE DEMASIADO LARGO (MÁX. ${CONTACT_LIMITS.message})` };
  }

  return { ok: true, data };
}
