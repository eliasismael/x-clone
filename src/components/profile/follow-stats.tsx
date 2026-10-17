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
      <div className="flex gap-5 text-[14px] leading-4">
        <button
          type="button"
          onClick={() => setOpen("following")}
          className="flex items-baseline gap-1 hover:underline"
        >
          <span className="font-bold text-x-text">{formatCount(followingCount)}</span>
          <span className="text-x-muted">Following</span>
        </button>
        <button
          type="button"
          onClick={() => setOpen("followers")}
          className="flex items-baseline gap-1 hover:underline"
        >
          <span className="font-bold text-x-text">{formatCount(followerCount)}</span>
          <span className="text-x-muted">{followerCount === 1 ? "Follower" : "Followers"}</span>
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
