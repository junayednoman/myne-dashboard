"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import AdminActionButton from "@/components/admin/admin-action-button";
import { Input } from "@/components/ui/input";
import BagModelDeleteDialog from "./BagModelDeleteDialog";
import BagModelFormDialog, { BagModelFormValues } from "./BagModelFormDialog";
import BagModelItemCard from "./BagModelItemCard";
import BagModelPagination from "./BagModelPagination";
import { BagModelItem } from "../types";
import { BAG_MODEL_PAGE_SIZE, DUMMY_BAG_MODELS } from "../constants";

export default function BagModelContainer() {
  const [items, setItems] = useState<BagModelItem[]>(DUMMY_BAG_MODELS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => item.modelName.toLowerCase().includes(query));
  }, [items, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / BAG_MODEL_PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * BAG_MODEL_PAGE_SIZE;
    return filteredItems.slice(start, start + BAG_MODEL_PAGE_SIZE);
  }, [filteredItems, currentPage]);

  const handleDeleteConfirm = () => {
    if (!pendingDeleteId) return;
    setItems((prev) => prev.filter((item) => item.id !== pendingDeleteId));
    setPendingDeleteId(null);
  };

  const handleFormSubmit = (
    values: BagModelFormValues,
    imagePreviewUrl: string,
  ) => {
    if (formMode === "edit" && editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                modelName: `Model: ${values.brand}`,
                image: imagePreviewUrl,
              }
            : item,
        ),
      );
      return;
    }

    const newItem: BagModelItem = {
      id: `BM-${Date.now()}`,
      modelName: `Model: ${values.brand}`,
      image: imagePreviewUrl,
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const editingItem = items.find((item) => item.id === editingId);

  return (
    <>
      <section className="rounded-lg border border-border bg-card p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold text-card-foreground">
            All Model list
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
              Add Model
            </AdminActionButton>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {paginatedItems.map((item) => (
            <BagModelItemCard
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

        <BagModelPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </section>

      <BagModelDeleteDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteId(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
      />

      <BagModelFormDialog
        open={isFormOpen}
        mode={formMode}
        initialValues={
          formMode === "edit"
            ? {
                brand: "Hermes",
                modelName:
                  editingItem?.modelName.replace("Model: ", "") ?? "Hermes",
              }
            : undefined
        }
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
      />
    </>
  );
}
