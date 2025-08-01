import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add admin user
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

// List all admin users
export const listAdminUsers = query({
  handler: async (ctx) => {
    const admins = await ctx.db.query("admin_users").collect();
    return admins;
  },
});

// Check if user is admin
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