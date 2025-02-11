"use client";

import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { Search, Trash, Undo, Undo2, Undo2Icon, UndoDot } from "lucide-react";
import { useState } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Spinner } from "@/components/loader";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import ConfirmationalModel from "../../../../components/Modals/ConfirmationModal";

const TrashCan = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const deleteNote = useMutation(api.documents.deleteNote);
  const restoreNote = useMutation(api.documents.restoreNotes);

  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const restoreNotes = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    event.stopPropagation();
    const restoredNotes = restoreNote({ id: documentId });
    toast.promise(restoredNotes, {
      loading: "Restoring note...",
      success: "Note restored",
      error: "Failed to restore note",
    });
  };

  const deleteNotes = (documentId: Id<"documents">) => {
    const deleteNotes = deleteNote({ id: documentId });
    toast.promise(deleteNotes, {
      loading: "Deleting note...",
      success: "Note deleted",
      error: "Failed to delete note",
    });

    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  if (documents === undefined) {
    return (
      <div className="h-full flex items-cente justify-center p-4">
        <Spinner size={"lg"} />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2 ">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => e.target.value}
          className="h-7 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-muted-foreground text-center pb-1">
          No documents found
        </p>
        {filteredDocuments?.map((document) => {
          return (
            <div
              key={document._id}
              role="button"
              onClick={() => onClick(document._id)}
              className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-center"
            >
              <span className="text-start w-full truncate pl-2">
                {document.title}
              </span>
              <div className="flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        role="button"
                        onClick={(e) => restoreNotes(e, document._id)}
                        className="rounded-sm p-2 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                      >
                        <Undo className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Undo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ConfirmationalModel
                        onConfirm={() => deleteNotes(document._id)}
                      >
                        <div
                          role="button"
                          // onClick={() => deleteNotes(document._id)}
                          className="rounded-sm p-2 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                        >
                          <Trash className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </ConfirmationalModel>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrashCan;
