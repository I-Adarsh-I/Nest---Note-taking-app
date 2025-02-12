import { Skeleton } from "@/components/ui/skeleton";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

interface TitleProps {
  initialData: Doc<"documents">;
}

const Title = ({ initialData }: TitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData.title || "Untitled Note");

  const update = useMutation(api.documents.update);

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
    update({
      id: initialData._id,
      title: event.target.value || "Untitled Note",
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      disableInput();
    }
  };

  return (
    <>
      <div className="flex items-center gap-x-1">
        {!!initialData && <p>{initialData.icon}</p>}
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
          <>
            <Button
              onClick={() => enableInput()}
              variant={"ghost"}
              size={"lg"}
              className="font-normal h-auto p-1"
            >
              <span className="truncate">{initialData.title}</span>
            </Button>
          </>
        )}
      </div>
    </>
  );
};

Title.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-5 w-40 rounded-md" />;
};

export default Title;
