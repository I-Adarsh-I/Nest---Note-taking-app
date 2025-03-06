"use client";

import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";

import { Poppins } from "next/font/google";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const Footer = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  return (
    <>
      <div className="flex flex-col gap-4 items-center justify-center py-16 md:py-20 w-full bg-transparent backdrop-blur-sm">
        <div className="bg-neutral-200 dark:bg-muted shadow-md rounded-lg h-16 w-16 flex items-center justify-center">
          <Logo />
        </div>
        <div className="flex flex-col gap-1 items-center justify-center">
          <h3 className="text-xl md:text-3xl font-medium">
            Ready to get started?
          </h3>
          <p className="text-sm md:text-lg text-muted-foreground">
            Try Nest and it's AI for free
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button
            variant={"outline"}
            className={cn("capitalize font-semibold text-sm", font.className)}
          >
            Download Nest
          </Button> */}
          {!isLoading && !isAuthenticated && (
            <>
              <SignInButton mode="modal">
                <Button
                  variant={"default"}
                  size={"sm"}
                  className={cn(
                    "capitalize font-semibold text-sm",
                    font.className
                  )}
                >
                  Sign In
                </Button>
              </SignInButton>
            </>
          )}
        </div>
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
      </div>
      <div className="flex w-full items-center justify-between px-4 bg-transparent backdrop-blur-sm">
        <div className="flex items-center justify-start">
          <div className="flex items-center gap-x-2 mb-2">
            <p className={cn("font-semibold", font.className)}>Nest</p>
          </div>
        </div>
        <div className="flex items-center justify-center text-muted-foreground">
          <Button variant={"link"} className="text-muted-foreground">
            Privacy Policy
          </Button>
          <Button variant={"link"} className="text-muted-foreground">
            T&C
          </Button>
        </div>
      </div>
    </>
  );
};

export default Footer;
