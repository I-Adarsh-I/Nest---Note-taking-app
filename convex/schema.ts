import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    //Table for documents
    documents: defineTable({
        title: v.string(),
        userId: v.string(),
        isArchived: v.boolean(),
        parentDocument: v.optional(v.id("documents")),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.boolean(),
        prompt: v.optional(v.string())
    })
    .index("by_user",["userId"])
    .index("by_user_parent",["userId", "parentDocument"]),

    //Table for AI chat messages
    messages: defineTable({
        sessionId: v.id("sessions"),
        userId: v.string(),
        prompt: v.optional(v.string()),
        role: v.string(), // to set based on AI and user
        timestamp: v.string(),
    })
    .index("sessionId", ["sessionId"]),

    //Table for storing chat sessions
    sessions: defineTable({
        userId: v.string(),
        sesssionName: v.string(),
        sessionStart: v.string(),
        sessionEnd: v.optional(v.string()),
        isActive: v.boolean(),
    })
    .index("by_user", ["userId"])
    .index("by_active_session", ["userId", "isActive"])
})
