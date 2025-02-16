import { useQuery } from "convex/react";
import { PanelLeft, TriangleAlert } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import Options from "../NoteOptions/Options";
import Title from "../NoteTitle/Title";
import Banner from "../TopBanner/Banner";
import { Publish } from "../Publish/Publish";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams();
  const router = useRouter();

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
    router.push("/documents")
    return null;
  }
  return (
    <>
      <nav className="flex items-center justify-between py-2 px-3 bg-background dark:bg-dark">
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
          {/* <Button variant={"ghost"}>Publish</Button> */}
          <Publish initialData={document}/>
          <div role="button" className="mt-1">
            <Options documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && (
        <>
          <Banner
            documentId={document._id}
            icon={TriangleAlert}
            variant={"error"}
          />
        </>
      )}
    </>
  );
};

export default Navbar;
