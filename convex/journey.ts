import { mutation, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

// All three functions derive the user from the authenticated request
// (ctx.auth) rather than trusting a client-supplied id — unlike the old
// Supabase version, which took `userId` as a plain argument and relied on
// Postgres row-level security (never actually defined anywhere in this
// repo) to stop one user reading another's row. This way there's nothing to
// misconfigure: an unauthenticated or mismatched request simply can't see
// or touch another user's journey.

const getOwnJourney = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return ctx.db
    .query("journeys")
    .withIndex("by_user", (q) => q.eq("userId", identity.subject))
    .unique();
};

export const get = query({
  args: {},
  handler: async (ctx) => {
    return getOwnJourney(ctx);
  },
});

export const save = mutation({
  args: {
    journeyData: v.any(),
    currentSection: v.string(),
    currentStep: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("journeys")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .unique();

    const record = {
      userId: identity.subject,
      journeyData: args.journeyData,
      currentSection: args.currentSection,
      currentStep: args.currentStep,
      lastUpdated: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, record);
    } else {
      await ctx.db.insert("journeys", record);
    }
  },
});

export const remove = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await getOwnJourney(ctx);
    if (existing) await ctx.db.delete(existing._id);
  },
});
