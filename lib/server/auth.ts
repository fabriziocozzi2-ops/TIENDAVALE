export const ADMIN_COOKIE = "admin_session";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "morelia2026";
}
