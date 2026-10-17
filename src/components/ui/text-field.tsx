type TextFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  autoComplete?: string;
  error?: string;
  multiline?: boolean;
};

// X-style input: bordered box with the label inside, highlighted in blue on focus
export function TextField({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  autoComplete,
  error,
  multiline = false,
}: TextFieldProps) {
  const errorId = `${name}-error`;
  const sharedProps = {
    name,
    placeholder,
    defaultValue,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    className:
      "block w-full resize-none bg-transparent px-2 pt-0.5 pb-2 text-[17px] text-x-text outline-none placeholder:text-x-muted",
  };

  return (
    <div>
      <label
        className={`group block rounded-[4px] border transition-colors focus-within:ring-1 ${
          error
            ? "border-x-red ring-x-red focus-within:border-x-red"
            : "border-x-banner ring-x-blue focus-within:border-x-blue"
        }`}
      >
        <span
          className={`block px-2 pt-2 text-[13px] leading-4 ${
            error ? "text-x-red" : "text-x-muted group-focus-within:text-x-blue"
          }`}
        >
          {label}
        </span>
        {multiline ? (
          <textarea rows={3} {...sharedProps} />
        ) : (
          <input type={type} autoComplete={autoComplete} {...sharedProps} />
        )}
      </label>
      {error ? (
        <p id={errorId} className="mt-1 px-2 text-[13px] text-x-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}
