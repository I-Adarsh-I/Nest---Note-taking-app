import { LucideIcon } from "lucide-react";

interface PromptItemProps {
  icon: LucideIcon;
  description: string;
  subDescription: string;
}

export const PromptItem = ({
  icon: Icon,
  description,
  subDescription,
}: PromptItemProps) => {
  return (
    <div className="bg-neutral-300 dark:bg-neutral-600/50 rounded-lg w-36 h-3w-36 flex flex-col p-4 cursor-pointer">
      <div className="h-7 w-7 bg-white border border-neutral-300 dark:border-transparent dark:bg-dark rounded-md flex items-center justify-center">
        <Icon className="h-4 w-5" />
      </div>
      <p className="text-base text-black/80 dark:text-muted-foreground text-wrap">{description}</p>
      <p className="text-xs text-black/60 dark:text-muted-foreground/50 text-wrap">
        {subDescription}
      </p>
    </div>
  );
};
