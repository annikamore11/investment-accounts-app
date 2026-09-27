import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// One row per signed-in user's journey, mirroring the old Supabase
// `user_journey` table. `journeyData` stays a single JSON blob (same shape
// as INITIAL_JOURNEY_DATA in src/components/journey/sections/index.js) for
// the same reason it did in Postgres: the journey's fields evolve with the
// product (several renamed/removed in a single session), and this table
// isn't queried by anything other than "give me this user's own record" —
// never across users, never filtered by field. A strict validator or a
// normalized schema would fight that iteration speed for no query pattern
// that actually needs it.
//
// journeyData does hold a couple of nested arrays/objects (`debts`,
// `expenseBreakdown`, `investingGoals`), but these are small and
// user-authored — bounded to a handful of entries, not the unbounded,
// ever-growing case (event logs, chat history) the "don't store unbounded
// arrays in a document" guideline is about. They stay in the blob rather
// than their own tables.
//
// If cross-user analytics is ever needed (funnel drop-off, "% missing
// their match," etc.), that belongs in a separate append-only table
// written alongside `save` in journey.ts — not a normalization of this
// blob.
export default defineSchema({
  journeys: defineTable({
    userId: v.string(), // Clerk user id (identity.subject)
    journeyData: v.any(),
    currentSection: v.string(),
    currentStep: v.number(),
    lastUpdated: v.number(),
    // Bumped by hand whenever a breaking shape change ships (a field
    // rename/removal that old saved data won't have) — lets future code
    // detect a stale-shaped blob instead of silently misreading it.
    // Optional: existing rows predate this field and get it filled in on
    // their next save (see CURRENT_SCHEMA_VERSION in journey.ts), rather
    // than needing a backfill migration to satisfy schema validation now.
    schemaVersion: v.optional(v.number()),
  }).index("by_user", ["userId"]),
});
