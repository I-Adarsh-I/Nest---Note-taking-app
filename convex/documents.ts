import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { ConvexError, v } from "convex/values";


export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: 400,
      });
    }

    const userId = identity.subject;

    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
      lastVisited: undefined,
    });

    return document;
  },
});

export const getAllDocuments = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: 400,
      });
    }
    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const recentlyVisited = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const { limit = 10 } = args;
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: 400,
      });
    }

    const userId = identity.subject;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_lastVisited", (q) =>
        q.eq("userId", userId).gte("lastVisited", thirtyDaysAgo)
      )
      .order("desc")
      .take(limit);

    return documents;
  },
});

export const updateLastVisited = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: 400,
      });
    }

    const userId = identity.subject;

    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new ConvexError({
        message: "Document not found",
        code: 404,
      });
    }

    if (document.userId !== userId) {
      throw new ConvexError({
        message: "User not authorized",
        code: 400,
      });
    }

    // Update lastVisited timestamp
    await ctx.db.patch(args.documentId, {
      lastVisited: new Date().toISOString(),
    });

    return { success: true, lastVisited: new Date().toISOString() };
  },
});

export const archive = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: 400,
      });
    }
    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new ConvexError({
        message: "Not found",
        code: 404,
      });
    }

    if (existingDocument.userId !== userId) {
      throw new ConvexError({
        message: "User not authorized",
        code: 401,
      });
    }

    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex(`by_user_parent`, (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });

        await recursiveArchive(child._id);
      }
    };

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });
    recursiveArchive(args.id);

    return document;
  },
});

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: 400,
      });
    }
    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    return documents;
  },
});

export const restoreNotes = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: 400,
      });
    }
    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new ConvexError({
        message: "No notes exists to restore",
        code: 404,
      });
    }
    if (existingDocument.userId !== userId) {
      throw new ConvexError({
        message: "User not authorized to restore note",
        code: 401,
      });
    }

    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });
        recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };
    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument);
      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }
    const document = await ctx.db.patch(args.id, options);

    recursiveRestore(args.id);

    return document;
  },
});

export const deleteNote = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: 400,
      });
    }
    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new ConvexError({
        message: "Note doesn't exist",
        code: 404,
      });
    }
    if (existingDocument.userId !== userId) {
      throw new ConvexError({
        message: "User not authorized to perform this action",
        code: 401,
      });
    }

    const document = await ctx.db.delete(args.id);

    return document;
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: 400,
      });
    }
    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const getDocumentById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const document = await ctx.db.get(args.documentId);

    if (!identity) {
      if (document?.isPublished && !document.isArchived) {
        return document;
      }
      throw new ConvexError({
        message: "User not authenticated",
        code: 400,
      });
    }

    const userId = identity?.subject;

    if (!document) {
      console.log("No document exists with specified docId");
      return document
      // throw new ConvexError({
      //   message: "No documents found",
      //   code: 404,
      // });
    }

    if (document.userId !== userId) {
      throw new ConvexError({
        message: "User not authorized",
        code: 400,
      });
    }


    return document;
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: 400,
      });
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new ConvexError({
        message: "No documents found",
        code: 404,
      });
    }

    if (existingDocument.userId !== userId) {
      throw new ConvexError({
        message: "User not authorized",
        code: 400,
      });
    }

    const document = await ctx.db.patch(args.id, { ...rest });

    return document;
  },
});

export const removeIcon = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        message: "User not authenticated",
        code: 400,
      });
    }

    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.documentId);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.patch(args.documentId, { icon: undefined });

    return document;
  },
});

export const removeCoverImage = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.patch(args.id, { coverImage: undefined });

    return document;
  },
});
