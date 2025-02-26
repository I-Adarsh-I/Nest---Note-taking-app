"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/clerk-react";

import CoverImage from "@/components/cover-image";
import Toolbar from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

const DocumentIdPage = () => {
  const params = useParams();
  const { user } = useUser();

  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  const document = useQuery(api.documents.getDocumentById, {
    documentId: params.documentId as Id<"documents">,
  });

  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    if(!user){
      console.log("User not authenticated. Update blocked.");
      return;
    }

    update({ id: params.documentId as Id<"documents">, content: content });
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

  if (document === null) {
    return <div>Not found</div>;
  }

  return (
    <div className="pb-40">
      <CoverImage preview url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto h-full">
        <Toolbar preview initialData={document} />
        <Editor
          editable={false}
          onChange={onChange}
          initialContent={document.content}
        />
      </div>
    </div>
  );
};

export default DocumentIdPage;
