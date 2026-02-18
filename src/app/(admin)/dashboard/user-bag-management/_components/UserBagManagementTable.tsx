import Image from "next/image";
import { Eye, Trash2, TrendingDown, TrendingUp } from "lucide-react";

import { UserBagItem } from "../types";
import { formatCurrency } from "../utils";

type UserBagManagementTableProps = {
  bags: UserBagItem[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function UserBagManagementTable({
  bags,
  onView,
  onDelete,
}: UserBagManagementTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-border">
          <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
            Bag
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
            Owner
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
            Brand
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
            Model
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
            Purchase Year
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
            Cost
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
        {bags.map((bag, index) => {
          const delta = bag.currentValue - bag.cost;
          const isUp = delta >= 0;
          const pct = (Math.abs(delta) / bag.cost) * 100;

          return (
            <tr
              key={bag.id}
              className={`${
                index !== bags.length - 1 ? "border-b border-border" : ""
              } transition-colors hover:bg-muted/50`}
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={bag.bagImage}
                      alt={bag.bagName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-card-foreground">
                    {bag.bagName}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9 overflow-hidden rounded-full bg-muted">
                    <Image
                      src={bag.ownerImage}
                      alt={bag.ownerName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm text-card-foreground">
                    {bag.ownerName}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4 text-sm text-muted-foreground">
                {bag.brand}
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {bag.model}
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {bag.purchaseYear}
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {formatCurrency(bag.cost)}
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-card-foreground">
                    {formatCurrency(bag.currentValue)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      isUp ? "text-green-500" : "text-destructive"
                    }`}
                  >
                    {isUp ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" />
                    )}
                    {isUp ? "+" : "-"}
                    {pct.toFixed(1)}%
                  </span>
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onView(bag.id)}
                    className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
                    aria-label="View bag"
                  >
                    <Eye className="h-5 w-5" />
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
          );
        })}
      </tbody>
    </table>
  );
}
