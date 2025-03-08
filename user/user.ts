import { api, APIError } from "encore.dev/api";
import { Topic } from "encore.dev/pubsub";
import { SQLDatabase } from "encore.dev/storage/sqldb";

interface UserRequest {
  name: string;
  email: string;
}

// Define the database
export const db = new SQLDatabase("user_db", {
  migrations: "./migrations",
});

// Define the topic for user added events
export const UserAddedTopic = new Topic<UserRequest>("user-added", {
  deliveryGuarantee: "at-least-once",
});

// Add a new user
export const add = api(
  { expose: true, method: "POST", path: "/user" },
  async ({ name, email }: UserRequest): Promise<User> => {
    try {
      await db.exec`
          INSERT INTO users (name, email)
          VALUES (${name}, ${email})
      `;

      // Publish event when user is added
      await UserAddedTopic.publish({ name, email });

      // Get the user we just created
      const result = await db.query<User>`
          SELECT id, name, email
          FROM users
          WHERE name = ${name} AND email = ${email}
          ORDER BY id DESC
          LIMIT 1
      `;
      
      for await (const row of result) {
        return row;
      }
      
      throw APIError.internal("Failed to retrieve created user");
    } catch (error) {
      console.error("Error adding user:", error);
      throw APIError.internal("Failed to add user");
    }
  },
);

// Define the User type
interface User {
  id: number;
  name: string;
  email: string;
}

// Get a user by ID
export const get = api(
  { expose: true, method: "GET", path: "/user/:id" },
  async ({ id }: { id: number }): Promise<User> => {
    try {
      const result = await db.query<User>`
          SELECT id, name, email
          FROM users
          WHERE id = ${id}
      `;
      
      for await (const row of result) {
        return row;
      }
      
      throw APIError.notFound("User not found");
    } catch (error) {
      console.error("Error getting user:", error);
      throw APIError.internal("Failed to get user");
    }
  },
);

// List all users
export const list = api(
  { expose: true, method: "GET", path: "/users" },
  async (): Promise<{ users: User[] }> => {
    try {
      const result = await db.query<User>`
          SELECT id, name, email
          FROM users
      `;
      
      const users: User[] = [];
      for await (const row of result) {
        users.push(row);
      }
      
      return { users };
    } catch (error) {
      console.error("Error listing users:", error);
      return { users: [] };
    }
  },
); 