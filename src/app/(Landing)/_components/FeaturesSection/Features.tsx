import { cn } from "@/lib/utils";
import { Cloud, History, ThumbsUp, Bot } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Access Anywhere",
      description:
        "Your notes seamlessly sync across all your devices in real-time—no manual updates needed.",
      icon: <Cloud />,
    },
    {
      title: "Feature-Packed",
      description:
        "From dynamic blocks and tables to code snippets and AI-powered assistance, Nest has everything you need.",
      icon: <Bot />,
    },
    {
      title: "Revisit Past Notes",
      description:
        "Keep track of all your notes with automatic saving and structured organization, so nothing gets lost.",
      icon: <History />,
    },
    {
      title: "Effortless Usability",
      description:
        "Simply open, write, and organize—no distractions, complex setups, or steep learning curves.",
      icon: <ThumbsUp />,
    },
  ];
  
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl md:text-4xl font-medium">
        Smart, Fast & Always in Sync
      </h2>
      <p className="text-sm md:text-lg mt-1 text-muted-foreground">
      Simplify your notes with an intuitive experience.
      </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
      </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
      )}
    >
      {index <= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index > 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-medium mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
