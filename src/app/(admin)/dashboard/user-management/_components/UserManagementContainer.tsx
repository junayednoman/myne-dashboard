"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { format } from "date-fns";

import AdminActionButton from "@/components/admin/admin-action-button";
import UserReviewModal, {
  UserReviewData,
} from "@/components/admin/user-review-modal";
import { Input } from "@/components/ui/input";
import UserBlockDialog from "./UserBlockDialog";
import UserManagementPagination from "./UserManagementPagination";
import UserManagementTable from "./UserManagementTable";
import AddUserDialog, { AddUserFormValues } from "./AddUserDialog";
import { UserTableItem } from "../types";
import { USER_PAGE_SIZE } from "../constants";
import {
  useChangeUserStatusMutation,
  useCreateAdminUserMutation,
  useGetAdminUsersQuery,
} from "@/redux/api/userApi";
import { Skeleton } from "@/components/ui/skeleton";
import handleMutation from "@/utils/handleMutation";

export default function UserManagementContainer() {
  const [users, setUsers] = useState<UserTableItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "blocked"
  >("all");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAdminUsersQuery({
    page,
    limit: USER_PAGE_SIZE,
    sortBy: -1,
  });
  const [changeUserStatus] = useChangeUserStatusMutation();
  const [createAdminUser] = useCreateAdminUserMutation();
  const [pendingBlockUserId, setPendingBlockUserId] = useState<string | null>(
    null,
  );
  const [reviewUserId, setReviewUserId] = useState<string | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const mappedUsers = useMemo<UserTableItem[]>(() => {
    return (
      data?.data?.map((user) => ({
        id: user._id,
        userName: user.name,
        email: user.email,
        registrationDate: format(new Date(user.createdAt), "yyyy-MM-dd"),
        status: user.accountStatus,
        avatar: user.avatar,
        isBlocked: user.accountStatus === "blocked",
      })) ?? []
    );
  }, [data]);

  useEffect(() => {
    setUsers(mappedUsers);
  }, [mappedUsers]);

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

  const totalPages = Math.max(1, data?.meta?.totalPages ?? 1);
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers;

  const handleStatusChange = (userId: string, status: "active" | "blocked") => {
    handleMutation(
      { id: userId, accountStatus: status },
      changeUserStatus,
      "Updating status...",
      () => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? { ...user, status, isBlocked: status === "blocked" }
              : user,
          ),
        );
      },
    );
  };

  const handleToggleBlock = (userId: string) => {
    const current = users.find((user) => user.id === userId);
    if (!current) return;
    const nextStatus = current.isBlocked ? "active" : "blocked";
    handleStatusChange(userId, nextStatus);
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

  const handleAddUser = (values: AddUserFormValues) => {
    handleMutation(values, createAdminUser, "Creating user...", () => {
      setIsAddUserOpen(false);
      setPage(1);
    });
  };

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
            <AdminActionButton onClick={() => setIsAddUserOpen(true)}>
              <Plus className="h-4 w-4" />
              Add New User
            </AdminActionButton>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4 px-6 py-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
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
          </>
        )}
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

      <AddUserDialog
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onSubmit={handleAddUser}
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
