"use client";

import { Spinner } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <>
      <div className=" h-full flex flex-col gap-4 items-center justify-center">
        <div className="">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl md:max-w-4xl text-center font-medium sm:text-wrap">
            Think, plan and track{" "}
          </h1>
          <h3 className="text-zinc-400 text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-center">
            all in one place
          </h3>
          <p className="text-center text-zinc-900 dark:text-white/95 mt-2 sm:mt-3 md:mt-4 lg:mt-5 text-base md:text-lg">
          Capture thoughts or detailed notes
          </p>
          <div className="w-full flex items-center justify-center">
            {isLoading ? (
              <div className="mt-5 sm:mt-3 md:mt-7 lg:mt-8">
                <Spinner size={"lg"} />
              </div>
            ) : (
              <>
                {isAuthenticated && !isLoading ? (
                  <>
                  <Button
                    variant={"default"}
                    className="mt-2 sm:mt-3 md:mt-4 lg:mt-5 text-sm md:text-base"
                    asChild
                  >
                    <Link href={"/documents"}>
                      Enter Nest <ArrowRight />
                    </Link>
                  </Button>
                  </>
                ) : (
                  <SignInButton>
                    <Button
                      variant={"default"}
                      className="mt-2 sm:mt-3 md:mt-4 lg:mt-5 text-sm md:text-base"
                    >
                      Get Nest free <ArrowRight />
                    </Button>
                  </SignInButton>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
