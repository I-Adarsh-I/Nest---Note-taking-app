"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage(""); // Clear input field after sending
    }
  };

  return (
    <div className="flex items-center justify-center gap-1 w-[600px] h-max">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="ring-0 rounded-full focus-visible:ring-blue-500 bg-neutral-300 dark:bg-neutral-700/30 border border-neutral-700 placeholder:text-muted-foreground"
        placeholder="Ask anything..."
        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
      />
      <Button className="rounded-full w-8 h-8" onClick={handleSendMessage}>
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  );
};
