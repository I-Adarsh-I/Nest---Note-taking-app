"use client";

import { useConvexAuth } from "convex/react";
import { ScreenScroll } from "../ScreenScroll/ScreenScroll";


const Hero = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <>
      <div className=" h-full flex flex-col gap-4 items-center justify-center">
        <div className="">
          <ScreenScroll />
        </div>
      </div>
    </>
  );
};

export default Hero;
