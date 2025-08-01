import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Setup function to add the first admin user
export const setupFirstAdmin = mutation({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if any admin already exists
    const existingAdmins = await ctx.db.query("admin_users").collect();
    
    if (existingAdmins.length > 0) {
      throw new Error("Admin users already exist. Use addAdminUser instead.");
    }
    
    // Add the first super admin
    const adminId = await ctx.db.insert("admin_users", {
      email: args.email,
      name: args.name,
      role: "super_admin",
      is_active: true,
      created_at: Date.now(),
    });
    
    return adminId;
  },
}); 