"use client";

import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import AppSidebar from "./_components/Sidebar/Sidebar";

import { Spinner } from "@/components/loader";
import { SearchCommand } from "@/components/Modals/SearchCommand";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
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
    <div className="dark:bg-dark h-full flex" suppressHydrationWarning>
      <AppSidebar />
      <main className="h-full flex-1 overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
