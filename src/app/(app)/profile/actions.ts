"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buildAvatarUrl } from "@/lib/avatar";
import { deleteStoredAvatar, storeAvatar } from "@/lib/avatar-storage";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { editProfileSchema } from "@/lib/validations/auth";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const allowedMimeTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export type UpdateProfileActionState = {
  fieldErrors?: Partial<Record<"displayName" | "username" | "bio" | "avatar", string>>;
  formError?: string;
};

async function saveAvatar(file: File, userId: string) {
  if (!allowedMimeTypes.has(file.type)) {
    return {
      error: "Avatar must be a JPG, PNG, or WebP image.",
    };
  }

  if (file.size > MAX_AVATAR_BYTES) {
    return {
      error: "Avatar must be 2 MB or smaller.",
    };
  }

  const extension = allowedMimeTypes.get(file.type);
  const fileName = `${userId}-${Date.now()}.${extension}`;

  try {
    return { path: await storeAvatar(fileName, file) };
  } catch {
    return { error: "Could not upload your avatar. Please try again." };
  }
}

export async function updateProfileAction(
  _previousState: UpdateProfileActionState,
  formData: FormData,
): Promise<UpdateProfileActionState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const parsed = editProfileSchema.safeParse({
    displayName: formData.get("displayName"),
    username: formData.get("username"),
    bio: formData.get("bio"),
  });

  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;

    return {
      fieldErrors: {
        displayName: flattened.displayName?.[0],
        username: flattened.username?.[0],
        bio: flattened.bio?.[0],
      },
    };
  }

  const avatarFile = formData.get("avatar");
  let avatarUrl = currentUser.avatarUrl ?? buildAvatarUrl(parsed.data.username);

  if (avatarFile instanceof File && avatarFile.size > 0) {
    const uploadResult = await saveAvatar(avatarFile, currentUser.id);

    if ("error" in uploadResult) {
      return {
        fieldErrors: {
          avatar: uploadResult.error,
        },
      };
    }

    avatarUrl = uploadResult.path;
  } else if (!currentUser.avatarUrl) {
    avatarUrl = buildAvatarUrl(parsed.data.username);
  }

  try {
    const previousAvatarUrl = currentUser.avatarUrl;

    await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        displayName: parsed.data.displayName,
        username: parsed.data.username,
        bio: parsed.data.bio,
        avatarUrl,
      },
    });

    if (avatarUrl !== previousAvatarUrl && previousAvatarUrl) {
      await deleteStoredAvatar(previousAvatarUrl);
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      Array.isArray(error.meta?.target) &&
      error.meta.target.includes("username")
    ) {
      return {
        fieldErrors: {
          username: "That username is already taken.",
        },
      };
    }

    return {
      formError: "We could not save your profile right now. Please try again.",
    };
  }

  revalidatePath("/home");
  revalidatePath("/profile");
  redirect("/profile");
}
