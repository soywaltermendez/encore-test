import { describe, expect, test } from "vitest";
import { get } from "./goodbye";

describe("get", () => {
  test("should combine string with parameter value", async () => {
    const resp = await get({ name: "world" });
    expect(resp.message).toBe("Goodbye world!");
  });
}); 