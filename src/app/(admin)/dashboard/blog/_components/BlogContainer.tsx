"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import AdminActionButton from "@/components/admin/admin-action-button";
import { Input } from "@/components/ui/input";
import { BLOG_PAGE_SIZE } from "../constants";
import { BlogItem } from "../types";
import BlogDeleteDialog from "./BlogDeleteDialog";
import BlogItemCard from "./BlogItemCard";
import BlogPagination from "./BlogPagination";
import {
  useDeleteBlogMutation,
  useGetBlogsQuery,
} from "@/redux/api/blogApi";
import handleMutation from "@/utils/handleMutation";
import { Skeleton } from "@/components/ui/skeleton";

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

export default function BlogContainer() {
  const router = useRouter();
  const [items, setItems] = useState<BlogItem[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { data, isLoading, isError, error } = useGetBlogsQuery({
    page,
    limit: BLOG_PAGE_SIZE,
  });
  const [deleteBlog] = useDeleteBlogMutation();

  const mappedItems = useMemo<BlogItem[]>(() => {
    return (
      data?.data?.map((item) => ({
        id: item._id,
        title: item.blogTitle,
        description: stripHtml(item.blogDescription),
        content: item.blogDescription,
        image: item.blogImage,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })) ?? []
    );
  }, [data]);

  useEffect(() => {
    setItems(mappedItems);
  }, [mappedItems]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query),
    );
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
    return "Failed to load blogs.";
  })();

  const handleDeleteConfirm = () => {
    if (!pendingDeleteId) return;
    handleMutation(
      { id: pendingDeleteId },
      deleteBlog,
      "Deleting blog...",
      () => {
        setItems((prev) => prev.filter((item) => item.id !== pendingDeleteId));
        setPendingDeleteId(null);
      },
    );
  };

  return (
    <>
      <section className="rounded-lg border border-border bg-card p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold text-card-foreground">
            All Blog list
          </h2>

          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search blog..."
              className="h-10 w-full border-border bg-background sm:w-[260px]"
            />
            <AdminActionButton
              onClick={() => router.push("/dashboard/blog/create")}
            >
              <Plus className="h-4 w-4" />
              Add Blog
            </AdminActionButton>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-[320px] w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-md border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            {errorMessage}
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="rounded-md border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            No blog data available.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {paginatedItems.map((item) => (
              <BlogItemCard
                key={item.id}
                item={item}
                onDelete={setPendingDeleteId}
                onEdit={(id) => router.push(`/dashboard/blog/${id}/edit`)}
              />
            ))}
          </div>
        )}

        <BlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </section>

      <BlogDeleteDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteId(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
