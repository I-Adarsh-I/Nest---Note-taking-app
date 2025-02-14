"use client";

import { useParams } from "next/navigation";
import { useMutation } from "convex/react";
import Image from "next/image";

import { ImageIcon, X } from "lucide-react";
import { Button } from "./ui/button";

import { useCoverImage } from "@/hooks/use-cover-image";

import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";

import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Skeleton } from "./ui/skeleton";

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

const CoverImage = ({ url, preview }: CoverImageProps) => {
  const params = useParams();
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();

  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  const onRemove = async () => {
    if (url) {
      console.log("Deleting cover image:", url);
      try {
        await edgestore.publicFiles.delete({ url });
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
    }
    removeCoverImage({ id: params.documentId as Id<"documents"> });
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && (
        <Image
          src={url}
          fill
          alt="Cover Image"
          className="object-cover pointer-events-none"
        />
      )}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => coverImage.onReplace(url)}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 2-4 mr-2" />
            Change cover
          </Button>
          <Button
            onClick={onRemove}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <X className="h-4 2-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

CoverImage.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-4 h-[12vh]" />;
};

export default CoverImage;
