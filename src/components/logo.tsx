import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const Logo = () => {
  return (
    <div className="flex items-center gap-x-2">
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
  );
};