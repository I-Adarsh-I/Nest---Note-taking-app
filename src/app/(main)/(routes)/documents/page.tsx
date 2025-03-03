"use client";

import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { Clock, FileIcon, PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import DocumentItem from "../../_components/Item/documentItem";

import { ConvexError } from "convex/values";
import { useIsMobile } from "@/hooks/use-mobile";

import { useGreet } from "@/hooks/use-greet";
import { api } from "../../../../../convex/_generated/api";

const DocumentPage = () => {
  const { user } = useUser();
  const greet = useGreet();
  const router = useRouter();
  const isSmallScreen = useIsMobile();

  const create = useMutation(api.documents.create);
  const recentlyVisitedDocuments = useQuery(api.documents.recentlyVisited, {
    limit: 10,
  });

  const createNewNote = () => {
    try {
      const newNote = create({ title: "Untitled Note" });
      toast.promise(newNote, {
        loading: "Creating new note...",
        success: "New note created",
        error: "Failed to create new note",
      });
    } catch (err) {
      console.log(err);
      return toast.error(
        err instanceof ConvexError
          ? (err.data as { message: string }).message
          : "Unexpected error occurred, please try again later"
      );
    }
  };

  const onRedirect = (documentId: string) => {
    router.prefetch(`/documents/${documentId}`);
    router.push(`/documents/${documentId}`);
  };

  return (
    <div className="h-full flex max-w-full flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium md:font-normal">
        {greet}, {user?.firstName}
      </h2>
      {recentlyVisitedDocuments &&
      recentlyVisitedDocuments.length > 0 &&
      isSmallScreen ? (
        <>
         <p className={`mb-2 text-muted-foreground text-xs w-full flex items-center justify-center gap-1`}>
              <Clock className="w-3.5 h-3.5" /> Recently Visited
            </p>
          <div
            className="flex items-center max-w-xs gap-x-4 overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            
            {!recentlyVisitedDocuments ? (
              <div className="flex items-center justify-center gap-4 ml-4">
                <DocumentItem.skeleton />
                <DocumentItem.skeleton />
                <DocumentItem.skeleton />
              </div>
            ) : (
              recentlyVisitedDocuments.map(
                (document) =>
                  !document.isArchived && (
                    <div key={document._id}>
                      <DocumentItem
                        label={document.title}
                        coverimgUrl={document.coverImage}
                        documentIcon={document.icon}
                        altIcon={FileIcon}
                        onClick={() => onRedirect(document._id)}
                      />
                    </div>
                  )
              )
            )}
          </div>
        </>
      ) : (
        <>
          <div>
            <p className="mb-2 text-muted-foreground text-xs w-full flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Recently Visited
            </p>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full max-w-2xl"
            >
              <CarouselContent>
                {!recentlyVisitedDocuments ||
                recentlyVisitedDocuments.length === 0 ? (
                  <div className="flex items-center justify-center gap-4 ml-4">
                    <DocumentItem.skeleton />
                    <DocumentItem.skeleton />
                    <DocumentItem.skeleton />
                  </div>
                ) : (
                  recentlyVisitedDocuments?.map((document) => (
                    <CarouselItem
                      key={document._id}
                      className="basis-1/4 md:basis-1/4 lg:basis-40 py-2 ml-5"
                    >
                      <div className="">
                        <DocumentItem
                          label={document.title}
                          coverimgUrl={document.coverImage}
                          documentIcon={document.icon}
                          altIcon={FileIcon}
                          onClick={() => onRedirect(document._id)}
                        />
                      </div>
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </>
      )}

      <Button onClick={() => createNewNote()}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentPage;
