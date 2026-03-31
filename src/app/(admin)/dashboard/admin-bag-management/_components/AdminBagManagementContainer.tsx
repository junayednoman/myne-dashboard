"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import AdminActionButton from "@/components/admin/admin-action-button";
import { Input } from "@/components/ui/input";
import AddBagDialog from "./AddBagDialog";
import AdminBagDeleteDialog from "./AdminBagDeleteDialog";
import AdminBagManagementTable from "./AdminBagManagementTable";
import AdminBagPagination from "./AdminBagPagination";
import AdminBagDetailsModal from "./AdminBagDetailsModal";
import AdminBagEditModal from "./AdminBagEditModal";
import { ADMIN_BAG_PAGE_SIZE } from "../constants";
import { AdminBagItem } from "../types";
import {
  useDeleteAdminBagMutation,
  useGetAdminBagsQuery,
} from "@/redux/api/adminBagApi";
import handleMutation from "@/utils/handleMutation";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminBagManagementContainer() {
  const [bags, setBags] = useState<AdminBagItem[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDeleteBagId, setPendingDeleteBagId] = useState<string | null>(
    null,
  );
  const [isAddBagOpen, setIsAddBagOpen] = useState(false);
  const [viewBagId, setViewBagId] = useState<string | null>(null);
  const [editBagId, setEditBagId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useGetAdminBagsQuery({
    page,
    limit: ADMIN_BAG_PAGE_SIZE,
  });
  const [deleteAdminBag] = useDeleteAdminBagMutation();

  const mappedBags = useMemo<AdminBagItem[]>(() => {
    return (
      data?.data?.map((bag) => ({
        id: bag._id,
        bagImage: bag.image,
        brand: bag.bagBrand?.brandName ?? "",
        model: bag.bagModel?.modelName ?? "",
        productionYear: bag.productionYear
          ? new Date(bag.productionYear).getFullYear()
          : new Date().getFullYear(),
        currentValue: bag.priceStatus?.currentValue ?? 0,
      })) ?? []
    );
  }, [data]);

  useEffect(() => {
    setBags(mappedBags);
  }, [mappedBags]);

  const filteredBags = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return bags;

    return bags.filter(
      (bag) =>
        bag.brand.toLowerCase().includes(query) ||
        bag.model.toLowerCase().includes(query) ||
        bag.id.toLowerCase().includes(query),
    );
  }, [bags, search]);

  const totalPages = Math.max(1, data?.meta?.totalPages ?? 1);
  const currentPage = Math.min(page, totalPages);

  const paginatedBags = useMemo(() => filteredBags, [filteredBags]);

  const errorMessage = (() => {
    if (!isError) return "";
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "data" in error) {
      const dataError = (error as { data?: { message?: string } }).data;
      if (dataError?.message) return dataError.message;
    }
    return "Failed to load admin bags.";
  })();

  const handleDeleteConfirm = () => {
    if (!pendingDeleteBagId) return;
    handleMutation(
      { id: pendingDeleteBagId },
      deleteAdminBag,
      "Deleting bag...",
      () => {
        setBags((prev) => prev.filter((bag) => bag.id !== pendingDeleteBagId));
        setPendingDeleteBagId(null);
      },
    );
  };

  return (
    <>
      <div className="w-full overflow-x-auto rounded-lg border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border px-6 py-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold text-card-foreground">
            Admin Bag Management
          </h2>
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search bags..."
              className="h-10 w-full border-border bg-background sm:w-[260px]"
            />
            <AdminActionButton onClick={() => setIsAddBagOpen(true)}>
              <Plus className="h-4 w-4" />
              Add New Bag
            </AdminActionButton>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 px-6 py-4">
            <div className="grid grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-5 w-full" />
              ))}
            </div>
            {Array.from({ length: ADMIN_BAG_PAGE_SIZE }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-9 w-40" />
            </div>
          </div>
        ) : isError ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            {errorMessage}
          </div>
        ) : paginatedBags.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            No admin bag data available.
          </div>
        ) : (
          <>
            <AdminBagManagementTable
              bags={paginatedBags}
              onDelete={setPendingDeleteBagId}
              onView={setViewBagId}
              onEdit={setEditBagId}
            />

            <AdminBagPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <AdminBagDeleteDialog
        open={pendingDeleteBagId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteBagId(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
      />

      <AddBagDialog open={isAddBagOpen} onOpenChange={setIsAddBagOpen} />

      <AdminBagDetailsModal
        open={viewBagId !== null}
        bag={bags.find((item) => item.id === viewBagId) ?? null}
        onOpenChange={(open) => {
          if (!open) {
            setViewBagId(null);
          }
        }}
      />

      <AdminBagEditModal
        open={editBagId !== null}
        bag={bags.find((item) => item.id === editBagId) ?? null}
        onOpenChange={(open) => {
          if (!open) {
            setEditBagId(null);
          }
        }}
        onSave={(updated) => {
          setBags((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item)),
          );
          setEditBagId(null);
        }}
      />
    </>
  );
}
