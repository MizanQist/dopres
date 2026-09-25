export type ContactValues = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX = { name: 120, email: 254, message: 4000 };

/** Shared by the form (client) and the route handler (server). */
export function validateContact(input: unknown): {
  values: ContactValues;
  errors: ContactErrors | null;
} {
  const raw = (input ?? {}) as Record<string, unknown>;
  const str = (v: unknown, max: number) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";
  const values: ContactValues = {
    name: str(raw.name, MAX.name),
    email: str(raw.email, MAX.email),
    message: str(raw.message, MAX.message),
  };
  const errors: ContactErrors = {};
  if (values.name.length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL.test(values.email)) errors.email = "Please enter a valid email address.";
  if (values.message.length < 10) errors.message = "Please write a few more words.";
  return { values, errors: Object.keys(errors).length ? errors : null };
}
