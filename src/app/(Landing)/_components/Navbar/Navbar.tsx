"use client";

import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useScrollTop } from "@/hooks/scroll-to-top";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Spinner } from "@/components/loader";
import Link from "next/link";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});
const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const scrolled = useScrollTop();
  const { isLoading, isAuthenticated } = useConvexAuth();

  return (
    <>
      <div
        className={cn(
          "z-50 bg-background dark:bg-dark fixed top-0 w-full min-h-max py-3",
          scrolled && "border-b shadow-sm"
        )}
      >
        <div className="flex justify-between px-4">
          <div
            className={cn(
              "font-semibold text-center flex items-center gap-2",
              font.className
            )}
          >
            <div className="hidden md:flex items-center gap-x-2">
              <Image
                src="/nest-icon-dark.svg"
                height={40}
                width={40}
                alt="Logo"
                className="dark:hidden pointer-events-none"
              />
              <Image
                src="/nest-icon.svg"
                height={40}
                width={40}
                alt="Logo"
                className="hidden dark:block pointer-events-none"
              />
              <p className={cn("font-semibold", font.className)}>Nest</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            {isLoading && (
              <>
                <Spinner />
              </>
            )}
            {!isLoading && !isAuthenticated && (
              <>
                <SignInButton mode="modal">
                  <Button
                    variant={"ghost"}
                    className={cn(
                      "capitalize font-semibold text-sm",
                      font.className
                    )}
                  >
                    Log In
                  </Button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button
                    variant={"default"}
                    className={cn(
                      "capitalize font-semibold text-sm",
                      font.className
                    )}
                  >
                    Get nest free
                  </Button>
                </SignInButton>
              </>
            )}
            {isAuthenticated && !isLoading && (
              <>
                <Button variant={"ghost"} size={"default"} asChild>
                  <Link href={"/documents"} className="text-base">
                    Enter Nest
                    <ArrowRight />
                  </Link>
                </Button>
                <UserButton />
              </>
            )}
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
      </div>
    </>
  );
};

export default Navbar;
