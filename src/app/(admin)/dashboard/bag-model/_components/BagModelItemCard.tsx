import Image from "next/image";
import { Pencil } from "lucide-react";

import { BagModelItem } from "../types";

type BagModelItemCardProps = {
  item: BagModelItem;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export default function BagModelItemCard({
  item,
  onDelete,
  onEdit,
}: BagModelItemCardProps) {
  return (
    <div className="rounded-lg border border-border bg-[#2d2f34]/80 p-3">
      <div className="relative mb-3 h-[130px] overflow-hidden rounded-md border border-border bg-muted/20">
        <Image
          src={item.image}
          alt={item.modelName}
          fill
          className="object-contain p-2 py-6"
        />
      </div>

      <p className="mb-3 text-base text-card-foreground">{item.modelName}</p>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onDelete(item.id)}
          className="h-10 rounded-md border border-border bg-background/40 text-sm font-medium text-destructive hover:bg-background/60"
        >
          Delete
        </button>
        <button
          onClick={() => onEdit(item.id)}
          className="inline-flex h-10 items-center justify-center gap-1 rounded-md border border-border bg-background/40 text-sm font-medium text-green-500 hover:bg-background/60"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
      </div>
    </div>
  );
}
