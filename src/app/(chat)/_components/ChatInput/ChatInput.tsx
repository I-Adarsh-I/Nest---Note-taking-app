"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="flex items-end justify-center gap-2 w-full max-w-[600px] h-max fixed bottom-3 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-3xl">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full max-h-[120px] overflow-y-auto ring-0 rounded-3xl focus-visible:ring-0 placeholder:text-muted-foreground p-2 resize-none"
        placeholder="Ask anything..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />
      <Button
        className="rounded-full w-9 h-9 flex items-center justify-center mr-0.5 mb-0.5"
        onClick={handleSendMessage}
        disabled={!message.trim()}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
};
