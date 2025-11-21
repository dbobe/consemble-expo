import { co, z } from "jazz-tools";

export const difficultyLevels = ["easy", "medium", "hard"] as const;
export const allRatings = ["-1", "0", "1", "2"] as const;

export const QuestSchema = co
  .map({
    title: z.string(),
    description: z.string(),
    imageUrl: z.string(),
    twigs: z.number(),
    difficulty: z.enum(difficultyLevels),
    category: z.string(),
    categories: z.array(z.string()),
    completed: z.boolean(),
    totalVotes: z.number(),
    vibeScore: z.number(),
  })
  .withMigration((quest) => {
    if (quest.categories === undefined) {
      quest.$jazz.set("categories", [quest.category]);
    }
    if (quest.totalVotes === undefined) quest.$jazz.set("totalVotes", 10);
    if (quest.vibeScore === undefined) {
      quest.$jazz.set("vibeScore", 0.5);
    }
  });
export type Quest = co.loaded<typeof QuestSchema>;

export const ListOfQuests = co.list(QuestSchema);

export const QuestInteraction = co
  .map({
    quest: QuestSchema,
    completed: z.boolean(),
    completedAt: z.date().optional(),
    rating: z.enum(allRatings).optional(),
  })
  .withMigration((quest) => {
    if (quest.completed && quest.completedAt === undefined) {
      quest.$jazz.set("completedAt", new Date(0));
    }
    if (quest.completed && quest.rating === undefined) {
      quest.$jazz.set("rating", "-1");
    }
  });
export const ListOfQuestInteractions = co.list(QuestInteraction);
export type QuestInteractionType = co.loaded<typeof QuestInteraction>;

export const categories = [
  "Arts and Crafts",
  "Food",
  "Adventure",
  "Health and Fitness",
  "Social",
  "Spiritual",
  "Games",
  "Music and Movies",
  "Personal Growth",
  "Home Life",
  "Finances",
  // New Categories Below Here
  "Physical Health",
  "Outdoor Adventure",
  "Visual Art",
  "Reading",
  "Games",
  "Friends",
  "Family",
  "New People",
  "Music",
  "Relaxation",
  "Self Care",
  "Explore",
  "DIY",
  "Writing",
  "Crafts",
  "Self Improvement",
  "Baking",
  "Cooking",
  "Recipes",
  // Round 3...
  "Acts of Kindness",
  "Art",
  "Beverages",
  "Exploring",
  "Fitness",
  "Grilling",
  "Movies",
  "Restaurants",
] as const;

const oldCats = [
  "Arts and Crafts",
  "Food",
  "Adventure",
  "Health and Fitness",
  "Social",
  "Spiritual",
  "Music and Movies",
  "Personal Growth",
  "Home Life",
  "Finances",
];

export const ListOfInterestCategories = co.list(z.enum(categories));

export const ConsembleProfile = co.profile({
  // for some reason Profile requires a "name" field.. we can pull from Clerk??
  name: z.string(),
  preferredFirstName: z.string(),
  preferredLastName: z.string(),
  gender: z.enum(["male", "female", "nonbinary", "other", "not set"]),
  preferredEmail: z.string(),
  ageRange: z.enum(["15-20", "21-29", "31-39", "40+", "not set"]),
});

export const ConsembleRoot = co.map({
  quests: ListOfQuests,
  questInteractions: ListOfQuestInteractions,
  interestedCategories: ListOfInterestCategories,
  twigsTotal: z.number(),
  streak: z.number(),
  lastDateCompleted: z.date(), // date of last completed quest to calculate streak
  lastNewQuestInteraction: z.date(),
  lastLogin: z.date(), // date of last login to calculate streak
  completedOnboarding: z.boolean(),
  currentQuest: QuestSchema.optional(), // Store the current quest being viewed
  vibeMeter: z.number(),
  lastVibeSurveyDate: z.date(), // date of last completed daily vibe survey
});

export type ConsembleAccountType = co.loaded<typeof ConsembleAccount>;

export const ConsembleAccount = co
  .account({
    root: ConsembleRoot,
    profile: ConsembleProfile,
  })
  .withMigration(
    async (
      account,
      creationProps?: { name: string; other?: Record<string, unknown> },
    ) => {
      console.log("migrating account");

      // Crear root si no existe
      if (!account.$jazz.has("root")) {
        console.log("creating root");
        account.$jazz.set(
          "root",
          ConsembleRoot.create({
            quests: ListOfQuests.create([]),
            questInteractions: ListOfQuestInteractions.create([]),
            interestedCategories: ListOfInterestCategories.create([]),
            twigsTotal: 0,
            streak: 0,
            lastDateCompleted: new Date(0),
            lastNewQuestInteraction: new Date(0),
            lastLogin: new Date(0),
            completedOnboarding: false,
            vibeMeter: 60,
            lastVibeSurveyDate: new Date(0),
          }),
        );
      }

      // Crear profile si no existe
      if (account.profile === undefined) {
        console.log("creating profile!");
        account.$jazz.set(
          "profile",
          ConsembleProfile.create({
            name: creationProps?.name ? creationProps.name : "",
            preferredFirstName: "",
            preferredLastName: "",
            preferredEmail: "",
            gender: "not set",
            ageRange: "not set",
          }),
        );
      }

      // We need to load the root field to check for the myContacts field
      const { root } = await account.$jazz.ensureLoaded({
        resolve: {
          root: {
            interestedCategories: true,
            questInteractions: { $each: { quest: true } },
          },
        },
      });

      if (root.interestedCategories === undefined) {
        root.$jazz.set(
          "interestedCategories",
          ListOfInterestCategories.create([]),
        );
      } else {
        const hasOldCats = root.interestedCategories.some((category) =>
          oldCats.includes(category),
        );

        if (hasOldCats) {
          console.log("Removing retired categories");
          const cleanedCategories = root.interestedCategories.filter(
            (category) => !oldCats.includes(category),
          );
          root.$jazz.set(
            "interestedCategories",
            ListOfInterestCategories.create(cleanedCategories),
          );
        }
      }

      if (!root.$jazz.has("twigsTotal")) root.$jazz.set("twigsTotal", 0);
      if (!root.$jazz.has("streak")) root.$jazz.set("streak", 0);
      if (!root.$jazz.has("lastLogin")) root.$jazz.set("lastLogin", new Date());
      if (!root.$jazz.has("lastNewQuestInteraction"))
        root.$jazz.set("lastNewQuestInteraction", new Date(0));
      if (!root.$jazz.has("vibeMeter")) root.$jazz.set("vibeMeter", 60);
      if (!root.$jazz.has("lastVibeSurveyDate"))
        root.$jazz.set("lastVibeSurveyDate", new Date(0));
      if (!root.$jazz.has("completedOnboarding"))
        root.$jazz.set("completedOnboarding", false);

      checkUserVibe(root);
      checkUserStreak(root);
    },
  );

// check the consecutive logins
function checkUserStreak(root: co.loaded<typeof ConsembleRoot>) {
  if (!root.$jazz || typeof root.$jazz.set !== "function") {
    console.warn("root.$jazz is not available, skipping streak check");
    return;
  }
  const currDate = new Date();
  const yesterday = new Date();
  yesterday.setDate(currDate.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const userLastLoginDate = new Date(root.lastLogin);
  userLastLoginDate.setHours(0, 0, 0, 0);
  currDate.setHours(0, 0, 0, 0);

  let loggedInToday = false;
  if (userLastLoginDate.getTime() === currDate.getTime()) {
    loggedInToday = true;
  }

  if (!loggedInToday) {
    if (userLastLoginDate.getTime() < yesterday.getTime()) {
      root.$jazz.set("streak", 0);
    }
    root.$jazz.set("lastLogin", currDate);
  }

  const userLastInteractedDate = new Date(root.lastNewQuestInteraction);
  userLastInteractedDate.setHours(0, 0, 0, 0);
  if (userLastInteractedDate.getTime() < yesterday.getTime()) {
    root.$jazz.set("streak", 0);
    console.log("resetting streak due to inactivity");
  }
}

function checkUserVibe(root: co.loaded<typeof ConsembleRoot>) {
  const userLastLoginDate = new Date(root.lastLogin);
  const dateNow = new Date();

  const diffInMs = Math.abs(dateNow.getTime() - userLastLoginDate.getTime());
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.floor(diffInMs / millisecondsPerDay);

  if (diffDays > 0) {
    root.$jazz.set(
      "vibeMeter",
      Math.max(0, Math.min(root.vibeMeter - diffDays * 5, 120)),
    );
  }
}
