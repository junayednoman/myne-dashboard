import Image from "next/image";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { AdminBagItem } from "../types";
import { formatCurrency } from "../utils";

type AdminBagManagementTableProps = {
  bags: AdminBagItem[];
  onDelete: (id: string) => void;
};

export default function AdminBagManagementTable({
  bags,
  onDelete,
}: AdminBagManagementTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-border">
          <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
            Bag Image
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
            Brand
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
            Model
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
            Production Year
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
            Current Value
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {bags.map((bag, index) => (
          <tr
            key={bag.id}
            className={`${
              index !== bags.length - 1 ? "border-b border-border" : ""
            } transition-colors hover:bg-muted/50`}
          >
            <td className="px-6 py-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                <Image
                  src={bag.bagImage}
                  alt={bag.model}
                  fill
                  className="object-cover"
                />
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-card-foreground">
              {bag.brand}
            </td>
            <td className="px-6 py-4 text-sm text-muted-foreground">
              {bag.model}
            </td>
            <td className="px-6 py-4 text-sm text-muted-foreground">
              {bag.productionYear}
            </td>
            <td className="px-6 py-4 text-sm font-medium text-card-foreground">
              {formatCurrency(bag.currentValue)}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
                  aria-label="View bag"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
                  aria-label="Edit bag"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(bag.id)}
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-destructive transition-colors hover:bg-muted"
                  aria-label="Delete bag"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
