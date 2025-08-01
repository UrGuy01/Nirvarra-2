import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Admin Management Functions
export const checkAdminAccess = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const adminUser = await ctx.db
      .query("admin_users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .filter((q) => q.eq(q.field("is_active"), true))
      .first();
    
    return adminUser ? { isAdmin: true, role: adminUser.role } : { isAdmin: false };
  },
});

export const addAdminUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("super_admin"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    // Check if admin already exists
    const existingAdmin = await ctx.db
      .query("admin_users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    
    if (existingAdmin) {
      throw new Error("Admin user already exists");
    }
    
    const adminId = await ctx.db.insert("admin_users", {
      email: args.email,
      name: args.name,
      role: args.role,
      is_active: true,
      created_at: Date.now(),
    });
    
    return adminId;
  },
});

export const updateBookingStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    bookingStatus: v.union(v.literal("confirmed"), v.literal("pending"), v.literal("cancelled")),
    adminNotes: v.optional(v.string()),
    followUpDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookingId, {
      booking_status: args.bookingStatus,
      admin_notes: args.adminNotes,
      follow_up_date: args.followUpDate,
      updated_at: Date.now(),
    });
  },
});

export const updateAdminNotes = mutation({
  args: {
    bookingId: v.id("bookings"),
    adminNotes: v.string(),
    whatsappNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookingId, {
      admin_notes: args.adminNotes,
      whatsapp_number: args.whatsappNumber,
      updated_at: Date.now(),
    });
  },
});

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

// Customer profile functions
export const getCustomerProfile = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const customer = await ctx.db
      .query("customers")
      .filter((q) => q.eq(q.field("clerk_user_id"), args.clerkUserId))
      .first();
    return customer;
  },
});

export const getCustomerBookings = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("clerk_user_id"), args.clerkUserId))
      .order("desc")
      .collect();
    return bookings;
  },
});

export const updatePaymentStatus = mutation({
  args: { 
    bookingId: v.id("bookings"),
    paymentStatus: v.union(v.literal("pending"), v.literal("paid"), v.literal("cancelled")),
    paymentMethod: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookingId, {
      payment_status: args.paymentStatus,
      payment_method: args.paymentMethod,
      payment_date: args.paymentStatus === "paid" ? Date.now() : undefined,
      updated_at: Date.now(),
    });
  },
});

export const createBooking = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    clerk_user_id: v.optional(v.string()),
    check_in_date: v.string(),
    check_out_date: v.string(),
    guests: v.number(),
    stay_type: v.string(),
    activities_selected: v.array(v.string()),
    is_pet_bringer: v.boolean(),
    special_requests: v.optional(v.string()),
    total_amount: v.number(),
  },
  handler: async (ctx, args) => {
    // Calculate total nights
    const checkIn = new Date(args.check_in_date);
    const checkOut = new Date(args.check_out_date);
    const totalNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    const bookingId = await ctx.db.insert("bookings", {
      ...args,
      total_nights: totalNights,
      payment_status: "pending",
      booking_status: "pending",
      created_at: Date.now(),
      updated_at: Date.now(),
    });
    
    // Create or update customer profile
    if (args.clerk_user_id) {
      const existingCustomer = await ctx.db
        .query("customers")
        .filter((q) => q.eq(q.field("clerk_user_id"), args.clerk_user_id))
        .first();
      
      if (existingCustomer) {
        await ctx.db.patch(existingCustomer._id, {
          total_bookings: existingCustomer.total_bookings + 1,
          total_spent: existingCustomer.total_spent + args.total_amount,
          updated_at: Date.now(),
        });
      } else {
        await ctx.db.insert("customers", {
          clerk_user_id: args.clerk_user_id,
          name: args.name,
          email: args.email,
          phone: args.phone,
          total_bookings: 1,
          total_spent: args.total_amount,
          created_at: Date.now(),
          updated_at: Date.now(),
        });
      }
    }
    
    return bookingId;
  },
});

// Check for date conflicts
export const checkDateConflicts = query({
  args: { 
    checkInDate: v.string(),
    checkOutDate: v.string(),
    excludeBookingId: v.optional(v.id("bookings"))
  },
  handler: async (ctx, args) => {
    const checkIn = new Date(args.checkInDate);
    const checkOut = new Date(args.checkOutDate);
    
    // Get all bookings that overlap with the given date range
    const conflictingBookings = await ctx.db
      .query("bookings")
      .filter((q) => 
        q.and(
          q.neq(q.field("_id"), args.excludeBookingId || ""),
          q.or(
            // Case 1: New booking starts during existing booking
            q.and(
              q.gte(q.field("check_in_date"), args.checkInDate),
              q.lt(q.field("check_in_date"), args.checkOutDate)
            ),
            // Case 2: New booking ends during existing booking
            q.and(
              q.gt(q.field("check_out_date"), args.checkInDate),
              q.lte(q.field("check_out_date"), args.checkOutDate)
            ),
            // Case 3: New booking completely contains existing booking
            q.and(
              q.lte(q.field("check_in_date"), args.checkInDate),
              q.gte(q.field("check_out_date"), args.checkOutDate)
            )
          )
        )
      )
      .collect();
    
    return conflictingBookings;
  },
});

// Get all date conflicts for admin view
export const getAllDateConflicts = query({
  handler: async (ctx) => {
    const allBookings = await ctx.db.query("bookings").collect();
    const conflicts = [];
    
    for (let i = 0; i < allBookings.length; i++) {
      for (let j = i + 1; j < allBookings.length; j++) {
        const booking1 = allBookings[i];
        const booking2 = allBookings[j];
        
        const checkIn1 = new Date(booking1.check_in_date);
        const checkOut1 = new Date(booking1.check_out_date);
        const checkIn2 = new Date(booking2.check_in_date);
        const checkOut2 = new Date(booking2.check_out_date);
        
        // Check if dates overlap
        if (checkIn1 < checkOut2 && checkIn2 < checkOut1) {
          conflicts.push({
            booking1: {
              id: booking1._id,
              name: booking1.name,
              email: booking1.email,
              checkIn: booking1.check_in_date,
              checkOut: booking1.check_out_date,
              stayType: booking1.stay_type,
              status: booking1.booking_status
            },
            booking2: {
              id: booking2._id,
              name: booking2.name,
              email: booking2.email,
              checkIn: booking2.check_in_date,
              checkOut: booking2.check_out_date,
              stayType: booking2.stay_type,
              status: booking2.booking_status
            },
            overlapDays: Math.min(checkOut1.getTime(), checkOut2.getTime()) - Math.max(checkIn1.getTime(), checkIn2.getTime())
          });
        }
      }
    }
    
    return conflicts;
  },
});
