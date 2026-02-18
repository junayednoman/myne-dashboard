"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import AdminActionButton from "@/components/admin/admin-action-button";
import { Input } from "@/components/ui/input";
import AddBagDialog from "./AddBagDialog";
import AdminBagDeleteDialog from "./AdminBagDeleteDialog";
import AdminBagManagementTable from "./AdminBagManagementTable";
import AdminBagPagination from "./AdminBagPagination";
import { ADMIN_BAG_PAGE_SIZE, DUMMY_ADMIN_BAGS } from "../constants";
import { AdminBagItem } from "../types";

export default function AdminBagManagementContainer() {
  const [bags, setBags] = useState<AdminBagItem[]>(DUMMY_ADMIN_BAGS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDeleteBagId, setPendingDeleteBagId] = useState<string | null>(
    null,
  );
  const [isAddBagOpen, setIsAddBagOpen] = useState(false);

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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBags.length / ADMIN_BAG_PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);

  const paginatedBags = useMemo(() => {
    const start = (currentPage - 1) * ADMIN_BAG_PAGE_SIZE;
    return filteredBags.slice(start, start + ADMIN_BAG_PAGE_SIZE);
  }, [filteredBags, currentPage]);

  const handleDeleteConfirm = () => {
    if (!pendingDeleteBagId) return;
    setBags((prev) => prev.filter((bag) => bag.id !== pendingDeleteBagId));
    setPendingDeleteBagId(null);
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

        <AdminBagManagementTable
          bags={paginatedBags}
          onDelete={setPendingDeleteBagId}
        />

        <AdminBagPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
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
    </>
  );
}
