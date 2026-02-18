"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import AdminActionButton from "@/components/admin/admin-action-button";
import { Input } from "@/components/ui/input";
import { BRAND_PAGE_SIZE, DUMMY_BRANDS } from "../constants";
import { BrandItem } from "../types";
import BrandDeleteDialog from "./BrandDeleteDialog";
import BrandFormDialog, { BrandFormValues } from "./BrandFormDialog";
import BrandItemCard from "./BrandItemCard";
import BrandPagination from "./BrandPagination";

export default function BrandContainer() {
  const [items, setItems] = useState<BrandItem[]>(DUMMY_BRANDS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => item.brandName.toLowerCase().includes(query));
  }, [items, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / BRAND_PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * BRAND_PAGE_SIZE;
    return filteredItems.slice(start, start + BRAND_PAGE_SIZE);
  }, [filteredItems, currentPage]);

  const handleDeleteConfirm = () => {
    if (!pendingDeleteId) return;
    setItems((prev) => prev.filter((item) => item.id !== pendingDeleteId));
    setPendingDeleteId(null);
  };

  const handleFormSubmit = (
    values: BrandFormValues,
    logoPreviewUrl: string,
  ) => {
    if (formMode === "edit" && editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                brandName: `Brand: ${values.brandName}`,
                logo: logoPreviewUrl,
              }
            : item,
        ),
      );
      return;
    }

    const newItem: BrandItem = {
      id: `BR-${Date.now()}`,
      brandName: `Brand: ${values.brandName}`,
      logo: logoPreviewUrl,
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const editingItem = items.find((item) => item.id === editingId);

  return (
    <>
      <section className="rounded-lg border border-border bg-card p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold text-card-foreground">
            All Brand list
          </h2>
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search user..."
              className="h-10 w-full border-border bg-background sm:w-[260px]"
            />
            <AdminActionButton
              onClick={() => {
                setFormMode("add");
                setEditingId(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Brand
            </AdminActionButton>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {paginatedItems.map((item) => (
            <BrandItemCard
              key={item.id}
              item={item}
              onDelete={setPendingDeleteId}
              onEdit={(id) => {
                setFormMode("edit");
                setEditingId(id);
                setIsFormOpen(true);
              }}
            />
          ))}
        </div>

        <BrandPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </section>

      <BrandDeleteDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteId(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
      />

      <BrandFormDialog
        open={isFormOpen}
        mode={formMode}
        initialValues={
          formMode === "edit"
            ? {
                brandName:
                  editingItem?.brandName.replace("Brand: ", "") ?? "Hermes",
              }
            : undefined
        }
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
      />
    </>
  );
}
