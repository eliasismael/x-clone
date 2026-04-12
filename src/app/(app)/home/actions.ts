"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { tweetSchema } from "@/lib/validations/tweet";

export type CreateTweetActionState =
  | { ok: true }
  | { ok: false; fieldErrors?: { content?: string }; formError?: string }
  | null;

export async function createTweetAction(
  _prevState: CreateTweetActionState,
  formData: FormData,
): Promise<CreateTweetActionState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const parsed = tweetSchema.safeParse({
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: {
        content: parsed.error.flatten().fieldErrors.content?.[0],
      },
    };
  }

  try {
    await db.tweet.create({
      data: {
        content: parsed.data.content,
        authorId: currentUser.id,
      },
    });
  } catch {
    return { ok: false, formError: "Could not post your tweet. Please try again." };
  }

  revalidatePath("/home");
  return { ok: true };
}

export async function deleteTweetAction(tweetId: string): Promise<void> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const tweet = await db.tweet.findUnique({
    where: { id: tweetId },
    select: { authorId: true },
  });

  if (!tweet || tweet.authorId !== currentUser.id) {
    return;
  }

  await db.tweet.delete({ where: { id: tweetId } });

  revalidatePath("/home");
}
