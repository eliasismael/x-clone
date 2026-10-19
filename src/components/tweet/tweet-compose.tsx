"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createTweetAction, type CreateTweetActionState } from "@/app/(app)/home/actions";
import { CharCounter } from "@/components/tweet/char-counter";
import { Avatar } from "@/components/ui/avatar";

const MAX_LENGTH = 280;

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="h-9 rounded-full bg-x-inverse-bg px-4 text-[15px] font-bold text-x-inverse-text transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Posting..." : "Post"}
    </button>
  );
}

type TweetComposeProps = {
  user: { username: string; displayName: string; avatarUrl: string | null };
  onPosted?: () => void;
};

export function TweetCompose({ user, onPosted }: TweetComposeProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [state, formAction] = useActionState<CreateTweetActionState, FormData>(
    createTweetAction,
    null,
  );

  // Kept in a ref so a new callback identity doesn't re-run the success effect
  const onPostedRef = useRef(onPosted);
  useEffect(() => {
    onPostedRef.current = onPosted;
  });

  // Clear the textarea after a successful submission
  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContent("");
      onPostedRef.current?.();
    }
  }, [state]);

  // Grow the textarea with its content, like X's composer
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [content]);

  const isOverLimit = content.length > MAX_LENGTH;
  const isEmpty = content.trim().length === 0;

  return (
    <form action={formAction} className="flex gap-3 px-4 pt-1 pb-2">
      <Avatar user={user} size={40} className="mt-3" />
      <div className="min-w-0 flex-1">
        <textarea
          ref={textareaRef}
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          aria-label="Post text"
          rows={1}
          className="block w-full resize-none bg-transparent py-3 text-xl leading-6 text-x-text outline-none placeholder:text-x-muted"
        />
        {state && !state.ok && state.fieldErrors?.content && (
          <p className="pb-2 text-[13px] text-x-red">{state.fieldErrors.content}</p>
        )}
        {state && !state.ok && state.formError && (
          <p className="pb-2 text-[13px] text-x-red">{state.formError}</p>
        )}

        <div className="flex items-center justify-end gap-3 border-t border-x-border pt-2">
          {content.length > 0 && <CharCounter length={content.length} maxLength={MAX_LENGTH} />}
          <SubmitButton disabled={isOverLimit || isEmpty} />
        </div>
      </div>
    </form>
  );
}
