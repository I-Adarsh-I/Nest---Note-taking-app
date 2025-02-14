"use client";

import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { useCoverImage } from "@/hooks/use-cover-image";
import { useEdgeStore } from "@/lib/edgestore";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { SingleImageDropzone } from "../single-image-dropzone";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export const CoverImageModal = () => {
  const params = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const update = useMutation(api.documents.update);

  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();

  const onChange = async (file?: File) => {
    if (file) {
      setIsUploading(true);
      setProgress(0);
      setFile(file);

      try {
        const res = await edgestore.publicFiles.upload({
          file,
          options: { replaceTargetUrl: coverImage.url },
          onProgressChange: (progressValue) => {
            setProgress(progressValue);
          },
        });

        await update({
          id: params.documentId as Id<"documents">,
          coverImage: res.url,
        });

        onClose();
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    }
  };

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle>Cover Image</DialogTitle>
        </VisuallyHidden>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">
            Upload Cover Image
          </h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
        {isUploading && (
          <div className="w-full mt-4">
            <Progress value={progress} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
