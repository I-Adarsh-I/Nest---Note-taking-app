"use client";

import { FlagTriangleRight, Lightbulb, PencilLine } from "lucide-react";
import { PromptItem } from "../Item/PromptItem";
import { useUser } from "@clerk/clerk-react";

const MessageList = () => {
    const { user } = useUser();
  const predefinedPrompts = [
    {
      id: 1,
      icon: Lightbulb,
      description: "Nest AI: what is Nest and it's AI",
      subDescripion: "Nest capabilities",
    },
    {
      id: 2,
      icon: FlagTriangleRight,
      description: "Nest AI: what set's us apart",
      subDescripion: "Key Differentiators",
    },
    {
      id: 3,
      icon: PencilLine,
      description: "Write a note on Docker 🐋.",
      subDescripion: "Know about Docker",
    },
  ];
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl text-center text-zinc-900 dark:text-white/65">Hi, { user?.fullName }</h1>
            <h3 className="text-3xl text-center">Can I Help you with anything?</h3>
        </div>
      <div className="flex gap-4 items-center">
        {predefinedPrompts.map((prompt) => (
          <div key={prompt.id}>
            <PromptItem
              icon={prompt.icon}
              description={prompt.description}
              subDescription={prompt.subDescripion}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
