"use client";

import Image from "next/image";
import { X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export type UserReviewData = {
  userName: string;
  email: string;
  avatar: string;
  businessName: string;
  contact: string;
  location: string;
};

type UserReviewModalProps = {
  open: boolean;
  user: UserReviewData | null;
  onOpenChange: (open: boolean) => void;
  onBlock: () => void;
};

export default function UserReviewModal({
  open,
  user,
  onOpenChange,
  onBlock,
}: UserReviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card/95 p-0 backdrop-blur-md"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <DialogTitle className="text-xl font-bold text-card-foreground">
            User Details
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-card-foreground"
            aria-label="Close review modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {user && (
          <div className="px-5 py-4">
            <div className="flex justify-center pb-4">
              <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-[#d7fbef]">
                <Image
                  src={user.avatar}
                  alt={user.userName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-0">
              <div className="flex items-center justify-between border-b border-border py-3">
                <p className="font-semibold text-card-foreground">Name :</p>
                <p className="text-muted-foreground">{user.businessName}</p>
              </div>
              <div className="flex items-center justify-between border-b border-border py-3">
                <p className="font-semibold text-card-foreground">Email :</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex items-center justify-between border-b border-border py-3">
                <p className="font-semibold text-card-foreground">Contact :</p>
                <p className="text-muted-foreground">{user.contact}</p>
              </div>
              <div className="flex items-center justify-between border-b border-border py-3">
                <p className="font-semibold text-card-foreground">Location :</p>
                <p className="text-muted-foreground">{user.location}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => onOpenChange(false)}
                className="h-11 flex-1 rounded-full border border-border bg-transparent font-semibold text-card-foreground hover:bg-muted/40"
              >
                Close
              </button>
              <button
                onClick={onBlock}
                className="h-11 flex-1 rounded-full bg-destructive font-semibold text-destructive-foreground hover:bg-destructive/90"
              >
                Block
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
