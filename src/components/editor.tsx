"use client";

import { useTheme } from "next-themes";
import { useState } from "react";

import { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useLiveblocksExtension } from "@liveblocks/react-tiptap";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

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

  const initialBlocks = initialContent ? JSON.parse(initialContent) : undefined;
  
  const [blocks, setBlocks] = useState<PartialBlock[]>(initialBlocks);

  const editor = useCreateBlockNote({
    initialContent: blocks,
  });
  const { resolvedTheme } = useTheme();

  return (
    <BlockNoteView
      editable={editable}
      editor={editor}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onChange={() => {
        setBlocks(editor.document);
        onChange(JSON.stringify(blocks));
      }}
    />
  );
}
