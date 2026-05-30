import { describe, expect, test, vi } from "vitest";

describe("mock example", () => {
  test("vi.fn tracks calls and return values", () => {
    const fn = vi.fn((x: number) => x * 2);

    fn(3);

    expect(fn).toHaveBeenCalledWith(3);
    expect(fn).toHaveReturnedWith(6);
  });
});
