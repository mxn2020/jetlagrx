import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
export const saveProtocol = mutation({
  args: { origin: v.string(), destination: v.string(), departureTime: v.string(), arrivalTime: v.string(), schedule: v.array(v.object({ time: v.string(), action: v.string(), reason: v.string() })), tips: v.array(v.string()), severity: v.string() },
  handler: async (ctx, args) => await ctx.db.insert("protocols", { ...args, createdAt: Date.now() }),
});
export const getRecent = query({ args: {}, handler: async (ctx) => await ctx.db.query("protocols").order("desc").take(10) });
export const getStatus = query({ args: {}, handler: async () => ({ status: "Online", timestamp: Date.now() }) });
