import Image from "next/image";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentItemProps {
  id?: Id<"documents">;
  documentIcon?: string;
  coverimgUrl?: string;
  label: string;
  altIcon?: string;
  lastOpend?: Date;
  onClick?: () => void;
}

const DocumentItem = ({
  id,
  documentIcon,
  coverimgUrl,
  label,
  altIcon,
  lastOpend,
  onClick,
}: DocumentItemProps) => {
  return (
    <div className="h-56 w-56 max-h-56 max-w-56 rounded-md bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 hover:dark:bg-neutral-700 overflow-hidden flex flex-col items-start justify-center hover:border">
      <div className="w-full">
        <div className="w-full">
          {!!coverimgUrl && (
            <Image
              src={coverimgUrl}
              fill
              alt="Cover Image"
              className="object-cover pointer-events-none"
            />
          )}
        </div>
        <div className="absolute top-5 left-2">
          {!!documentIcon && documentIcon}
        </div>
      </div>
      <div>
        <p className="text-sm md:text-base text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};

DocumentItem.skeleton = function documentItemSkeleton(){
    return(
        <Skeleton className="h-56 w-56 rounded-md"/>
    )
}

export default DocumentItem;
