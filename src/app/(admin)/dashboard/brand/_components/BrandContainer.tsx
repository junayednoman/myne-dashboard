"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import AdminActionButton from "@/components/admin/admin-action-button";
import { Input } from "@/components/ui/input";
import { BRAND_PAGE_SIZE } from "../constants";
import { BrandItem } from "../types";
import BrandDeleteDialog from "./BrandDeleteDialog";
import BrandFormDialog, { BrandFormValues } from "./BrandFormDialog";
import BrandItemCard from "./BrandItemCard";
import BrandPagination from "./BrandPagination";
import {
  useCreateBrandMutation,
  useDeleteBrandMutation,
  useGetBrandsQuery,
  useUpdateBrandMutation,
} from "@/redux/api/brandApi";
import handleMutation from "@/utils/handleMutation";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrandContainer() {
  const [items, setItems] = useState<BrandItem[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useGetBrandsQuery({
    page,
    limit: BRAND_PAGE_SIZE,
  });

  const mappedItems = useMemo<BrandItem[]>(() => {
    return (
      data?.data?.map((brand) => ({
        id: brand._id,
        brandName: brand.brandName,
        logo: brand.brandLogo,
      })) ?? []
    );
  }, [data]);

  useEffect(() => {
    setItems(mappedItems);
  }, [mappedItems]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) =>
      item.brandName.toLowerCase().includes(query),
    );
  }, [items, search]);

  const totalPages = Math.max(1, data?.meta?.totalPages ?? 1);
  const currentPage = Math.min(page, totalPages);

  const [createBrand] = useCreateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();

  const handleDeleteConfirm = () => {
    if (!pendingDeleteId) return;
    handleMutation(
      { id: pendingDeleteId },
      deleteBrand,
      "Deleting brand...",
      () => {
        setItems((prev) => prev.filter((item) => item.id !== pendingDeleteId));
        setPendingDeleteId(null);
      },
    );
  };

  const handleFormSubmit = (
    values: BrandFormValues,
    logoFile?: File | null,
  ) => {
    if (formMode === "edit" && editingId) {
      const current = items.find((item) => item.id === editingId);
      const nextName =
        values.brandName && values.brandName.trim()
          ? values.brandName
          : current?.brandName ?? "";
      handleMutation(
        { id: editingId, brandName: nextName, brandLogo: logoFile || undefined },
        updateBrand,
        "Updating brand...",
        () => {
          setItems((prev) =>
            prev.map((item) =>
              item.id === editingId
                ? {
                    ...item,
                    brandName: nextName,
                  }
                : item,
            ),
          );
        },
      );
      return;
    }

    if (!logoFile) return;
    handleMutation(
      { brandName: values.brandName, brandLogo: logoFile },
      createBrand,
      "Creating brand...",
    );
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

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-[220px] w-full" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex items-center justify-center rounded-md border border-dashed border-border px-4 py-10 text-sm text-muted-foreground">
            No brand data available.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {filteredItems.map((item) => (
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
        )}

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
                brandName: editingItem?.brandName ?? "Hermes",
              }
            : undefined
        }
        initialLogoUrl={formMode === "edit" ? editingItem?.logo : undefined}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
      />
    </>
  );
}
