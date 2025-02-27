"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { api } from "../../../convex/_generated/api";
import { useSearch } from "@/hooks/use-search";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { File, MessageSquareText } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DialogTitle } from "../ui/dialog";

export const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const documents = useQuery(api.documents.getSearch);
  const getChatSessions = useQuery(api.messages.getSearch);
  const [isMounted, setIsMounted] = useState(false);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
  
    document.addEventListener("keydown", down);
  
    return () => document.removeEventListener("keydown", down);
  }, [toggle, isOpen]);
  

  const onSelect = (id: string) => {
    if(pathname.startsWith("/chat") || pathname.startsWith("/chat/")){
      router.push(`/chat/${id}`);
    }else{
      router.push(`/documents/${id}`);
    }
    onClose();
  };

  if (!isMounted) return null;
  // const safeDocuments = Array.isArray(documents) ? documents : [];
  
  return !pathname.startsWith("/chat") ?  (
    <CommandDialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogTitle className="sr-only">Search</DialogTitle> 
      <CommandInput placeholder={`Search ${user?.fullName}'s Notion...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              value={`${document._id}-${document.title}`}
              title={document.title}
              onSelect={onSelect}
            >
              {document.icon ? (
                <p className="mr-2 text-[18px]">{document.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  ) : (
    <CommandDialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogTitle className="sr-only">Search</DialogTitle> 
      <CommandInput placeholder={`Search all chats`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Chat sessions">
          {getChatSessions?.map((chat) => (
            <CommandItem
              key={chat._id}
              value={`${chat._id}-${chat.sessionName}`}
              title={chat.sessionName}
              onSelect={onSelect}
            >
                <MessageSquareText className="mr-2 h-4 w-4" />
              <span>{chat.sessionName}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
};