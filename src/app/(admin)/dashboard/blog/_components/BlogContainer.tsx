"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import AdminActionButton from "@/components/admin/admin-action-button";
import { Input } from "@/components/ui/input";
import { BLOG_PAGE_SIZE, DUMMY_BLOGS } from "../constants";
import { BlogItem } from "../types";
import BlogDeleteDialog from "./BlogDeleteDialog";
import BlogItemCard from "./BlogItemCard";
import BlogPagination from "./BlogPagination";

export default function BlogContainer() {
  const router = useRouter();
  const [items, setItems] = useState<BlogItem[]>(DUMMY_BLOGS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query),
    );
  }, [items, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / BLOG_PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * BLOG_PAGE_SIZE;
    return filteredItems.slice(start, start + BLOG_PAGE_SIZE);
  }, [filteredItems, currentPage]);

  const handleDeleteConfirm = () => {
    if (!pendingDeleteId) return;
    setItems((prev) => prev.filter((item) => item.id !== pendingDeleteId));
    setPendingDeleteId(null);
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
