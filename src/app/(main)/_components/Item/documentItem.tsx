import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";

interface DocumentItemProps {
  // id?: Id<"documents">;
  documentIcon?: string;
  coverimgUrl?: string;
  label: string;
  altIcon?: LucideIcon;
  onClick?: () => void;
}

const DocumentItem = ({
  // id,
  documentIcon,
  coverimgUrl,
  label,
  altIcon: Icon,
  onClick,
}: DocumentItemProps) => {
  return (
    <div role="button" className="h-36 w-36 max-h-56 max-w-56 rounded-xl bg-secondary dark:bg-neutral-700 overflow-hidden flex flex-col items-start justify-between hover:outline outline-1 dark:outline-stone-600 cursor-pointer" onClick={onClick}>
      <div className="w-full">
        <div className="relative w-full h-[50px] max-h-[50px]">
          {!!coverimgUrl && (
            <Image
              src={coverimgUrl}
              fill
              alt="Cover Image"
              className="object-cover pointer-events-none"
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        <div className="relative bottom-3 left-2 text-2xl">
          {!!documentIcon
            ? documentIcon
            : Icon && <Icon className="h-6 w-6 mb-2 text-muted-foreground" />}
        </div>
      </div>
      <div className="w-full h-full flex p-1.5">
        <p className="text-xs md:text-sm text-muted-foreground dark:text-white/90 line-clamp-2 max-h-[40px] w-full">
          {label}
        </p>
      </div>
    </div>
  );
};

DocumentItem.skeleton = function documentItemSkeleton() {
  return <Skeleton className="h-36 w-36 rounded-xl" />;
};

export default DocumentItem;
