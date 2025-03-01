"use client";

import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "../../../../../convex/_generated/api";
import { ConvexError } from "convex/values";
import { useGreet } from "@/hooks/use-greet";

const DocumentPage = () => {
  const { user } = useUser();
  
  const greet = useGreet();

  const create = useMutation(api.documents.create);

  const createNewNote = () => {
    try {
      const newNote = create({ title: "Untitled Note" });
      toast.promise(newNote, {
        loading: "Creating new note...",
        success: "New note created",
        error: "Failed to created new note",
      });
    } catch (err) {
      console.log(err);
      return toast.error(
        err instanceof ConvexError
          ? (err.data as { message: string }).message
          : "Unexpected error occured please try again later"
      );
    }
  };
  return (
    <>
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium md:font-normal">
          {greet}, {user?.firstName}
        </h2>
        <Button onClick={() => createNewNote()}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create a note
        </Button>
      </div>
    </>
  );
};

export default DocumentPage;
