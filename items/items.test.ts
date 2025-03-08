import { describe, expect, test } from "vitest";
import { createItem, getItems, markDone } from "./items";

describe("items", () => {
  test("should create an item", async () => {
    const item = await createItem({ title: "Test item" });
    expect(item.title).toBe("Test item");
    expect(item.done).toBe(false);
  });
}); 