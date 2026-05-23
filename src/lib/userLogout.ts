import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { supabase } from "@/lib/supabaseClient";

export const USER_LOGIN_PATH = "/auth/user";

export async function logoutUser(router: AppRouterInstance) {
  await supabase.auth.signOut();
  localStorage.removeItem("user");
  router.push(USER_LOGIN_PATH);
}
