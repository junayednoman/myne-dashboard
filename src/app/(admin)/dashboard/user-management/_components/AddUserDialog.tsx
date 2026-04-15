"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { z } from "zod";

import AdminActionButton from "@/components/admin/admin-action-button";
import AForm from "@/components/form/AForm";
import { AInput } from "@/components/form/AInput";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const addUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
});

export type AddUserFormValues = z.infer<typeof addUserSchema>;

type AddUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AddUserFormValues) => void;
};

export default function AddUserDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddUserDialogProps) {
  const [formKey, setFormKey] = useState(0);

  const reset = () => {
    setFormKey((prev) => prev + 1);
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset();
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-xl rounded-lg border border-border bg-card/95 p-4 backdrop-blur-md"
      >
        <div className="flex items-center gap-3 border-b border-border pb-3">
          <button
            onClick={() => handleClose(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-card-foreground"
            aria-label="Close add user modal"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <DialogTitle className="text-xl font-semibold text-card-foreground">
            Add New User
          </DialogTitle>
        </div>

        <AForm<AddUserFormValues>
          key={formKey}
          schema={addUserSchema}
          defaultValues={{ name: "", email: "" }}
          onSubmit={onSubmit}
          className="space-y-4 pt-2"
        >
          <AInput
            name="name"
            label="Full name"
            required
            placeholder="Enter user name"
          />

          <AInput
            name="email"
            label="Email"
            type="email"
            required
            placeholder="Enter user email"
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleClose(false)}
              className="h-11 rounded-md border border-border bg-background/40 text-sm font-medium text-card-foreground hover:bg-background/60"
            >
              Cancel
            </button>
            <AdminActionButton
              type="submit"
              className="h-11 w-full justify-center rounded-md text-sm font-semibold sm:w-full"
            >
              Add User
            </AdminActionButton>
          </div>
        </AForm>
      </DialogContent>
    </Dialog>
  );
}
