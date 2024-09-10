import React from "react";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotes, LOAD_NOTES } from "@/app/api";
import { useUser } from "@clerk/clerk-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import NoteAddModal from "./NoteAddModal";

const NoteGet = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
  });

  const { user } = useUser();

  const dataUserId = data?.filter((item: Notes) => item.userId === user?.id);

  const deleteNote = async (notes: Notes) => {
    try {
      const response = await fetch(`${LOAD_NOTES}/${notes.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const truncateText = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <div>
      <div className="flex justify-between items-center pb-2">
        <h1 className="text-lg font-semibold text-gray-500">Notes</h1>
        {dataUserId && dataUserId.length > 0 && (
          <p className="text-xs text-gray-500">
            {/* {dataUserId.length} notes found */}
            <NoteAddModal />
          </p>
        )}
      </div>

      {dataUserId?.map((note) => (
        <Dialog key={note.id}>
          <DialogTrigger className="w-full">
            <div className="bg-white hover:bg-gray-100 dark:bg-gray-700/90 hover:dark:bg-gray-600/90 border border-gray-200 dark:border-none duration-200 px-2 py-1 rounded-xl mb-2">
              <div className="flex justify-between gap-2 items-center border-b border-gray-400">
                <p className="text-sm text-left text-gray-500 dark:text-white font-semibold">
                  {truncateText(note.title, 20)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 text-left text-pretty">
                  {truncateText(note.description, 100)}
                </p>
              </div>
              <Separator className="my-[0.05rem]" />
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-white">{note.title}</DialogTitle>
              <p className="text-xs text-gray-500">
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </DialogHeader>
            <div className="">
              <p className="text-white">{note.description}</p>
            </div>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white"
              onClick={() => mutation.mutate(note)}
            >
              Remove Note
            </Button>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

export default NoteGet;
