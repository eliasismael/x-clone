export type CharCounterTone = "normal" | "warning" | "danger";

export type CharCounterState = {
  remaining: number;
  // Fraction of the ring to fill, clamped to [0, 1]
  progress: number;
  tone: CharCounterTone;
  // X only prints the number once you get close to the limit
  showRemaining: boolean;
  // ...and drops the ring entirely once you are well past it
  showRing: boolean;
};

const WARNING_THRESHOLD = 20;
const RING_HIDE_THRESHOLD = -10;

export function getCharCounterState(length: number, maxLength: number): CharCounterState {
  const remaining = maxLength - length;

  return {
    remaining,
    progress: Math.min(Math.max(length / maxLength, 0), 1),
    tone: remaining <= 0 ? "danger" : remaining <= WARNING_THRESHOLD ? "warning" : "normal",
    showRemaining: remaining <= WARNING_THRESHOLD,
    showRing: remaining > RING_HIDE_THRESHOLD,
  };
}
