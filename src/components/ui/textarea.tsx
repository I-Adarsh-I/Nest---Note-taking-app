import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);

  return (
    <textarea
      className={cn(
        "flex min-h-[40px] w-full rounded-md bg-transparent px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={(el) => {
        if (el) {
          textAreaRef.current = el;
          el.style.height = "30px"; // Reset height on mount
          el.style.height = `${Math.min(el.scrollHeight, 120)}px`; // Ensure initial height calculation
        }
        if (typeof ref === "function") {
          ref(el);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
            el;
        }
      }}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
