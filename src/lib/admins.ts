/** Liste blanche des administrateurs (variable ADMIN_EMAILS). */
export function isAllowedAdmin(email: string | undefined | null) {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}
