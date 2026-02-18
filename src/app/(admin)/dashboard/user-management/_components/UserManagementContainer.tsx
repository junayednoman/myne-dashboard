"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import AdminActionButton from "@/components/admin/admin-action-button";
import UserReviewModal, {
  UserReviewData,
} from "@/components/admin/user-review-modal";
import { Input } from "@/components/ui/input";
import UserBlockDialog from "./UserBlockDialog";
import UserManagementPagination from "./UserManagementPagination";
import UserManagementTable from "./UserManagementTable";
import { UserTableItem } from "../types";
import { DUMMY_USER_TABLE_ITEMS, USER_PAGE_SIZE } from "../constants";

export default function UserManagementContainer() {
  const [users, setUsers] = useState<UserTableItem[]>(DUMMY_USER_TABLE_ITEMS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "blocked"
  >("all");
  const [page, setPage] = useState(1);
  const [pendingBlockUserId, setPendingBlockUserId] = useState<string | null>(
    null,
  );
  const [reviewUserId, setReviewUserId] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const bySearch = query
      ? users.filter(
          (user) =>
            user.userName.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query),
        )
      : users;

    return statusFilter === "all"
      ? bySearch
      : bySearch.filter((user) => user.status === statusFilter);
  }, [users, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USER_PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USER_PAGE_SIZE;
    return filteredUsers.slice(start, start + USER_PAGE_SIZE);
  }, [filteredUsers, currentPage]);

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
        <div className="flex flex-col gap-3 border-b border-border px-6 py-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold text-card-foreground">
            User Management
          </h2>
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search users..."
              className="h-10 w-full border-border bg-background sm:w-[260px]"
            />
            <AdminActionButton>
              <Plus className="h-4 w-4" />
              Add New User
            </AdminActionButton>
          </div>
        </div>

        <UserManagementTable
          users={paginatedUsers}
          statusFilter={statusFilter}
          onStatusFilterChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          onStatusChange={handleStatusChange}
          onView={setReviewUserId}
          onToggleBlock={handleBlockActionClick}
        />

        <UserManagementPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <UserBlockDialog
        open={pendingBlockUserId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingBlockUserId(null);
          }
        }}
        onConfirm={confirmBlockUser}
      />

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
