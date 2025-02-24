"use client";

import { FlagTriangleRight, Lightbulb, PencilLine } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { PromptItem } from "../Item/PromptItem";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface Message {
  role: "user" | "ai";
  prompt: string;
}
interface MessageListProps {
  messages?: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  const { user } = useUser();
  const pathname = usePathname();
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({behavior: "smooth"})
  }, [messages]);

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
      {(messages?.length === 0 || !messages) ? (
        <>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl md:text-3xl text-center text-zinc-900/80 dark:text-white/65">
              Hi, {user?.fullName}
            </h1>
            <h3 className="text-2xl md:text-3xl text-center">
              Can I Help you with anything?
            </h3>
          </div>
          <div className="flex flex-wrap gap-4 items-center justify-center">
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
        </>
      ) : (
        <>
          <div className="h-full w-full lg:max-w-2xl p-4 rounded-lg">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex my-2 ${
                  msg.role === "user" ? "justify-end" : "flex-col justify-start mb-5"
                }`}
              >
                <div
                  className={`py-1.5 text-sm ${
                    msg.role === "user"
                      ? "rounded-3xl bg-neutral-300 dark:bg-neutral-700/20 px-3 max-w-lg"
                      : "bg-transparent"
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      strong: ({ node, ...props }) => (
                        <strong
                          className="tracking-wider font-medium text-gray-900 dark:text-gray-100"
                          {...props}
                        />
                      ),
                      em: ({ node, ...props }) => (
                        <em
                          className="italic text-gray-700 dark:text-gray-300"
                          {...props}
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <p
                          className={`${
                            msg.role === "user"
                              ? "dark:text-white/80"
                              : "bg-transparent text-black/90 dark:text-white/90 mb-1"
                          }`}
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          className="list-disc ml-2 md:ml-6 space-y-1 flex flex-col"
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          className="list-decimal ml-6 space-y-1 flex flex-col"
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li
                          className="ml-4 text-gray-800 dark:text-gray-300"
                          {...props}
                        />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="border-l-4 border-gray-400 pl-4 italic text-gray-600 dark:text-gray-300"
                          {...props}
                        />
                      ),
                      code: ({ node, ...props }) => (
                        <code
                          className={` px-2 py-0.5 rounded-md font-mono text-sm ${
                            msg.role === "user" ? "" : "bg-slate-300 dark:bg-slate-700 text-black/80 dark:text-white/80"
                          }`}
                          {...props}
                        />
                      ),
                      pre: ({ node, ...props }) => (
                        <pre
                          className="bg-gray-100 dark:bg-black/60 p-3 rounded-md overflow-x-auto text-sm my-3"
                          {...props}
                        />
                      ),
                      h1: ({ node, ...props }) => (
                        <h1
                          className="text-2xl font-bold mt-4 text-gray-900 dark:text-gray-100"
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2
                          className="text-xl font-semibold mt-3 text-gray-900 dark:text-gray-200"
                          {...props}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          className="text-lg font-semibold mt-2 text-gray-800 dark:text-gray-300"
                          {...props}
                        />
                      ),
                      h4: ({ node, ...props }) => (
                        <h4
                          className="text-md font-medium mt-2 text-gray-700 dark:text-gray-300"
                          {...props}
                        />
                      ),
                      a: ({ node, ...props }) => (
                        <a
                          className="text-blue-600 dark:text-blue-400 underline"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {msg.prompt}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          <div ref={messageEndRef} />
          </div>
        </>
      )}
    </div>
  );
};

export default MessageList;
