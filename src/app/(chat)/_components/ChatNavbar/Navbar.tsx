import { useQuery } from "convex/react";
import { Ellipsis, MessageSquareText, PanelLeft, SquarePen } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import Options from "@/app/(main)/_components/NoteOptions/Options";
import { Button } from "@/components/ui/button";
import Title from "@/components/title";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams();
  const router = useRouter();

  const session = useQuery(api.messages.getSessionById, {
    sessionId: params.sessionId as Id<"sessions">
  });

  if (session === undefined) {
    return (
      <nav className="bg-background dark:bg-dark px-3 py-2 w-full flex justify-between items-center">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Options.Skeleton />
        </div>
      </nav>
    );
  }

  if (session === null) {
    router.push("/chat")
    return null;
  }
  const sessionInitialData = {
    _id: session!._id,
    title: session!.sessionName,
    icon: MessageSquareText
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
          <Title initialData={sessionInitialData} type="sessions"/>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={"ghost"}><SquarePen className="w-5 h-5"/></Button>
          <div role="button" className="mt-1">
            <Ellipsis className="w-5 h-5"/>
            {/* <Options documentId={document._id} /> */}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
