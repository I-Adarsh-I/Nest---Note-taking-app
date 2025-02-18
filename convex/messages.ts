import { action, internalMutation, mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { internal } from "./_generated/api";

export const createNewSession = mutation({
  args: { userId: v.string(), sessionName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { userId } = args;

    if (!userId) {
      throw new ConvexError({
        message: "User ID is required to create a new session",
        code: 404,
      });
    }
    const session = await ctx.db.insert("sessions", {
      userId: userId,
      sessionStart: new Date().toISOString(),
      sesssionName: args.sessionName ? args.sessionName : "Untitled Chat",
      isActive: true,
    });
    return session;
  },
});

export const getSearch = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;

    if (!userId) {
      if (!userId) {
        throw new ConvexError({
          message: "User ID is required to create a new session",
          code: 404,
        });
      }
    }
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();
    return sessions;
  },
});

export const getMessagesBySession = query({
  args: {sessionId: v.id("sessions"), userId: v.string()},
  handler: async (ctx, args) => {
    const { sessionId } = args;

    if(!sessionId){
      throw new ConvexError({
        message:"Session ID required to search a session",
        code: 400 
      })
    }
    const session = await ctx.db.get(args.sessionId);

    if(!session){
      console.log("No session exists with provided sessionID");
      return session;
    }
    if(session.userId !== args.userId){
      throw new ConvexError({
        message: "User not authenticated!",
        code: 400
      })
    }

    return session;
  }
})

export const deleteSession = mutation({
  args: { sessionId: v.id("sessions"), userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;

    if (!userId) {
      if (!userId) {
        throw new ConvexError({
          message: "User ID is required to create a new session",
          code: 404,
        });
      }
    }

    const existingSession = await ctx.db.get(args.sessionId);
    if(!existingSession){
      throw new ConvexError({
        message: "Session does not exist",
        code: 401,
      });
    }

    if (existingSession.userId !== userId) {
      throw new ConvexError({
        message: "User not authorized to perform this action",
        code: 401,
      });
    }

    await ctx.db.delete(args.sessionId);
    return { message: "Session deleted successfully" };
  },
});

// export const generateAiResponse = action({
//   args: { prompt: v.optional(v.string()) },
//   handler: async (ctx, args) => {
//     const google = createGoogleGenerativeAI({
//       // custom settings
//       apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
//     });

//     const model = google("gemini-1.5-flash", {
//       safetySettings: [
//         {
//           category: "HARM_CATEGORY_HATE_SPEECH",
//           threshold: "BLOCK_LOW_AND_ABOVE",
//         },
//         {
//           category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
//           threshold: "BLOCK_LOW_AND_ABOVE",
//         },
//       ],
//     });

//     const response = await generateText({
//       model: model,
//       prompt: args.prompt,
//     });
//     return response.text;
//   },
// });


export const generateAiResponse = action({
  args: { sessionId: v.id("sessions"), userId: v.string(), prompt: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const model = google("gemini-1.5-flash", {
      safetySettings: [
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
      ],
    });

    await ctx.runMutation(internal.messages.saveMessage, {
      sessionId: args.sessionId,
      userId: args.userId,
      prompt: args.prompt,
      role: "user",
    });

    // Generate AI response
    const response = await generateText({
      model: model,
      prompt: args.prompt,
    });

    // Save AI's response
    const aiMessage: any = await ctx.runMutation(internal.messages.saveMessage, {
      sessionId: args.sessionId,
      userId: args.userId,
      prompt: response.text,
      role: "ai",
    });

    return aiMessage;
  },
});

export const saveMessage = internalMutation({
  args: {
    sessionId: v.id("sessions"),
    userId: v.string(),
    prompt: v.optional(v.string()),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      sessionId: args.sessionId,
      userId: args.userId,
      prompt: args.prompt,
      role: args.role,
      timestamp: new Date().toISOString(),
    });
  },
});

export const getChatHistory = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("sessionId", (q) => q.eq("sessionId", args.sessionId))
      .order("asc")
      .collect();
  },
});