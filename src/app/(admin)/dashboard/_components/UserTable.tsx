"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, Lock, Unlock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserReviewModal, {
  UserReviewData,
} from "@/components/admin/user-review-modal";

export interface UserTableItem {
  id: string;
  userName: string;
  email: string;
  registrationDate: string;
  status: "active" | "blocked";
  avatar: string;
  isBlocked?: boolean;
  businessName?: string;
  contact?: string;
  location?: string;
}

const DUMMY_USER_TABLE_ITEMS: UserTableItem[] = [
  {
    id: "1",
    userName: "Sarah Ahmed",
    email: "sarah.ahmed@example.com",
    registrationDate: "2025-11-03",
    status: "active",
    avatar:
      "https://media.istockphoto.com/id/1465504312/vector/young-smiling-man-avatar-man-with-brown-beard-mustache-and-hair-wearing-yellow-sweater-or.jpg?s=612x612&w=0&k=20&c=9AyNmOwjadmLC1PKpANKEXj56e1KxHj9h9hGknd-Rb0=",
    isBlocked: false,
  },
  {
    id: "2",
    userName: "Noman Rahman",
    email: "noman.rahman@example.com",
    registrationDate: "2025-09-18",
    status: "blocked",
    avatar:
      "https://media.istockphoto.com/id/1465504312/vector/young-smiling-man-avatar-man-with-brown-beard-mustache-and-hair-wearing-yellow-sweater-or.jpg?s=612x612&w=0&k=20&c=9AyNmOwjadmLC1PKpANKEXj56e1KxHj9h9hGknd-Rb0=",
    isBlocked: true,
  },
  {
    id: "3",
    userName: "Ayesha Khan",
    email: "ayesha.khan@example.com",
    registrationDate: "2025-12-08",
    status: "active",
    avatar:
      "https://media.istockphoto.com/id/1465504312/vector/young-smiling-man-avatar-man-with-brown-beard-mustache-and-hair-wearing-yellow-sweater-or.jpg?s=612x612&w=0&k=20&c=9AyNmOwjadmLC1PKpANKEXj56e1KxHj9h9hGknd-Rb0=",
    isBlocked: false,
  },
  {
    id: "4",
    userName: "Fahim Islam",
    email: "fahim.islam@example.com",
    registrationDate: "2026-01-12",
    status: "active",
    avatar:
      "https://media.istockphoto.com/id/1465504312/vector/young-smiling-man-avatar-man-with-brown-beard-mustache-and-hair-wearing-yellow-sweater-or.jpg?s=612x612&w=0&k=20&c=9AyNmOwjadmLC1PKpANKEXj56e1KxHj9h9hGknd-Rb0=",
    isBlocked: false,
  },
];

export function UserTable() {
  const [users, setUsers] = useState<UserTableItem[]>(DUMMY_USER_TABLE_ITEMS);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "blocked"
  >("all");
  const [pendingBlockUserId, setPendingBlockUserId] = useState<string | null>(
    null,
  );
  const [reviewUserId, setReviewUserId] = useState<string | null>(null);

  const filteredUsers =
    statusFilter === "all"
      ? users
      : users.filter((user) => user.status === statusFilter);

  const handleStatusChange = (userId: string, status: "active" | "blocked") => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, status, isBlocked: status === "blocked" }
          : user,
      ),
    );
  };

  const handleToggleBlock = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id !== userId) return user;
        const nextBlockedState = !user.isBlocked;
        return {
          ...user,
          isBlocked: nextBlockedState,
          status: nextBlockedState ? "blocked" : "active",
        };
      }),
    );
  };

  const handleBlockActionClick = (userId: string) => {
    const selectedUser = users.find((user) => user.id === userId);
    if (!selectedUser) return;

    if (selectedUser.isBlocked) {
      handleToggleBlock(userId);
      return;
    }

    setPendingBlockUserId(userId);
  };

  const confirmBlockUser = () => {
    if (!pendingBlockUserId) return;
    handleToggleBlock(pendingBlockUserId);
    setPendingBlockUserId(null);
  };

  const selectedReviewUser = users.find((user) => user.id === reviewUserId);

  const reviewData: UserReviewData | null = selectedReviewUser
    ? {
        userName: selectedReviewUser.userName,
        email: selectedReviewUser.email,
        avatar: selectedReviewUser.avatar,
        businessName:
          selectedReviewUser.businessName ?? selectedReviewUser.userName,
        contact: selectedReviewUser.contact ?? "+880 12564-5464",
        location: selectedReviewUser.location ?? "Mohakhali, Dhaka",
      }
    : null;

  return (
    <>
      <div className="w-full overflow-x-auto rounded-lg border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-2xl font-bold text-card-foreground">
            User Table
          </h2>
        </div>
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
                Registration date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as "all" | "active" | "blocked")
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
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user.id}
                className={`${
                  index !== filteredUsers.length - 1
                    ? "border-b border-border"
                    : ""
                } transition-colors hover:bg-muted/50`}
              >
                {/* User Info */}
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

                {/* Email */}
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                </td>

                {/* Registration Date */}
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {user.registrationDate}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <Select
                    value={user.status}
                    onValueChange={(value) =>
                      handleStatusChange(user.id, value as "active" | "blocked")
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

                {/* Action */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setReviewUserId(user.id)}
                      className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
                      aria-label="View user"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleBlockActionClick(user.id)}
                      className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
                      aria-label={
                        user.isBlocked ? "Unblock user" : "Block user"
                      }
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
      </div>

      <AlertDialog
        open={pendingBlockUserId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingBlockUserId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will immediately set the user status to blocked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmBlockUser}
            >
              Confirm Block
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UserReviewModal
        open={reviewUserId !== null}
        user={reviewData}
        onOpenChange={(open) => {
          if (!open) {
            setReviewUserId(null);
          }
        }}
        onBlock={() => {
          if (!reviewUserId) return;
          setReviewUserId(null);
          handleBlockActionClick(reviewUserId);
        }}
      />
    </>
  );
}
