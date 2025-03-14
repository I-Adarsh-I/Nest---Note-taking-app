"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";

import Toolbar from "@/components/toolbar";
import CoverImage from "@/components/cover-image";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

const DocumentIdPage = () => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  const params = useParams();
  const documentId = params?.documentId as Id<"documents">;

  const document = useQuery(api.documents.getDocumentById, {
    documentId,
  });
  const updateLastVisited = useMutation(api.documents.updateLastVisited)

  const updateNote = useMutation(api.documents.update);

  const onChangeNoteContent = async (content: string) => {
    updateNote({
      id: documentId,
      content,
    });
  };

  useEffect(() => {
    if (documentId) {
      updateLastVisited({ documentId });
    }
  }, [documentId, updateLastVisited]);

  if (document === null) {
    return <div>Not found</div>;
  }

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
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto px-4 xl:px-0">
        <Toolbar initialData={document} />
        <Editor
          onChange={onChangeNoteContent}
          initialContent={document.content}
        />
      </div>
    </div>
  );
};

export default DocumentIdPage;
