import { FeaturesSection } from "./_components/FeaturesSection/Features";
import Hero from "./_components/Hero/Hero";

const landing = () => {
  return (
    <div className="flex flex-col h-full">
      <Hero />
      <FeaturesSection />
    </div>
  );
};

export default landing;
