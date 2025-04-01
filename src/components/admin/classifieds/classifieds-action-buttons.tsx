"use client";

import { deleteClassifiedAction } from "@/actions/classified";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { ClassifiedWithImage } from "@/config/types";
import { EyeIcon, Loader2, PencilIcon, Trash } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { Tooltip } from "react-tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const ClassifiedsActionButtons = ({
  classified,
}: {
  classified: ClassifiedWithImage;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleDeleteClassified = (id: number) => {
    startTransition(async () => {
      const { success, message } = await deleteClassifiedAction(id);
      if (!success) {
        toast.error("Error!", {
          description: message,
          duration: 3000,
          position: "top-right",
          closeButton: true,
        });
        return;
      }
      toast.success("Success!", {
        description: message,
        duration: 3000,
        position: "top-right",
        closeButton: true,
      });
    });
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button
        asChild
        className="h-fit p-2"
        data-tooltip-id="view-tooltip"
        data-tooltip-content="View"
      >
        <Link href={routes.singleClassified(classified.slug)}>
          <Tooltip id="view-tooltip" />
          <EyeIcon className="!h-4 !w-4 outline-none" />
        </Link>
      </Button>
      <Button
        asChild
        className="h-fit p-2"
        data-tooltip-id="edit-tooltip"
        data-tooltip-content="Edit"
      >
        <Link href={routes.admin.editClassifieds(classified.id)}>
          <Tooltip id="edit-tooltip" />
          <PencilIcon className="!h-4 !w-4 outline-none" />
        </Link>
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            className="h-fit p-2"
            data-tooltip-id="trash-tooltip"
            data-tooltip-content="Delete"
          >
            <Tooltip id="trash-tooltip" />
            {isPending ? (
              <Loader2 className="!h-4 !w-4 animate-spin" />
            ) : (
              <Trash className="!h-4 !w-4 outline-none" />
            )}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to permanently
              delete this classified from our servers?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => handleDeleteClassified(classified.id)}
              type="submit"
              className="flex items-center gap-x-2"
              variant="destructive"
            >
              {isPending && <Loader2 className="!h-4 !w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
