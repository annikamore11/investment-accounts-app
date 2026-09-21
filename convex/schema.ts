import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// One row per signed-in user's journey, mirroring the old Supabase
// `user_journey` table. `journeyData` stays a single JSON blob (same shape
// as INITIAL_JOURNEY_DATA in src/components/journey/sections/index.js) for
// the same reason it did in Postgres: the journey's fields evolve with the
// product, and this table isn't queried by anything other than "give me
// this user's record."
export default defineSchema({
  journeys: defineTable({
    userId: v.string(), // Clerk user id (identity.subject)
    journeyData: v.any(),
    currentSection: v.string(),
    currentStep: v.number(),
    lastUpdated: v.number(),
  }).index("by_user", ["userId"]),
});
