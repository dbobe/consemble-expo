import { ID } from "jazz-tools";
import { ListOfQuests } from "./schema";

// Quests are now stored in the jazz database, load them using this covalue id
// see account_dashboard.tsx for an example of how to load them
// keeping the below hard coded list for reference. Delete it whenever you think we don't need it anymore

// Dev environment quest list ID
export const DEV_QUESTS_ID = "co_zcG4cSqHrVH3HkpYz4T7ka1VAhP" as ID<
  typeof ListOfQuests
>;

// Production environment quest list ID
export const PROD_QUESTS_ID = "co_zauJ3s4WiHajEFZGfWvgR4UjSZL" as ID<
  typeof ListOfQuests
>;

// Use the appropriate ID based on environment
const VITE_ENV = process.env.VITE_ENV || "development";

export const ALL_QUESTS_ID =
  VITE_ENV === "production" ? PROD_QUESTS_ID : DEV_QUESTS_ID;

console.log("vite env:", VITE_ENV);
