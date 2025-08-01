import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllBookings = query({
  args: {},
  handler: async (ctx) => {
    const bookings = await ctx.db.query("bookings").order("desc").collect();
    return bookings;
  },
});

export const getBookingsByStayType = query({
  args: { stayType: v.string() },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("stay_type"), args.stayType))
      .order("desc")
      .collect();
    return bookings;
  },
});

export const getBookingsByDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .filter((q) =>
        q.and(
          q.gte(q.field("check_in_date"), args.startDate),
          q.lte(q.field("check_in_date"), args.endDate),
        ),
      )
      .order("desc")
      .collect();
    return bookings;
  },
});

export const deleteBooking = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const createBooking = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const bookingId = await ctx.db.insert("bookings", {
      ...args,
      created_at: Date.now(),
    });
    return bookingId;
  },
});
