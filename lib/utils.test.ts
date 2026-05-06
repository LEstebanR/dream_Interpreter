import { describe, expect, test } from "bun:test";
import { cn } from "./utils";
import { getMoodEmoji, MOODS } from "./moods";

describe("cn", () => {
  test("merges class names", () => {
    expect(cn("px-2", "py-2")).toBe("px-2 py-2");
  });

  test("resolves tailwind conflicts, last one wins", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  test("handles conditional classes", () => {
    expect(cn("base", false && "ignored", "added")).toBe("base added");
  });

  test("returns empty string with no arguments", () => {
    expect(cn()).toBe("");
  });
});

describe("getMoodEmoji", () => {
  test("returns the correct emoji for a known mood", () => {
    expect(getMoodEmoji("happy")).toBe("😊");
    expect(getMoodEmoji("sad")).toBe("😢");
    expect(getMoodEmoji("magical")).toBe("✨");
  });

  test("returns empty string for null", () => {
    expect(getMoodEmoji(null)).toBe("");
  });

  test("returns empty string for unknown mood", () => {
    expect(getMoodEmoji("unknown")).toBe("");
  });

  test("all MOODS entries have a non-empty emoji", () => {
    for (const mood of MOODS) {
      expect(getMoodEmoji(mood.value)).not.toBe("");
    }
  });
});
