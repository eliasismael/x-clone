import Image from "next/image";
import { getCurrentUser } from "@/lib/session";
import { EditProfileForm } from "./edit-profile-form";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="min-h-screen bg-white/70 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl space-y-5">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="h-32 bg-[linear-gradient(135deg,#0f172a_0%,#0369a1_100%)]" />
          <div className="px-6 pb-6">
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <Image
                src={currentUser?.avatarUrl ?? `https://api.dicebear.com/9.x/initials/svg?seed=${currentUser?.username}`}
                alt={`${currentUser?.displayName} avatar`}
                width={96}
                height={96}
                className="size-24 rounded-full border-4 border-white bg-white shadow-sm"
              />
              <EditProfileForm
                displayName={currentUser?.displayName ?? ""}
                username={currentUser?.username ?? ""}
                bio={currentUser?.bio ?? null}
              />
            </div>

            <div className="mt-4">
              <h1 className="text-2xl font-semibold text-slate-950">{currentUser?.displayName}</h1>
              <p className="mt-1 text-sm text-slate-500">@{currentUser?.username}</p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700">
                {currentUser?.bio ?? "This user has not added a bio yet."}
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Username</p>
                <p className="mt-2 text-sm font-medium text-slate-900">@{currentUser?.username}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Bio</p>
                <p className="mt-2 text-sm text-slate-700">{currentUser?.bio ?? "No bio yet"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Avatar</p>
                <p className="mt-2 text-sm text-slate-700">Generated placeholder based on username</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
