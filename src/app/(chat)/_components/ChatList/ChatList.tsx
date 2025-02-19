"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { MessageSquareText } from "lucide-react";

import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import Item from "../Item/Item";

export const ChatList = () => {
  const params = useParams();
  const router = useRouter();

  const chatSessions = useQuery(api.messages.getAllChats, {});

  const onRedirect = (sessionId: string) => {
    router.push(`/chat/${sessionId}`);
  };

  // In convex, the query will only result in undefined if it is loading
  // otherwise, it will have a data or null
  if (chatSessions === undefined) {
    return (
      <>
        <>
          <Item.skeleton />
          <Item.skeleton />
          <Item.skeleton />
        </>
      </>
    );
  }

  return (
    <>
      <div className="max-h-[100px] overflow-auto">
        {chatSessions.map((session) => (
          <div key={session._id}>
            <Item
              id={session._id as Id<"sessions">}
              onClick={() => onRedirect(session._id)}
              label={session.sessionName}
              icon={MessageSquareText}
              active={params.sessionId === session._id}
            />
          </div>
        ))}
      </div>
    </>
  );
};
