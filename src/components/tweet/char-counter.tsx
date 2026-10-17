import { getCharCounterState } from "@/lib/char-counter";

const toneColor = {
  normal: "var(--x-blue)",
  warning: "#ffd400",
  danger: "var(--x-red)",
} as const;

type CharCounterProps = {
  length: number;
  maxLength: number;
};

export function CharCounter({ length, maxLength }: CharCounterProps) {
  const { remaining, progress, tone, showRemaining, showRing } = getCharCounterState(length, maxLength);
  const size = showRemaining ? 30 : 20;
  const radius = size / 2 - 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      role="status"
      aria-label={`${remaining} characters remaining`}
      className="relative flex items-center justify-center"
      style={{ width: 30, height: 30 }}
    >
      {showRing && (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--x-border)" strokeWidth={2} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={toneColor[tone]}
            strokeWidth={2}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
          />
        </svg>
      )}
      {showRemaining && (
        <span
          aria-hidden="true"
          className={`absolute text-[13px] tabular-nums ${tone === "danger" ? "text-x-red" : "text-x-muted"}`}
        >
          {remaining}
        </span>
      )}
    </div>
  );
}
