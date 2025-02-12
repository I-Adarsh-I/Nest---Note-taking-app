import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import {
  Ellipsis,
  EllipsisVertical,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";
import { useParams } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import Options from "../NoteOptions/Options";
import { Skeleton } from "@/components/ui/skeleton";
import Title from "../NoteTitle/Title";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams();

  const document = useQuery(api.documents.getDocumentById, {
    documentId: params.documentId as Id<"documents">,
  });

  if (document === undefined) {
    return (
      <nav className="bg-background dark:bg-dark px-3 py-2 w-full flex justify-between items-center">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Options.Skeleton />
        </div>
      </nav>
    );
  }

  if (document === null) {
    return null;
  }
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-background dark:bg-dark">
      <div className="flex items-center gap-x-3">
        {isCollapsed && (
          <PanelLeft
            role="button"
            className="h-5 w-5 text-muted-foreground"
            onClick={() => onResetWidth()}
          />
        )}
        <Title initialData={document} />
      </div>
      <div className="flex items-center gap-2">
        <Button variant={"ghost"}>Publish</Button>
        <div role="button" className="">
          <Options documentId={document._id} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
