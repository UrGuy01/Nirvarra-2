import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  bookings: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    check_in_date: v.string(),
    check_out_date: v.string(),
    guests: v.number(),
    stay_type: v.string(),
    activities_selected: v.array(v.string()),
    is_pet_bringer: v.boolean(),
    special_requests: v.optional(v.string()),
    created_at: v.number(),
  }),
});
