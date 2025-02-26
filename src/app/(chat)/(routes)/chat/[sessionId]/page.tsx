"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAction, useQuery } from "convex/react";

import { ChatInput } from "@/app/(chat)/_components/ChatInput/ChatInput";
import MessageList from "@/app/(chat)/_components/MessageList/MessageList";

import { Spinner } from "@/components/loader";

import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

const LoadingAnimation = () => {
  const dotColors = ["bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-red-400"];

  return (
    <div className="absolute bottom-14 w-[550px] flex items-center justify-start space-x-1 text-xs font-normal mt-2">
      <span>Thinking</span>
      <div className="flex space-x-0.5">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className={`w-1 h-1 rounded-full animate-bounce ${dotColors[i]}`}
            style={{ animationDelay: `${i * 0.2}s` }}
          ></span>
        ))}
      </div>
    </div>
  );
};

const SessionIdPage = () => {
  const params = useParams();
  const [messages, setMessages] = useState<{ role: string; prompt: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const { sessionId } = params;

  const generateResponse = useAction(api.messages.generateAiResponse);
  const chatHistory = useQuery(api.messages.getChatHistory, {
    sessionId: sessionId as Id<"sessions">,
  });

  //send message to AI
  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { role: "user", prompt: message }]);
    setIsLoading(true);

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
    }finally{
      setIsLoading(false);
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

        {isLoading && <LoadingAnimation />}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default SessionIdPage;
