"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useParams, usePathname } from "next/navigation";

import { useMediaQuery } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";

import {
  ChevronsLeft,
  MenuIcon,
  PanelLeftClose,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import Item from "../Item/Item";
import UserOptions from "../UserSettings/UserOptions";
import { api } from "../../../../../convex/_generated/api";
import { DocumentList } from "../DocumentList/DocumentList";
import TrashCan from "../TrashCan/TrashCan";
import { useSearch } from "@/hooks/use-search";
import Navbar from "../NoteNavbar/Navbar";

const AppSidebar = () => {
  const search = useSearch();
  const params = useParams();
  const pathname = usePathname();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isSmallDevice);

  const createNewNote = useMutation(api.documents.create);

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

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return; // if isResizingRef is false, break the function
    let newWidth = event.clientX; // get the width

    if (newWidth < 240) newWidth = 240; // minimum width limit
    if (newWidth > 480) newWidth = 480; // maximum width limit

    // if sidebarRef and navbarRef are active
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`; // set the sidebar width
      navbarRef.current.style.setProperty("left", `${newWidth}px`); // reposition the navbar
      navbarRef.current.style.setProperty(
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
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isSmallDevice ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isSmallDevice ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty(
        "left",
        isSmallDevice ? "100%" : "240px"
      );
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapseSidbar = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const handleCreateNewNote = async () => {
    try {
      const newNote = createNewNote({ title: "Untitled Note" });

      toast.promise(newNote, {
        loading: "Creating a new note",
        success: "New note created",
        error: "Unexpected error occured please try again later",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    // <>
    //   <aside
    //     ref={sidebarRef}
    //     className={cn(
    //       "group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col w-60 z-[99999]",
    //       isResetting && "transition-all ease-in-out duration-300",
    //       isSmallDevice && "w-0"
    //     )}
    //   >
    //     <div
    //       role="button"
    //       className={cn(
    //         "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
    //         isSmallDevice && "opacity-100"
    //       )}
    //     >
    //       <PanelLeftClose onClick={collapseSidbar} className="h-6 w-6" />
    //     </div>
    //     <div>
    //       <UserOptions />
    //       <Item
    //         // onClick={() => search.onOpen()}
    //         label="Search"
    //         icon={Search}
    //         isSearch
    //       />
    //       <Item onClick={() => {}} label="Settings" icon={Settings} />
    //       <Item
    //         onClick={() => handleCreateNewNote()}
    //         label="New page"
    //         icon={PlusCircle}
    //       />
    //     </div>
    //     <div className="mt-4">
    //       <DocumentList />
    //       <Item
    //         onClick={() => handleCreateNewNote()}
    //         label="Add a page"
    //         icon={Plus}
    //       />
    //       <Popover>
    //         <PopoverTrigger className="w-full mt-4">
    //           <Item label="Trash" icon={Trash} />
    //         </PopoverTrigger>
    //         <PopoverContent
    //           side={isSmallDevice ? "bottom" : "right"}
    //           className="p-0 w-72"
    //         >
    //           {/* <p>Trash box</p> */}
    //           <TrashCan />
    //         </PopoverContent>
    //       </Popover>
    //     </div>
    //     <div
    //       onClick={resetWidth}
    //       onMouseDown={handleMouseDown}
    //       className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
    //     />
    //   </aside>
    //   <div
    //     ref={navbarRef}
    //     className={cn(
    //       "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
    //       isResetting && "transition ease-in-out duration-300",
    //       isSmallDevice && "left-0 w-full"
    //     )}
    //   >
    //     <nav className="bg-transparent px-3 py-2 w-full">
    //       {isCollapsed && (
    //         <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6" />
    //       )}
    //     </nav>
    //   </div>
    // </>
    
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isSmallDevice && "w-0"
        )}
      >
        {/* To collapse the sidebar */}
        <div
          role="button"
          onClick={collapseSidbar}
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isSmallDevice && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <UserOptions />
          <Item
            label="Search"
            icon={Search}
            isSearch
            onClick={search.onOpen}
          />
          <Item label="Settings" icon={Settings} onClick={() =>{}} />
          <Item onClick={handleCreateNewNote} label="New Page" icon={PlusCircle} />
        </div>
        <div className="mt-4">
          <DocumentList />
          <Item onClick={handleCreateNewNote} icon={Plus} label="Add a page" />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              side={isSmallDevice ? "bottom" : "right"}
              className="p-0 w-72"
            >
              <TrashCan />
            </PopoverContent>
          </Popover>
        </div>
        {/* To resize the sidebar */}
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      {/* Navbar */}
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isSmallDevice && "left-0 w-full"
        )}
      >
        {!!params.documentId ? (
          <>
            <Navbar isCollapsed={isCollapsed} onResetWidth={() => resetWidth()}/>
          </>
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {/* If the sidebar is collapsed, show the menu icon to let the user reopen the sidebar */}
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role="button"
                className="h-6 w-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};

export default AppSidebar;
