import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";

import {
  ChevronDown,
  ChevronRight,
  FilePenLine,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";

interface ItemProps {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  isExpanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: () => void;
  aiButton?: boolean;
  icon: LucideIcon;
  altIcon?: string;
}

// ⌘

const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  documentIcon,
  active,
  isExpanded,
  level = 0,
  isSearch,
  onExpand,
  aiButton,
  altIcon,
}: ItemProps) => {
  const router = useRouter();
  const { user } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(label || "Untitled Note");
  const inputRef = useRef<HTMLInputElement>(null);

  const createNewNote = useMutation(api.documents.create);
  const archiveNote = useMutation(api.documents.archive);
  const restoreNote = useMutation(api.documents.restoreNotes);
  const rename = useMutation(api.documents.update);

  const onArhive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();

    if (!id) return;
    archiveNote({ id });

    toast("Note moved to trash", {
      action: {
        label: "Undo",
        onClick: () => restoreNotes(event, id),
      },
    });
  };

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const onCreateNewNote = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!id) return;
    const newNoteCreated = createNewNote({
      title: "Untitled Note",
      parentDocument: id,
    }).then((documentId) => {
      if (!isExpanded) {
        onExpand?.();
      }
      router.push(`/documents/${documentId}`);
    });
    toast.promise(newNoteCreated, {
      loading: "Creating a new note",
      success: "New note created",
      error: "Failed to create a new note",
    });
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

  const enableInput = () => {
    setNewTitle(label);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
    rename({
      id: id as Id<"documents">,
      title: event.target.value || "Untitled Note",
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "Escape") {
      disableInput();
    }
  };

  const CheveronIcon = isExpanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={onClick}
      role="button"
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : "12px",
      }}
      className={cn(
        `group min-h-[27px] text-sm py-1 pr-3 hover:bg-primary/5 flex items-center text-muted-foreground font-medium`,
        active && "bg-primary/5 text-primary",
        aiButton &&
          "bg-gradient-to-r from-indigo-500/70 via-purple-500/70 to-pink-500/70 p-2 my-2 rounded-sm text-slate-200 mx-2"
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          onClick={handleExpand}
        >
          <CheveronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}

      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : altIcon ? (
        <span className="pr-2 ml-[-6px]">{altIcon}</span>
      ) : (
        <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}
      {isEditing ? (
        <>
          <Input
            ref={inputRef}
            onClick={enableInput}
            onBlur={disableInput}
            onChange={onChangeHandler}
            onKeyDown={onKeyDown}
            value={newTitle}
            className="h-7 px-2 focus-visible:ring-transparent"
          />
        </>
      ) : (
        <>
          <span className="truncate">{label}</span>
        </>
      )}
      {/* <span className="truncate">{label}</span> */}
      {isSearch && (
        <>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[14px] font-medium text-muted-foreground opacity-100 text-center">
            <span className="text-[11px] mt-[1px]">⌘</span>K
          </kbd>
        </>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 ml-auto h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onArhive}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={enableInput}>
                <FilePenLine className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="button"
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
            onClick={(event) => onCreateNewNote(event)}
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

Item.skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};

export default Item;
