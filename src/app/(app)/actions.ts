"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clearUserSession, getCurrentUser } from "@/lib/session";

export async function logoutAction() {
  await clearUserSession();
  redirect("/login");
}

export async function toggleFollowAction(targetUserId: string): Promise<void> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.id === targetUserId) return;

  const existing = await db.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
    },
    select: { followerId: true },
  });

  if (existing) {
    await db.follow.delete({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      },
    });
  } else {
    await db.follow.create({
      data: { followerId: currentUser.id, followingId: targetUserId },
    });
  }

  revalidatePath(`/users/${targetUserId}`);
}
