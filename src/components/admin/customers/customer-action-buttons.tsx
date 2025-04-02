"use client";

import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { CustomerWithClassifieds } from "@/config/types";
import { Loader2, PencilIcon, Trash } from "lucide-react";
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
import { deleteCustomerAction } from "@/actions/customer";

export const CustomersActionButtons = ({
  customer,
}: {
  customer: CustomerWithClassifieds;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleDeleteCustomer = (id: number) => {
    startTransition(async () => {
      const { success, message } = await deleteCustomerAction(id);
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
        data-tooltip-id="edit-tooltip"
        data-tooltip-content="Edit"
      >
        <Link href={routes.admin.editCustomer(customer.id)}>
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

        <DialogContent className="bg-primary-800">
          <DialogHeader>
            <DialogTitle className="text-gray-300">
              Are you absolutely sure?
            </DialogTitle>
            <DialogDescription className="pt-2 text-gray-400">
              This action cannot be undone. Are you sure you want to permanently
              delete this customer from our servers?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => handleDeleteCustomer(customer.id)}
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
