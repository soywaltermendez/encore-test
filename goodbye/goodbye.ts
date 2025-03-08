import { api } from "encore.dev/api";
import { Item } from "../items/db";

// This is a simple REST API that responds with a farewell message.
// To call it, run in your terminal:
//
//	curl http://localhost:4000/goodbye/World
//  curl "http://localhost:4000/goodbye?name=World&message=Hasta%20la%20vista"
//
export const get = api(
  { expose: true, method: "GET", path: "/goodbye/:name" },
  async ({ name }: { name: string }): Promise<Response> => {
    const msg = `Goodbye ${name}!`;
    return { message: msg };
  }
);

// This endpoint allows for more customization through query parameters
export const getCustom = api(
  { expose: true, method: "GET", path: "/goodbye" },
  async ({ name, message }: { name?: string, message?: string }): Promise<Response> => {
    const userName = name || "friend";
    const farewell = message || "Goodbye";
    const msg = `${farewell} ${userName}!`;
    return { message: msg };
  }
);

interface Response {
  message: string;
} 