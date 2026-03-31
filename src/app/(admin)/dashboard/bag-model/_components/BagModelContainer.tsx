"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import AdminActionButton from "@/components/admin/admin-action-button";
import { Input } from "@/components/ui/input";
import BagModelDeleteDialog from "./BagModelDeleteDialog";
import BagModelFormDialog, { BagModelFormValues } from "./BagModelFormDialog";
import BagModelItemCard from "./BagModelItemCard";
import BagModelPagination from "./BagModelPagination";
import { BagModelItem } from "../types";
import { BAG_MODEL_PAGE_SIZE } from "../constants";
import {
  useCreateModelMutation,
  useDeleteModelMutation,
  useGetModelsQuery,
  useUpdateModelMutation,
} from "@/redux/api/modelApi";
import { Skeleton } from "@/components/ui/skeleton";
import handleMutation from "@/utils/handleMutation";
import { useGetBrandsQuery } from "@/redux/api/brandApi";

export default function BagModelContainer() {
  const [items, setItems] = useState<BagModelItem[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useGetModelsQuery({
    page,
    limit: BAG_MODEL_PAGE_SIZE,
  });
  const { data: brandData } = useGetBrandsQuery({
    page: 1,
    limit: 100,
  });

  const mappedItems = useMemo<BagModelItem[]>(() => {
    return (
      data?.data?.map((item) => ({
        id: item._id,
        modelName: item.modelName,
        image: item.modelImage,
        brandId: item.brandId,
      })) ?? []
    );
  }, [data]);

  const brandOptions = useMemo(
    () =>
      brandData?.data?.map((brand) => ({
        label: brand.brandName,
        value: brand._id,
      })) ?? [],
    [brandData],
  );

  useEffect(() => {
    setItems(mappedItems);
  }, [mappedItems]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => item.modelName.toLowerCase().includes(query));
  }, [items, search]);

  const totalPages = Math.max(1, data?.meta?.totalPages ?? 1);
  const currentPage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => filteredItems, [filteredItems]);

  const errorMessage = (() => {
    if (!isError) return "";
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "data" in error) {
      const dataError = (error as { data?: { message?: string } }).data;
      if (dataError?.message) return dataError.message;
    }
    return "Failed to load models.";
  })();

  const [createModel] = useCreateModelMutation();
  const [deleteModel] = useDeleteModelMutation();
  const [updateModel] = useUpdateModelMutation();

  const handleDeleteConfirm = () => {
    if (!pendingDeleteId) return;
    handleMutation(
      { id: pendingDeleteId },
      deleteModel,
      "Deleting model...",
      () => {
        setItems((prev) => prev.filter((item) => item.id !== pendingDeleteId));
        setPendingDeleteId(null);
      },
    );
  };

  const handleFormSubmit = (
    values: BagModelFormValues,
    imageFile?: File | null,
  ) => {
    if (formMode === "edit" && editingId) {
      const modelName =
        values.modelName && values.modelName.trim()
          ? values.modelName
          : undefined;
      const brandId =
        values.brand && values.brand.trim() ? values.brand : undefined;
      handleMutation(
        { id: editingId, modelName, brandId, modelImage: imageFile || undefined },
        updateModel,
        "Updating model...",
        () => {
          setItems((prev) =>
            prev.map((item) =>
              item.id === editingId
                ? {
                    ...item,
                    modelName: modelName ?? item.modelName,
                    brandId: brandId ?? item.brandId,
                  }
                : item,
            ),
          );
        },
      );
      return;
    }

    if (!imageFile) return;
    handleMutation(
      {
        modelName: values.modelName,
        brandId: values.brand,
        modelImage: imageFile,
      },
      createModel,
      "Creating model...",
    );
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

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-[220px] w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-md border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            {errorMessage}
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="rounded-md border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            No model data available.
          </div>
        ) : (
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
        )}

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
        brandOptions={brandOptions}
        initialValues={
          formMode === "edit"
            ? {
                brand: editingItem?.brandId ?? "",
                modelName: editingItem?.modelName ?? "",
              }
            : undefined
        }
        initialImageUrl={formMode === "edit" ? editingItem?.image : undefined}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
      />
    </>
  );
}
