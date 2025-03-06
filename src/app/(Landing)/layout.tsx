import Footer from "./_components/Footer/Footer";
import Navbar from "./_components/Navbar/Navbar";

import { HeroHighlight } from "@/components/ui/hero-highlight";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <HeroHighlight>
      {/* <div className="min-h-full dark:bg-dark"> */}
      <Navbar />
      <main className="h-full">{children}</main>
      <Footer />
      {/* </div> */}
    </HeroHighlight>
  );
};

export default LandingLayout;
