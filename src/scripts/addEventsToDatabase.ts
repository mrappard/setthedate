

import "~/env";
import { saveWithKey } from "~/keystore";
import { MOCK_EVENTS } from "~/server/api/routers/events";

/**
 * Script to seed the Firestore database with mock events.
 * It uses the keystore module to save each event by its ID.
 */
async function seedEvents() {
  console.log("Starting to seed events into database...");
  
  for (const event of MOCK_EVENTS) {
    try {
      console.log(`Saving event: ${event.name} (ID: ${event.id})`);
      await saveWithKey("events", event.id, event);
    } catch (error) {
      console.error(`Failed to save event ${event.id}:`, error);
    }
  }
  
  console.log("Seeding completed.");
}

seedEvents().catch((error) => {
  console.error("Critical error during seeding:", error);
  process.exit(1);
});
