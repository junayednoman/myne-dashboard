import Image from "next/image";
import { Pencil } from "lucide-react";

import { BlogItem } from "../types";

type BlogItemCardProps = {
  item: BlogItem;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export default function BlogItemCard({ item, onDelete, onEdit }: BlogItemCardProps) {
  return (
    <div className="rounded-lg border border-border bg-[#2d2f34]/80 p-3">
      <div className="relative mb-3 h-[200px] overflow-hidden rounded-md border border-border bg-muted/20">
        <Image src={item.image} alt={item.title} fill className="object-contain p-2" />
      </div>

      <p className="mb-2 truncate text-base font-semibold text-card-foreground">{item.title}</p>
      <p className="mb-3 min-h-10 text-sm text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
        {item.description}
      </p>

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

