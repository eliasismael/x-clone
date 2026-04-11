"use server";

import { redirect } from "next/navigation";
import { clearUserSession } from "@/lib/session";

export async function logoutAction() {
  await clearUserSession();
  redirect("/login");
}
