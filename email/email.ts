import { api, APIError } from "encore.dev/api";
import { Subscription } from "encore.dev/pubsub";
import { UserAddedTopic } from "../user/user";

// Simplified email sending function that just logs the email instead of actually sending it
export const send = api(
  { expose: false, method: "POST" },
  async ({ name, email }: {
    name: string;
    email: string;
  }): Promise<void> => {
    const msg = {
      to: email,
      from: "noreply@example.com",
      subject: `Welcome ${name}!`,
      text: "You are sooo welcome!",
    };

    try {
      // Instead of actually sending an email, we just log it
      console.log("Would send email:", msg);
    } catch (error) {
      console.error("Error sending email:", error);
      throw APIError.internal("Failed to send email");
    }
  },
);

// Subscribe to the UserAddedTopic to send welcome emails
const _ = new Subscription(UserAddedTopic, "welcome-email", {
  handler: async (event) => {
    await send(event);
  },
}); 