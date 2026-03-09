import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
export default defineSchema({
  ...authTables,
  protocols: defineTable({
    origin: v.string(), destination: v.string(), departureTime: v.string(), arrivalTime: v.string(),
    schedule: v.array(v.object({ time: v.string(), action: v.string(), reason: v.string() })),
    tips: v.array(v.string()), severity: v.string(), createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
