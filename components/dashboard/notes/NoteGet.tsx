import React from "react";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getNotes } from "@/app/api";
import { useUser } from "@clerk/clerk-react";

const NoteGet = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
  });

  const { user } = useUser();

  const dataUserId = data?.filter((item: Notes) => item.userId === user?.id);

  const truncateText = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <div>
      {dataUserId?.map((note) => (
        <div key={note.id} className="bg-gray-700/90 px-2 py-1 rounded-xl mb-2">
          <div className="flex justify-between items-center border-b border-gray-400">
            <p className="text-md text-white">{note.title}</p>
            <p className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {truncateText(note.description, 100)}
            </p>
          </div>
          <Separator className="my-[0.05rem]" />
        </div>
      ))}
    </div>
  );

  
};

export default NoteGet;