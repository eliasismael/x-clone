import { SearchIcon } from "@/components/ui/icons";

type SearchBoxProps = {
  defaultValue?: string;
  autoFocus?: boolean;
};

export function SearchBox({ defaultValue = "", autoFocus = false }: SearchBoxProps) {
  return (
    <form method="GET" action="/search" role="search" className="group relative">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-x-muted group-focus-within:text-x-blue" />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search"
        aria-label="Search users"
        autoFocus={autoFocus}
        className="h-11 w-full rounded-full border border-transparent bg-x-input pr-4 pl-12 text-[15px] text-x-text outline-none placeholder:text-x-muted focus:border-x-blue focus:bg-x-bg"
      />
    </form>
  );
}
