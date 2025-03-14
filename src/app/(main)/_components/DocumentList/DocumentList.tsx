"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { FileIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import Item from "../Item/Item";

import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";

interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}

export const DocumentList = ({
  parentDocumentId,
  level = 0,
}: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const documents = useQuery(api.documents.getAllDocuments, {
    parentDocument: parentDocumentId,
  });

  const onRedirect = (documentId: string) => {
    router.prefetch(`/documents/${documentId}`);
    router.replace(`/documents/${documentId}`);
  };

  // In convex, the query will only result in undefined if it is loading
  // otherwise, it will have a data or null
  if (documents === undefined) {
    return (
      <>
        <Item.skeleton level={level} />
        {level === 0 && (
          <>
            <Item.skeleton level={level} />
            <Item.skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      {/* This paragraph will be rendered if it is the last element in the document tree */}
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No pages inside
      </p>
      <div className="max-h-[300px] md:max-h-[400px] overflow-auto">
      {documents.map((document) => (
        <div key={document._id}>
          <Item
            id={document._id}
            onClick={() => onRedirect(document._id)}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document._id}
            level={level}
            onExpand={() => onExpand(document._id)}
            isExpanded={expanded[document._id]}
          />
          {expanded[document._id] && (
            <DocumentList parentDocumentId={document._id} level={level + 1} />
          )}
        </div>
      ))}
      </div>
    </>
  );
};