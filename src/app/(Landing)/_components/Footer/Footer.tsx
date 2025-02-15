import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const Footer = () => {
  return (
    <>
      <div className="flex w-full items-center justify-between dark:bg-dark px-4">
        <div className="flex items-center justify-start">
          <div className="hidden md:flex items-center gap-x-2 mb-2">
            <Image
              src="/nest-icon-black.svg"
              height={40}
              width={40}
              alt="Logo"
              className="dark:hidden"
            />
            <Image
              src="/nest-icon-white.svg"
              height={40}
              width={40}
              alt="Logo"
              className="hidden dark:block"
            />
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
