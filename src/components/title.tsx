import { Skeleton } from "@/components/ui/skeleton";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "../../convex/_generated/dataModel";
import { LucideIcon } from "lucide-react";

interface TitleProps {
  initialData: { _id: string; title: string; Icon?: LucideIcon };
  type: "document" | "sessions"; // To differentiate between Documents and Chat
}

const Title = ({ initialData, type }: TitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData.title || "Untitled");

  const updateDocument = useMutation(api.documents.update);
  const updateSession = useMutation(api.messages.update);

  const inputRef = useRef<HTMLInputElement>(null);

  const enableInput = () => {
    setTitle(initialData.title);
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
    setTitle(event.target.value);
    if(type === "document"){
      updateDocument({
        id: initialData._id as Id<"documents">,
        title: event.target.value || "Untitled Note",
      });
    }else{
      updateSession({
        id: initialData._id as Id<"sessions">,
        sessionName: event.target.value || "Untitled Note",
      });
    }
  };


  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "Escape") {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.Icon && <initialData.Icon />}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChangeHandler}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="lg"
          className="font-normal h-auto p-1"
        >
          <span className="truncate text-base max-w-40 md:max-w-80">
            {title}
          </span>
        </Button>
      )}
    </div>
  );
};

// Skeleton Loader for Title
Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-5 w-40 rounded-md" />;
};

export default Title;
