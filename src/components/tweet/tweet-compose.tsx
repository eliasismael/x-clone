"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { createTweetAction, type CreateTweetActionState } from "@/app/(app)/home/actions";

const MAX_LENGTH = 280;

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {pending ? "Posting..." : "Post"}
    </button>
  );
}

type TweetComposeProps = {
  avatarSrc: string;
  displayName: string;
};

export function TweetCompose({ avatarSrc, displayName }: TweetComposeProps) {
  const [content, setContent] = useState("");
  const [state, formAction] = useActionState<CreateTweetActionState, FormData>(
    createTweetAction,
    null,
  );

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      setContent("");
    }
  }, [state]);

  const remaining = MAX_LENGTH - content.length;
  const isOverLimit = remaining < 0;
  const isEmpty = content.trim().length === 0;

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <form action={formAction}>
        <div className="flex items-start gap-3">
          <img
            src={avatarSrc}
            alt={`${displayName} avatar`}
            className="size-10 shrink-0 rounded-full border border-slate-200 bg-slate-50"
          />
          <div className="flex-1">
            <textarea
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              rows={3}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
            {state && !state.ok && state.fieldErrors?.content && (
              <p className="mt-1 text-xs text-rose-600">{state.fieldErrors.content}</p>
            )}
            {state && !state.ok && state.formError && (
              <p className="mt-1 text-xs text-rose-600">{state.formError}</p>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-end gap-3">
          <span
            className={`text-xs font-medium tabular-nums ${
              isOverLimit
                ? "text-rose-600"
                : remaining <= 20
                  ? "text-amber-600"
                  : "text-slate-400"
            }`}
          >
            {remaining}
          </span>
          <SubmitButton disabled={isOverLimit || isEmpty} />
        </div>
      </form>
    </section>
  );
}
