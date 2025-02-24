"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAction, useQuery } from "convex/react";

import { ChatInput } from "@/app/(chat)/_components/ChatInput/ChatInput";
import MessageList from "@/app/(chat)/_components/MessageList/MessageList";

import { Spinner } from "@/components/loader";

import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

const sessionIdPage = () => {
  const params = useParams();
  const [messages, setMessages] = useState<{ role: string; prompt: string }[]>(
    []
  );
  const { sessionId } = params;

  const generateResponse = useAction(api.messages.generateAiResponse);
  const chatHistory = useQuery(api.messages.getChatHistory, {
    sessionId: sessionId as Id<"sessions">,
  });

  //send message to AI
  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { role: "user", prompt: message }]);

    try {
      const aiResponse = await generateResponse({
        sessionId: sessionId as Id<"sessions">,
        prompt: message,
      });

      setMessages((prev) => [
        ...prev,
        { role: "ai", prompt: aiResponse.prompt },
      ]);
    } catch (err) {
      console.error("Error generating AI response:", err);
    }
  };

  useEffect(() => {
    if (chatHistory) {
      setMessages(
        chatHistory.map((msg) => ({
          role: msg.role,
          prompt: msg.prompt ?? "",
        }))
      );
    }
  }, [chatHistory]);

  return (
    <div className="h-full flex flex-col items-center justify-between">
      <div className="flex flex-col gap-2 h-full w-full overflow-x-hidden my-20 mt-12 justify-center items-center overflow-auto">
        {chatHistory === undefined ? (
          <div className="h-full w-full flex items-center justify-center">
            <Spinner size={"lg"}/>
          </div>
        ) : (
          <>
            <MessageList
              messages={messages.map((msg) => ({
                role: msg.role as "user" | "ai",
                prompt: msg.prompt,
              }))}
            />
          </>
        )}

        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default sessionIdPage;
