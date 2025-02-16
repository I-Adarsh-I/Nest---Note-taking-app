"use client";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronsLeftRight, Moon, Sun } from "lucide-react";
import { Logo } from "@/components/logo";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const Appearance = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            role="button"
            className="flex items-center text-sm p-2 w-full hover:bg-primary/5"
          >
            <div className="max-w-[150px]">
              <Logo />
            </div>
            <ChevronsLeftRight className="rotate-90 ml-20 text-muted-foreground h-4 w-4" />
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
              Current appearance : {localStorage.getItem("nest-theme")}
            </p>
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
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Appearance;
