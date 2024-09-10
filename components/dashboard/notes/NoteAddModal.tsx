import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { noteSchema } from "@/lib/validator";
import { useUser } from "@clerk/clerk-react";
import { LOAD_NOTES } from "@/app/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PlusCircle } from "lucide-react";

const NoteAddModal = () => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { user } = useUser();

  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      description: "",
      userId: user?.id || "",
    },
  });

  const addNotes = async (values: z.infer<typeof noteSchema>) => {
    const noteData = {
      userId: user?.id,
      title: values.title,
      description: values.description,
    };

    try {
      const response = await fetch(LOAD_NOTES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });
      if (response.ok) {
        console.log("Note added successfully");
      }
      setOpen(false);
    } catch (error) {
      console.error("Failed to add transaction", error);
    }
  };

  const mutation = useMutation({
    mutationFn: addNotes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <PlusCircle className="w-6 h-6 text-blue-400" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            New note
          </DialogTitle>
          <DialogDescription className="dark:text-white text-black">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) =>
                  mutation.mutate(values)
                )}
              >
                <FormField
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="pt-4 flex flex-col gap-2 relative">
                          <Label
                            htmlFor="title"
                            className="text-white text-[1rem]"
                          >
                            Title
                          </Label>
                          <Input
                            {...field}
                            id="title"
                            type="text"
                            className="col-span-3 placeholder:text-gray-500 rounded-xl border-gray-500 text-white font-bold placeholder:text-right"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-white" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-0 relative">
                      <FormControl>
                        <div className="pt-4 flex flex-col gap-2">
                          <Label
                            htmlFor="description"
                            className="text-white text-[1rem]"
                          >
                            Description
                          </Label>
                          <Textarea
                            {...field}
                            id="description"
                            className="col-span-3 placeholder:text-gray-500 rounded-xl border-gray-500 text-white font-bold placeholder:text-right"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="pt-4 flex flex-col gap-2">
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white"
                  >
                    Add Note
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NoteAddModal;
