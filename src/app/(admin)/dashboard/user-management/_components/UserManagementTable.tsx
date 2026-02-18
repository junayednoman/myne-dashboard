import Image from "next/image";
import { Eye, Lock, Unlock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { UserTableItem } from "../types";

type UserManagementTableProps = {
  users: UserTableItem[];
  statusFilter: "all" | "active" | "blocked";
  onStatusFilterChange: (value: "all" | "active" | "blocked") => void;
  onStatusChange: (userId: string, status: "active" | "blocked") => void;
  onView: (userId: string) => void;
  onToggleBlock: (userId: string) => void;
};

export default function UserManagementTable({
  users,
  statusFilter,
  onStatusFilterChange,
  onStatusChange,
  onView,
  onToggleBlock,
}: UserManagementTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-border">
          <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
            User Name
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
            Email
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                onStatusFilterChange(v as "all" | "active" | "blocked")
              }
            >
              <SelectTrigger className="h-auto w-[120px] border-0 bg-transparent p-0 text-left text-sm font-semibold text-card-foreground shadow-none focus:ring-0 focus-visible:ring-0">
                <SelectValue asChild>
                  <span>
                    {statusFilter === "all"
                      ? "Status"
                      : statusFilter === "active"
                        ? "Active"
                        : "Blocked"}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
            Registration date
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr
            key={user.id}
            className={`${
              index !== users.length - 1 ? "border-b border-border" : ""
            } transition-colors hover:bg-muted/50`}
          >
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                  <Image
                    src={user.avatar}
                    alt={user.userName}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-card-foreground">
                  {user.userName}
                </span>
              </div>
            </td>

            <td className="px-6 py-4">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
            </td>

            <td className="px-6 py-4">
              <Select
                value={user.status}
                onValueChange={(value) =>
                  onStatusChange(user.id, value as "active" | "blocked")
                }
              >
                <SelectTrigger className="h-auto w-32 border-0 bg-transparent p-0 text-sm font-medium [&_svg]:hidden">
                  <SelectValue asChild>
                    <span
                      className={
                        user.status === "active"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {user.status === "active" ? "Active" : "Blocked"}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </td>

            <td className="px-6 py-4">
              <span className="text-sm text-muted-foreground">
                {user.registrationDate}
              </span>
            </td>

            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onView(user.id)}
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
                  aria-label="View user"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onToggleBlock(user.id)}
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
                  aria-label={user.isBlocked ? "Unblock user" : "Block user"}
                >
                  {user.isBlocked ? (
                    <Lock className="h-5 w-5 text-red-500" />
                  ) : (
                    <Unlock className="h-5 w-5 text-green-500" />
                  )}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
