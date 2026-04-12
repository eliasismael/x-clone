"use client";

type UserSearchInputProps = {
  defaultValue: string;
};

export function UserSearchInput({ defaultValue }: UserSearchInputProps) {
  return (
    <form method="GET" action="/search">
      <input
        type="text"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search by name or username…"
        autoFocus
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
      />
    </form>
  );
}