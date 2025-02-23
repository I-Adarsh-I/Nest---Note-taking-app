"use client";

import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

import { Spinner } from "@/components/loader";
import AppSidebar from "@/components/Sidebar/Sidebar";
import { SearchCommand } from "@/components/Modals/SearchCommand";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size={"lg"} />
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect("/");
  }

  return (
    <div className="dark:bg-dark h-full w-full flex" suppressHydrationWarning>
      <AppSidebar />
      <main className="h-full flex-1 px-4 lg:px-0">
        <SearchCommand />
        {children}
      </main>
    </div>
  );
};

export default ChatLayout;
