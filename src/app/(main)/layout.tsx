"use client";

import { Spinner } from "@/components/loader";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import AppSidebar from "./_components/Sidebar/Sidebar";
import { SearchCommand } from "@/components/Modals/SearchCommand";
//
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react";
import { createClient } from "@liveblocks/client";

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

  const client = createClient({
    publicApiKey:
      "pk_dev_18atbM2rF2tC_jWg_UqQ_5A_BMF-z36xl2joVMZugwt1o0jywpWobI12ueFMuctf",
  });
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
