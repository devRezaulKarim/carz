"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import { readStreamableValue, useActions, useUIState } from "ai/rsc";
import { AI } from "@/actions/ai";
import { SubmitHandler, useForm } from "react-hook-form";
import { SingleImageSchema, SingleImageType } from "@/schemas/images.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { StreamableSkeletonProps } from "./streamable-skeleton";
import { classifiedAISchema } from "@/schemas/classified-ai-schema";
import { z } from "zod";
import { createClassifiedAction } from "@/actions/classified";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { SingleImageUploader } from "./single-image-uploader";

export const CreateClassifiedDialog = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, startUploadTransition] = useTransition();
  const [isCreating, startCreateTransition] = useTransition();

  const { generateClassified } = useActions<typeof AI>();
  const [messages, setMessages] = useUIState<typeof AI>();

  const imageForm = useForm<SingleImageType>({
    resolver: zodResolver(SingleImageSchema),
  });

  const createForm = useForm({
    resolver: zodResolver(
      classifiedAISchema.extend({
        make: z.object({
          id: z.number().int(),
          name: z.string(),
          image: z.string(),
          createdAt: z.date(),
          updatedAt: z.date(),
        }),
      }),
    ),
  });

  const handleImageUpload = (url: string) => {
    imageForm.setValue("image", url);
  };

  const onImageSubmit: SubmitHandler<SingleImageType> = (data) => {
    startUploadTransition(async () => {
      const responseMessage = await generateClassified(data.image);
      if (!responseMessage) return;

      setMessages((currentMessages) => [...currentMessages, responseMessage]);
      for await (const value of readStreamableValue(
        responseMessage.classified,
      )) {
        if (value) {
          createForm.reset(value);
        }
      }
    });
  };

  const onCreateSubmit: SubmitHandler<StreamableSkeletonProps> = (data) => {
    startCreateTransition(async () => {
      setMessages([]);
      const { success, message } = await createClassifiedAction(data);
      if (!success) {
        toast.error("Error!", {
          description: message,
          duration: 3000,
          position: "top-right",
          closeButton: true,
        });
        return;
      }
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="ml-4">
          Create new
        </Button>
      </DialogTrigger>
      <DialogContent className={cn("max-w-5xl")}>
        <DialogHeader>
          <DialogTitle>Create New Classified</DialogTitle>
        </DialogHeader>
        {messages.length ? (
          <Form {...createForm}>
            <form
              className="space-y-4"
              onSubmit={createForm.handleSubmit(onCreateSubmit)}
            >
              {messages.map((message) => (
                <div className="w-full" key={message.id}>
                  {message.display}
                </div>
              ))}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isCreating || isUploading}
                  type="submit"
                  className="flex items-center gap-x-2"
                >
                  {isCreating || isUploading ? (
                    <Loader2 className="!h-4 !w-4 animate-spin" />
                  ) : null}
                  {isUploading ? "Uploading..." : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <Form {...imageForm}>
            <form
              className="space-y-4"
              onSubmit={imageForm.handleSubmit(onImageSubmit)}
            >
              <SingleImageUploader onUploadComplete={handleImageUpload} />

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isUploading}
                  type="submit"
                  className="flex items-center gap-x-2"
                >
                  {isUploading && (
                    <Loader2 className="!h-4 !w-4 animate-spin" />
                  )}
                  Upload
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
