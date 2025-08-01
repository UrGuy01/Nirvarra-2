import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  bookings: defineTable({
    // Customer Information
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    clerk_user_id: v.optional(v.string()), // Link to Clerk user
    
    // Booking Details
    check_in_date: v.string(),
    check_out_date: v.string(),
    guests: v.number(),
    stay_type: v.string(),
    total_nights: v.number(),
    
    // Activities & Preferences
    activities_selected: v.array(v.string()),
    is_pet_bringer: v.boolean(),
    special_requests: v.optional(v.string()),
    
    // Payment Information
    total_amount: v.number(),
    payment_status: v.union(v.literal("pending"), v.literal("paid"), v.literal("cancelled")),
    payment_method: v.optional(v.string()),
    payment_date: v.optional(v.number()),
    
    // Booking Status
    booking_status: v.union(v.literal("confirmed"), v.literal("pending"), v.literal("cancelled")),
    
    // Admin Notes & Communication
    admin_notes: v.optional(v.string()),
    follow_up_date: v.optional(v.number()),
    whatsapp_number: v.optional(v.string()),
    
    // Timestamps
    created_at: v.number(),
    updated_at: v.number(),
  }),
  
  // Customer Profiles (linked to Clerk users)
  customers: defineTable({
    clerk_user_id: v.string(), // Link to Clerk user
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    is_admin: v.optional(v.boolean()), // Admin role flag (optional for existing records)
    preferences: v.optional(v.object({
      preferred_stay_type: v.optional(v.string()),
      dietary_restrictions: v.optional(v.string()),
      accessibility_needs: v.optional(v.string()),
    })),
    total_bookings: v.number(),
    total_spent: v.number(),
    created_at: v.number(),
    updated_at: v.number(),
  }),
  
  // Admin Users (for access control)
  admin_users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("super_admin"), v.literal("admin")),
    is_active: v.boolean(),
    created_at: v.number(),
  }),
});
