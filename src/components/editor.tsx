"use client";

import { useTheme } from "next-themes";
import { useState } from "react";

import { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

export default function Editor({
  onChange,
  initialContent,
  editable,
}: EditorProps) {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  let initialBlocks;
  try {
    initialBlocks = initialContent ? JSON.parse(initialContent) : undefined;
  } catch (error) {
    console.error("Failed to parse initialContent:", error);
    initialBlocks = undefined;
  }

  const [blocks, setBlocks] = useState<PartialBlock[]>(initialBlocks);
  const editor = useCreateBlockNote({
    initialContent: blocks,
    uploadFile: async (file: File) => {
      const response = await edgestore.publicFiles.upload({ file });
      return response.url;
    },
  });

  return (
    <BlockNoteView
      editable={editable}
      editor={editor}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onChange={() => {
        setBlocks(() => {
          const updatedBlocks = editor.document;
          onChange(JSON.stringify(updatedBlocks));
          return updatedBlocks;
        });
      }}
    />
  );
}
