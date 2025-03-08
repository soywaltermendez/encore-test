import { CronJob } from "encore.dev/cron";
import { api } from "encore.dev/api";
import { getAllItems } from "../items/db";

// Checks for pending items in the database
export const checkForGoodbyeMessages = api({}, async () => {
	// Get all items from the database
	const items = await getAllItems();
	
	// Count how many items are not done
	const pendingItems = items.filter(item => !item.done);
	
	console.log(`Found ${pendingItems.length} pending items out of ${items.length} total items`);
	
	// Return the count of pending items
	return {
		totalItems: items.length,
		pendingItems: pendingItems.length,
		pendingItemsList: pendingItems
	};
});

// Check for goodbye messages every 60 seconds.
const _ = new CronJob("goodbye-check", {
	title: "Check for goodbye messages",
	every: "60s",
	endpoint: checkForGoodbyeMessages,
})