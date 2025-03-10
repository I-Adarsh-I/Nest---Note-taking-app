"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import { useMediaQuery } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";

import {
  ArrowLeft,
  ChevronsLeft,
  MessageSquareText,
  PanelLeft,
  PlusIcon,
} from "lucide-react";

import { api } from "../../../convex/_generated/api";

import { ChatList } from "@/app/(chat)/_components/ChatList/ChatList";
import Navbar from "@/app/(chat)/_components/ChatNavbar/Navbar";
import Item from "@/app/(chat)/_components/Item/Item";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const ChatSidebar = () => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const [searchTerm, setSearchTerm] = useState("");
  const chatSidebarRef = useRef<HTMLElement | null>(null);
  const chatNavbarRef = useRef<HTMLDivElement>(null);

  const [isResetting, setIsResetting] = useState(false);
  const [isChatbarCollapsed, setIsChatbarCollapsed] = useState(true);

  const createNewSession = useMutation(api.messages.createNewSession);
  const getChatSessions = useQuery(api.messages.getSearchByTerm, {
    query: searchTerm,
  });

  useEffect(() => {
    // Collapse sidebar if not on /chat route
    if (pathname !== "/chat/[sessionId]") {
      setIsChatbarCollapsed(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (isSmallDevice) {
      collapseSidebar();
    } else if (pathname.startsWith("/chat/")) {
      collapseSidebar();
    } else {
      resetWidth();
    }
  }, [isSmallDevice]);

  useEffect(() => {
    if (isSmallDevice) {
      collapseSidebar();
    }
  }, [isSmallDevice, pathname]);

  const resetWidth = () => {
    if (chatSidebarRef.current && chatNavbarRef.current) {
      setIsChatbarCollapsed(false);
      setIsResetting(true);

      chatSidebarRef.current.style.width = isSmallDevice ? "100%" : "320px";
      chatNavbarRef.current.style.setProperty(
        "width",
        isSmallDevice ? "0" : "calc(100% - 560px)"
      );
      chatNavbarRef.current.style.setProperty(
        "left",
        isSmallDevice ? "100%" : "560px"
      );
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapseSidebar = () => {
    if (chatSidebarRef.current && chatNavbarRef.current) {
      setIsChatbarCollapsed(true);
      setIsResetting(true);

      chatSidebarRef.current.style.width = "0";
      chatNavbarRef.current.style.setProperty("width", isSmallDevice ? "100%" : "calc(100% - 15rem)");
      chatNavbarRef.current.style.setProperty("left", isSmallDevice ? "0" : "240px");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const handleCreateNewChat = async () => {
    try {
      const newNote = createNewSession({ sessionName: "Untitled Chat" });

      toast.promise(newNote, {
        loading: "Creating a new chat",
        success: "New chat created",
        error: "Unexpected error occured please try again later",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onRedirect = (sessionId: string) => {
    collapseSidebar();
    router.push(`/chat/${sessionId}`);
  };

  useEffect(() => {
    if (pathname.startsWith("/chat/")) {
      collapseSidebar();
    } else {
      resetWidth();
    }
  }, [pathname]);
  
  return pathname.startsWith("/chat") ? (
    <>
      <aside
        ref={chatSidebarRef}
        className={cn(
          "group/chatSidebar h-full overflow-y-auto absolute md:relative bg-secondary md:bg-transparent flex w-96 flex-col z-[99999] border-r border-black/20 shadow-[8px_0_16px_-4px_rgba(0,0,0,0.2)]",
          isResetting && "transition-all ease-in-out duration-300",
          isSmallDevice && "w-0"
        )}
      >
        <div className="px-2">
          <div className="py-2 flex item-center justify-between">
            <p>Nest AI ✨</p>
            <div className="flex gap-2 item-center">
              <div
                role="button"
                onClick={collapseSidebar}
                className={cn(
                  "h-5 w-5 text-muted-foreground rounded-sm hover:bg-neutral-300 hover:dark:bg-neutral-600 opacity-0 group-hover/chatSidebar:opacity-100 transition",
                  isSmallDevice && "opacity-100"
                )}
              >
                <ChevronsLeft className="h-5 w-5" />
              </div>
              <div
                role="button"
                onClick={handleCreateNewChat}
                className="h-5 w-5 text-muted-foreground rounded-sm hover:bg-neutral-300 hover:dark:bg-neutral-600 cursor-pointer"
              >
                <PlusIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
          <Input
            type="search"
            placeholder="Search or start a new chat"
            className="border border-muted-foreground ring-0 focus-visible:ring-0 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="px-2 mt-5">
          {searchTerm ? (
            <div>
              {getChatSessions?.map((chat) => (
                <div key={chat._id} className="p-2 border-b">
                  <Item
                    id={chat._id}
                    label={chat.sessionName}
                    icon={MessageSquareText}
                    onClick={() => onRedirect(chat._id)}
                    active={params.sessionId === chat._id}
                  />
                </div>
              ))}
            </div>
          ) : (
            <ChatList />
          )}
        </div>
        <div className="w-full absolute bottom-2 flex flex-col gap-2">

        <div className=" flex md:hidden items-center justify-center">
          <Button variant={"default"} size={"sm"} className="w-11/12" onClick={handleCreateNewChat}>
            Create new chat
          </Button>
        </div>
        <div className="flex md:hidden items-center justify-center">
          <Button variant={"ghost"} size={"sm"} className="w-11/12" onClick={() => router.push("/documents")}>
            <ArrowLeft /> Back to Nest Notes
          </Button>
        </div>
        </div>
      </aside>
      {/* Navbar */}
      <div
        ref={chatNavbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-[560px] w-[calc(100%-560px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isSmallDevice && "left-0 w-full"
        )}
      >
        {!!params.sessionId ? (
          <>
            <Navbar
              isCollapsed={isChatbarCollapsed}
              onResetWidth={() => resetWidth()}
            />
          </>
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {/* If the sidebar is collapsed, show the menu icon to let the user reopen the sidebar */}
            {isChatbarCollapsed && (
              <PanelLeft
                onClick={resetWidth}
                role="button"
                className="h-5 w-5 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  ) : null;
};

export default ChatSidebar;
