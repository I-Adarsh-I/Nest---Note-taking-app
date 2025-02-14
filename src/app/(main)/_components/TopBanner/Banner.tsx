import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { useMutation, useQuery } from "convex/react";
import { LucideIcon } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import ConfirmationalModel from "@/components/Modals/ConfirmationModal";

interface BannerProps {
  variant?: "error" | "warning" | "info";
  icon?: LucideIcon;
  documentId: Id<"documents">;
}

const bannerVariants = cva(
  "p-3 rounded-md shadow-md w-full border-muted-foreground",
  {
    variants: {
      variant: {
        info: "bg-blue-100/40 border-1 border-blue-500 text-black",
        warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
        error: "bg-red-100/95 border-red-400 text-black",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const Banner = ({ variant = "info", icon: Icon, documentId }: BannerProps) => {
  const params = useParams();
  const router = useRouter();

  const deleteNote = useMutation(api.documents.deleteNote);
  const restoreNote = useMutation(api.documents.restoreNotes);

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

  const restoreNotes = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
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
    <>
      <div className={bannerVariants({ variant })}>
        <div className="flex gap-x-3">
          {Icon && <Icon className="shrink-0 h-5 w-5 text-amber-500 mt-0.5" />}
          <div className="">
            {/* Banner Content */}
            <p className="font-medium">
              This page is in the trash. You can restore it or delete it
              permanently.
            </p>

            {/* Buttons */}
            <div className="mt-2 flex gap-2">
              {restoreNotes && (
                <Button
                  variant={"outline"}
                  size={"sm"}
                  onClick={(e) => restoreNotes(e, documentId)}
                  className="text-gray-800 bg-white border-0 hover:bg-white hover:text-black"
                >
                  Restore
                </Button>
              )}
              {deleteNotes && (
                <ConfirmationalModel
                onConfirm={() => deleteNotes(documentId)}
              >
                <Button
                  variant={"link"}
                  size={"sm"}
                //   onClick={() => deleteNotes(documentId)}
                  className="text-gray-800 hover:text-black"
                >
                  Delete Forever
                </Button>
                </ConfirmationalModel>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
