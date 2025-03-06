"use client";

import { useTheme } from "next-themes";

import { SignOutButton, useUser } from "@clerk/clerk-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronsLeftRight, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const UserOptions = () => {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            role="button"
            className="flex items-center text-sm p-3 w-full hover:bg-primary/5"
          >
            <div className="gap-x-2 flex items-center max-w-[150px]">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user?.imageUrl} />
              </Avatar>
              <span className="text-start font-medium line-clamp-1">
                {user?.fullName}&apos;s Nest
              </span>
            </div>
            <ChevronsLeftRight className="rotate-90 ml-4 text-muted-foreground h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-80"
          align="start"
          alignOffset={11}
          forceMount
        >
          <div className="flex flex-col space-y-4 p-2">
            <p className="text-xs font-medium leading-none text-muted-foreground">
              {user?.emailAddresses[0].emailAddress}
            </p>
            <div className="flex items-center justify-between gap-x-2">
              <div className="flex items-center gap-2">

              <div className="rounded-md bg-secondary p-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.imageUrl} />
                </Avatar>
              </div>
              <div className="space-y-1">
                <p className="text-sm line-clamp-1">
                  {user?.fullName}&apos;s Nest
                </p>
              </div>
              </div>

              <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            </div>
            
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            asChild
            className="w-full cursor-pointer text-muted-foreground"
          >
            <SignOutButton>
              <div className="flex items-center justify-between w-full">
                Log Out
              <LogOut />
              
              </div>
            </SignOutButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserOptions;
