import { describe, expect, it } from "vitest";
import { getCharCounterState } from "@/lib/char-counter";

describe("getCharCounterState", () => {
  it("starts empty with a normal tone and no number", () => {
    expect(getCharCounterState(0, 280)).toEqual({
      remaining: 280,
      progress: 0,
      tone: "normal",
      showRemaining: false,
      showRing: true,
    });
  });

  it("fills the ring proportionally to the length", () => {
    expect(getCharCounterState(140, 280).progress).toBe(0.5);
  });

  it("switches to warning and shows the number within 20 characters of the limit", () => {
    const state = getCharCounterState(260, 280);
    expect(state.tone).toBe("warning");
    expect(state.showRemaining).toBe(true);
    expect(state.remaining).toBe(20);
  });

  it("stays normal one character before the warning threshold", () => {
    const state = getCharCounterState(259, 280);
    expect(state.tone).toBe("normal");
    expect(state.showRemaining).toBe(false);
  });

  it("is danger at the limit", () => {
    expect(getCharCounterState(280, 280).tone).toBe("danger");
  });

  it("clamps progress and goes negative when over the limit", () => {
    const state = getCharCounterState(285, 280);
    expect(state.progress).toBe(1);
    expect(state.remaining).toBe(-5);
    expect(state.showRing).toBe(true);
  });

  it("hides the ring once 10 or more characters over the limit", () => {
    expect(getCharCounterState(290, 280).showRing).toBe(false);
    expect(getCharCounterState(289, 280).showRing).toBe(true);
  });
});
