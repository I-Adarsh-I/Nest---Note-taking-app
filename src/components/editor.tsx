"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "convex/react";

import { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useYDoc, useYjsProvider } from "@y-sweet/react";

import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { Skeleton } from "./ui/skeleton";
import { useEdgeStore } from "@/lib/edgestore";
import { useUser } from "@clerk/clerk-react";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
  docId: Id<"documents">;
}

export default function Editor({
  onChange,
  initialContent,
  editable,
  docId,
}: EditorProps) {
  const [isSynced, setIsSynced] = useState(false);
  const { edgestore } = useEdgeStore();
  const { resolvedTheme } = useTheme();
  const { user } = useUser();

  // Fetch document from database
  const document = useQuery(api.documents.getDocumentById, {
    documentId: docId,
  });

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ file });
    return response.url;
  };

  const provider = useYjsProvider();
  const doc = useYDoc();

  // Attach sync event listener before rendering
  useEffect(() => {
    const handleSync = () => {
      console.log("Event synced");
      setIsSynced(true);
    };
    provider.on("synced", handleSync);
  
    return () => {
      provider.off("synced", handleSync);
    };
  }, [provider]);

  const initialBlocks = initialContent ? JSON.parse(initialContent) : [];

  const [blocks, setBlocks] = useState<PartialBlock[]>(initialBlocks);

  const fragment = useMemo(
    () => (doc ? doc.getXmlFragment("blocknote") : undefined),
    [doc]
  );

  const editor = useCreateBlockNote({
    initialContent: blocks,
    collaboration: fragment
      ? {
          provider,
          fragment,
          user: { name: user?.fullName as string, color: "#f57542" },
        }
      : undefined,
    uploadFile: handleUpload,
  });


  // If document is still loading, show spinner
  if (document === undefined) {
    return <Skeleton className="h-4 w-48" />;
  }

  // console.log(isSynced)

  // Render the editor only when syncing is complete
  return isSynced ? (
    <BlockNoteView
      editable={editable}
      editor={editor}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onChange={() => {
        setBlocks(editor.document);
        onChange(JSON.stringify(blocks));
      }}
    />
  ) : (
    <div>
    <Skeleton className="h-4 w-48 mb-3" />
    <Skeleton className="h-4 w-72 mb-3" />
    <Skeleton className="h-4 w-32 mb-3" />
    <Skeleton className="h-4 w-28 mb-3" />
    </div>
  );
}

