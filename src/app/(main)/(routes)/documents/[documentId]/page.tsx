"use client";

import { useMutation, useQuery } from "convex/react";

import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import Toolbar from "@/components/toolbar";
import { useParams } from "next/navigation";
import CoverImage from "@/components/cover-image";
import { Skeleton } from "@/components/ui/skeleton";
import Editor from "@/components/editor";
import { YDocProvider } from "@y-sweet/react";

const DocumentIdPage = () => {
  const params = useParams();
  const documentId = params?.documentId as Id<"documents">;

  const document = useQuery(api.documents.getDocumentById, {
    documentId,
  });

  const updateNote = useMutation(api.documents.update);
  const onChangeNoteContent = async (content: string) => {
    await updateNote({
      id: documentId,
      content,
    });
  };

  if (document === undefined) {
    return (
      <div>
        <CoverImage.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="pb-40">
        <CoverImage url={document.coverImage} />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
          <Toolbar initialData={document} />
          <YDocProvider docId={documentId} authEndpoint="/api/auth">
          <Editor
            onChange={onChangeNoteContent}
            initialContent={document.content}
            docId={documentId}
          />
          </YDocProvider>
        </div>
      </div>
  );
};

export default DocumentIdPage;
