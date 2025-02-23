import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";

import {
  FilePenLine,
  LucideIcon,
  MoreHorizontal,
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
  id?: Id<"sessions">;
  documentIcon?: string;
  active?: boolean;
  label: string;
  onClick?: () => void;
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
  altIcon,
}: ItemProps) => {
  const router = useRouter();
  const { user } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(label || "Untitled Note");
  const inputRef = useRef<HTMLInputElement>(null);

  const deleteSession = useMutation(api.messages.deleteSession);
  const rename = useMutation(api.messages.update);

  const onArhive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();

    if (!id) return;
    deleteSession({ id });

    toast.success("Note moved to trash");
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
      id: id as Id<"sessions">,
      sessionName: event.target.value || "Untitled Chat",
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "Escape") {
      disableInput();
    }
  };

  return (
    <div
      onClick={onClick}
      role="button"
      className={cn(
        `group min-h-[27px] text-sm p-3 hover:bg-primary/5 flex items-center text-muted-foreground font-normal rounded-sm mb-1`,
        active && "bg-primary/5 text-primary",
      )}
    >
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : altIcon ? (
        <span className="pr-2 ml-[-6px]">{altIcon}</span>
      ) : (
        <Icon className="shrink-0 h-4 w-4 mr-2 text-muted-foreground" />
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
        </div>
      )}
    </div>
  );
};

Item.skeleton = function ItemSkeleton() {
  return (
    <div
      style={{ paddingLeft: "12px" }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};

export default Item;
