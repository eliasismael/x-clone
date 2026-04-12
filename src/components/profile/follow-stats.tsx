"use client";

import { useState } from "react";
import { formatCount } from "@/lib/utils";
import { FollowModal, type FollowUser } from "./follow-modal";

type FollowStatsProps = {
  followerCount: number;
  followingCount: number;
  followers: FollowUser[];
  following: FollowUser[];
};

export function FollowStats({
  followerCount,
  followingCount,
  followers,
  following,
}: FollowStatsProps) {
  const [open, setOpen] = useState<"followers" | "following" | null>(null);

  return (
    <>
      <div className="flex gap-6">
        <button
          type="button"
          onClick={() => setOpen("followers")}
          className="flex items-baseline gap-1.5 transition hover:opacity-75"
        >
          <span className="text-sm font-semibold text-slate-950">
            {formatCount(followerCount)}
          </span>
          <span className="text-sm text-slate-500">Followers</span>
        </button>
        <button
          type="button"
          onClick={() => setOpen("following")}
          className="flex items-baseline gap-1.5 transition hover:opacity-75"
        >
          <span className="text-sm font-semibold text-slate-950">
            {formatCount(followingCount)}
          </span>
          <span className="text-sm text-slate-500">Following</span>
        </button>
      </div>

      {open === "followers" && (
        <FollowModal
          title="Followers"
          users={followers}
          onClose={() => setOpen(null)}
        />
      )}
      {open === "following" && (
        <FollowModal
          title="Following"
          users={following}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
