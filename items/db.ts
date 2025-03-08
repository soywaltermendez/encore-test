import { SQLDatabase } from "encore.dev/storage/sqldb";

// Define the database with the correct name format
export const db = new SQLDatabase("items_db", {
    migrations: "./migrations",
});

// Define the Item type
export interface Item {
    id: number;
    title: string;
    done: boolean;
}

// Add a new item to the database
export async function addItem(title: string): Promise<Item> {
    try {
        // Use exec instead of query for insert operations
        await db.exec`
            INSERT INTO item (title, done)
            VALUES (${title}, false)
        `;
        
        // Then query to get the inserted item
        const result = await db.query<Item>`
            SELECT id, title, done
            FROM item
            WHERE title = ${title}
            ORDER BY id DESC
            LIMIT 1
        `;
        
        // Get the first result
        for await (const row of result) {
            return row;
        }
        
        throw new Error("Failed to insert item");
    } catch (error) {
        console.error("Error adding item:", error);
        throw error;
    }
}

// Get all items
export async function getAllItems(): Promise<Item[]> {
    try {
        const result = await db.query<Item>`
            SELECT id, title, done
            FROM item
            ORDER BY id DESC
        `;
        
        // Collect all rows from the AsyncGenerator
        const items: Item[] = [];
        for await (const row of result) {
            items.push(row);
        }
        
        return items;
    } catch (error) {
        console.error("Error getting items:", error);
        return [];
    }
}

// Mark an item as done
export async function markItemAsDone(id: number): Promise<Item | null> {
    try {
        // Use exec for update operations
        await db.exec`
            UPDATE item
            SET done = true
            WHERE id = ${id}
        `;
        
        // Then query to get the updated item
        const result = await db.query<Item>`
            SELECT id, title, done
            FROM item
            WHERE id = ${id}
        `;
        
        // Get the first row
        for await (const row of result) {
            return row;
        }
        
        return null;
    } catch (error) {
        console.error("Error marking item as done:", error);
        return null;
    }
} 