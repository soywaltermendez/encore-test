import { api } from "encore.dev/api";
import { addItem, getAllItems, markItemAsDone, Item } from "./db";

// Add a new item to the database
export const createItem = api(
  { expose: true, method: "POST", path: "/create-item" },
  async ({ title }: { title: string }): Promise<Item> => {
    return await addItem(title);
  }
);

// Get all items from the database
export const getItems = api(
  { expose: true, method: "GET", path: "/items" },
  async (): Promise<{ items: Item[] }> => {
    const items = await getAllItems();
    return { items };
  }
);

// Mark an item as done
export const markDone = api(
  { expose: true, method: "PUT", path: "/items/:id/done" },
  async ({ id }: { id: number }): Promise<{ item: Item | null }> => {
    const item = await markItemAsDone(id);
    return { item };
  }
); 