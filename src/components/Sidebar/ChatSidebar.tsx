"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useParams, usePathname } from "next/navigation";

import { useMediaQuery } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";

import { ChevronsLeft, PanelLeft, PlusIcon } from "lucide-react";

import { api } from "../../../convex/_generated/api";

import Navbar from "@/app/(chat)/_components/ChatNavbar/Navbar";
import { Input } from "../ui/input";
import { ChatList } from "@/app/(chat)/_components/ChatList/ChatList";

const ChatSidebar = () => {
  const params = useParams();
  const pathname = usePathname();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const isResizingRef = useRef(false);
  const chatSidebarRef = useRef<HTMLElement | null>(null);
  const chatNavbarRef = useRef<HTMLDivElement>(null);

  const [isResetting, setIsResetting] = useState(false);
  const [chatbarIsCollapsed, setChatbarIsCollapsed] = useState(true);

  const createNewSession = useMutation(api.messages.createNewSession);

  useEffect(() => {
    // Collapse sidebar if not on /chat route
    if (pathname !== "/chat/[sessionId]") {
      setChatbarIsCollapsed(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (isSmallDevice) {
      collapseSidbar();
    } else {
      resetWidth();
    }
  }, [isSmallDevice]);

  useEffect(() => {
    if (isSmallDevice) {
      collapseSidbar();
    }
  }, [isSmallDevice, pathname]);

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return; // if isResizingRef is false, break the function
    let newWidth = event.clientX; // get the width

    if (newWidth < 240) newWidth = 240; // minimum width limit
    if (newWidth > 480) newWidth = 480; // maximum width limit

    // if chatSidebarRef and chatNavbarRef are active
    if (chatSidebarRef.current && chatNavbarRef.current) {
      chatSidebarRef.current.style.width = `${newWidth}px`; // set the sidebar width
      chatNavbarRef.current.style.setProperty("left", `${newWidth}px`); // reposition the navbar
      chatNavbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      ); // recalculate the navbar width
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (chatSidebarRef.current && chatNavbarRef.current) {
      setChatbarIsCollapsed(false);
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

  const collapseSidbar = () => {
    if (chatSidebarRef.current && chatNavbarRef.current) {
      setChatbarIsCollapsed(true);
      setIsResetting(true);

      chatSidebarRef.current.style.width = "0";
      chatNavbarRef.current.style.setProperty("width", "calc(100% - 15rem)");
      chatNavbarRef.current.style.setProperty("left", "240px");
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

  return pathname.startsWith("/chat/") ? (
    <>
      <aside
        ref={chatSidebarRef}
        className={cn(
          "group/chatSidebar h-full overflow-y-auto relative flex w-96 flex-col z-[99999] border-r border-black/20 shadow-[8px_0_16px_-4px_rgba(0,0,0,0.2)]",
          isResetting && "transition-all ease-in-out duration-300",
          isSmallDevice && "w-0"
        )}
      >
        <div className="px-2">
          <div className="py-2 flex item-center justify-between">
            <p>Nest AI</p>
            <div className="flex gap-2 item-center">
              <div
                role="button"
                onClick={collapseSidbar}
                className={cn(
                  "h-5 w-5 text-muted-foreground rounded-sm hover:bg-neutral-300 hover:dark:bg-neutral-600 opacity-0 group-hover/chatSidebar:opacity-100 transition",
                  isSmallDevice && "opacity-100"
                )}
              >
                <ChevronsLeft className="h-5 w-5" />
              </div>
              <div role="button" onClick={handleCreateNewChat} className="h-5 w-5 text-muted-foreground rounded-sm hover:bg-neutral-300 hover:dark:bg-neutral-600 cursor-pointer">
                <PlusIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
          <Input
            type="search"
            placeholder="Search or start a new chat"
            className="border border-muted-foreground ring-0 focus-visible:ring-0 outline-none"
          />
        </div>
        <div className="px-2 mt-5">
        <ChatList />
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
              isCollapsed={chatbarIsCollapsed}
              onResetWidth={() => resetWidth()}
            />
          </>
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {/* If the sidebar is collapsed, show the menu icon to let the user reopen the sidebar */}
            {chatbarIsCollapsed && (
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
