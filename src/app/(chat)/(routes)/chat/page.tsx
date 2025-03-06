"use client";

import { useMutation } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import MessageList from "../../_components/MessageList/MessageList";
import { ChatInput } from "../../_components/ChatInput/ChatInput";
import { api } from "../../../../../convex/_generated/api";

const ChatPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const createNewChatSession = useMutation(api.messages.createNewSession);

  const onCreateNewSession = async () => {
    try {
      const newSession = createNewChatSession({ sessionName: "Untitled Chat" });
      toast.promise(newSession, {
        loading: "Creating new chat session",
        success: "Created new chat session",
        error: "Error setting up a new chat session please try again later",
      });
      const newSessionId = await newSession;
      router.replace(
        `/chat/${newSessionId}}`
      );
    } catch (err) {
      console.error("error creating new chat session: ", err);
    }
  };
  return (
    <>
      <div className="h-full flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 h-full w-full my-4 mt-12 justify-center items-center">
          <MessageList />
          {pathname.startsWith("/chat/") &&
          <ChatInput onSendMessage={onCreateNewSession} />
          }
        </div>
      </div>
    </>
  );
};

export default ChatPage;
