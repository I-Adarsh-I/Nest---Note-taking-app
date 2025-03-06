"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import ColourfulText from "@/components/ui/colourful-text";

export function ScreenScroll() {
  return (
    <div className="flex flex-col">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
            The <ColourfulText text="simplest" /> way to <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
              keep notes
              </span>
            </h1>
          </>
        }
      >
        <Image
          src={`/image.png`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
