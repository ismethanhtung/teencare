import { describe, it, expect, beforeAll } from "vitest";
import { timeRangesOverlap, isWithinDateRange, hoursUntil } from "./time";

beforeAll(() => {
  process.env.MONGODB_URI = "mongodb://localhost:27017";
  process.env.MONGODB_DB_NAME = "test";
  process.env.APP_TIMEZONE = "Asia/Ho_Chi_Minh";
});

describe("timeRangesOverlap", () => {
  it("returns true when ranges overlap", () => {
    expect(timeRangesOverlap({ start: "18:00", end: "19:30" }, { start: "19:00", end: "20:00" })).toBe(true);
  });
  it("returns false when ranges are adjacent", () => {
    // half-open intervals: [a, b) and [b, c) do not overlap
    expect(timeRangesOverlap({ start: "18:00", end: "19:00" }, { start: "19:00", end: "20:00" })).toBe(false);
  });
  it("returns false when fully separate", () => {
    expect(timeRangesOverlap({ start: "08:00", end: "09:00" }, { start: "10:00", end: "11:00" })).toBe(false);
  });
  it("returns true when one contains the other", () => {
    expect(timeRangesOverlap({ start: "08:00", end: "12:00" }, { start: "09:00", end: "10:00" })).toBe(true);
  });
});

describe("isWithinDateRange", () => {
  it("inclusive on both ends", () => {
    expect(isWithinDateRange("2026-04-15", "2026-04-15", "2026-07-15")).toBe(true);
    expect(isWithinDateRange("2026-07-15", "2026-04-15", "2026-07-15")).toBe(true);
  });
  it("returns false outside range", () => {
    expect(isWithinDateRange("2026-04-14", "2026-04-15", "2026-07-15")).toBe(false);
    expect(isWithinDateRange("2026-07-16", "2026-04-15", "2026-07-15")).toBe(false);
  });
});

describe("hoursUntil", () => {
  it("computes positive hours for future", () => {
    const now = new Date("2026-04-15T10:00:00Z");
    const target = new Date("2026-04-15T22:00:00Z");
    expect(hoursUntil(target, now)).toBe(12);
  });
  it("returns negative for past target", () => {
    const now = new Date("2026-04-15T10:00:00Z");
    const target = new Date("2026-04-15T08:00:00Z");
    expect(hoursUntil(target, now)).toBe(-2);
  });
});
