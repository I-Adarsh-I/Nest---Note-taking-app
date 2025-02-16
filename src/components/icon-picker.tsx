"use client";

import { useTheme } from "next-themes";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface IconPickerProps {
  onChange: (icon: string) => void;
  children: React.ReactNode;
  // asChild?: boolean;
}

export const IconPicker = ({
  onChange,
  children,
  // asChild,
}: IconPickerProps) => {
  const { resolvedTheme } = useTheme();
  const themeMap: Record<"dark" | "light", Theme> = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
  };
  const theme = themeMap[(resolvedTheme as "dark" | "light") || "light"];

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="p-0 w-full border-none shadow-none">
        <EmojiPicker
          height={350}
          theme={theme}
          onEmojiClick={(data) => onChange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
};
