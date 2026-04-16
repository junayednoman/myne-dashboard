"use client";

import Image from "next/image";
import { X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholder-image";
import { AdminBagItem } from "../types";

type AdminBagDetailsModalProps = {
  open: boolean;
  bag: AdminBagItem | null;
  onOpenChange: (open: boolean) => void;
};

export default function AdminBagDetailsModal({
  open,
  bag,
  onOpenChange,
}: AdminBagDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card/95 p-0 backdrop-blur-md"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <DialogTitle className="text-xl font-bold text-card-foreground">
            Bag Details
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-card-foreground"
            aria-label="Close bag details modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {bag ? (
          <div className="px-5 py-4 space-y-4">
            <div className="flex justify-center">
              <div className="relative h-44 w-44 overflow-hidden rounded-lg border border-border bg-muted">
                <Image
                  src={bag.bagImage || PLACEHOLDER_IMAGE}
                  alt={bag.model}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-0 text-sm">
              <div className="flex items-center justify-between border-b border-border py-3">
                <span className="text-muted-foreground">Brand:</span>
                <span className="text-card-foreground">{bag.brand}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border py-3">
                <span className="text-muted-foreground">Model:</span>
                <span className="text-card-foreground">{bag.model}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border py-3">
                <span className="text-muted-foreground">Bag Color:</span>
                <span className="text-card-foreground">{bag.bagColor || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border py-3">
                <span className="text-muted-foreground">Leather Type:</span>
                <span className="text-card-foreground">
                  {bag.leatherType || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border py-3">
                <span className="text-muted-foreground">Hardware Color:</span>
                <span className="text-card-foreground">
                  {bag.hardwareColor || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border py-3">
                <span className="text-muted-foreground">Size:</span>
                <span className="text-card-foreground">{bag.size || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border py-3">
                <span className="text-muted-foreground">Condition:</span>
                <span className="text-card-foreground">
                  {bag.condition || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border py-3">
                <span className="text-muted-foreground">Production Year:</span>
                <span className="text-card-foreground">{bag.productionYear}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Current Value:</span>
                <span className="text-card-foreground">{bag.currentValue}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            No bag details available.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
