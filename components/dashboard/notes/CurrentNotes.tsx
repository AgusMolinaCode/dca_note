"use client";

import React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

import NoteAddModal from "./NoteAddModal";
import NoteGet from "./NoteGet";

const CurrentNotes = () => {
  return (
    <div className="bg-card text-card-foreground shadow-sm flex flex-col w-full">
      
      <ScrollArea className="max-h-[24rem]">
        <NoteGet />
      </ScrollArea>
    </div>
  );
};

export default CurrentNotes;
