import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { Ellipsis, Trash } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../../../../convex/_generated/dataModel";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface OptionsProps {
  documentId?: Id<"documents">;
  sessionId?: Id<"sessions">;
}

const Options = ({ documentId, sessionId }: OptionsProps) => {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  //Note functionalities
  const archiveNote = useMutation(api.documents.archive);
  const restoreNote = useMutation(api.documents.restoreNotes);

  //Chat functionalities
  const deleteSession = useMutation(api.messages.deleteSession);

  const deleteChat = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();

    if (!sessionId) return;
    deleteSession({ id: sessionId });

    router.push("/chat");
    toast.success("Chat deleted successfully");
  };

  const onArhive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();

    if (!documentId) return;
    archiveNote({ id: documentId });

    toast("Note moved to trash", {
      action: {
        label: "Undo",
        onClick: () => restoreNotes(event, documentId),
      },
    });

    router.push("/documents");
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

    router.push(`/documents/${documentId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
        className="cursor-pointer"
          onClick={
            !pathname.startsWith("/chat/")
              ? (e) => onArhive(e)
              : (e) => deleteChat(e)
          }
        >
          <Trash className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
        {!pathname.startsWith("/chat/") && (
          <>
            <DropdownMenuSeparator />
            <div className="text-xs text-muted-foreground p-2">
              Last edited by: {user?.fullName}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Options.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-6 w-20" />;
};

export default Options;
