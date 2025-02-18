import { action, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

export const createNewSession = mutation({
    args: {userId: v.string()},
    handler: async(ctx, args) => {
        const { userId } = args;

        if(!userId){
            throw new ConvexError({
                message: "User ID is required to create a new session",
                code: 404
            })
        }
        const session = await ctx.db.insert("sessions", {
            userId: userId,
            sessionStart: new Date().toISOString(),
            isActive: true,
        })
        return session
    }
})

export const generateAiResponse = action({
  args: { prompt: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const google = createGoogleGenerativeAI({
      // custom settings
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const model = google("gemini-1.5-flash", {
      safetySettings: [
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_LOW_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_LOW_AND_ABOVE",
        },
      ],
    });

    const response = await generateText({
      model: model,
      prompt: args.prompt,
    });
    return response.text;
  },
});
