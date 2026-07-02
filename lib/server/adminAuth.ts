import { cookies } from "next/headers";
import { ADMIN_COOKIE, getAdminPassword } from "@/lib/server/auth";

export function isAdminAuthenticated(): boolean {
  return cookies().get(ADMIN_COOKIE)?.value === getAdminPassword();
}
