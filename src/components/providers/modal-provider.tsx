"use client";

import { CoverImageModal } from "../Modals/CoverImageModal";
import { useEffect, useState } from "react";
// import { AskAiModal } from "../Modals/AskAiModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CoverImageModal />
      {/* <AskAiModal /> */}
    </>
  );
};