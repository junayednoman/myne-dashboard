"use client";

import { useMemo, useState } from "react";

import BagDetailsModal from "./BagDetailsModal";
import UserBagDeleteDialog from "./UserBagDeleteDialog";
import UserBagManagementTable from "./UserBagManagementTable";
import UserBagPagination from "./UserBagPagination";
import { UserBagItem } from "../types";
import { HISTORY_YEAR_OPTIONS } from "../utils";
import { DUMMY_USER_BAGS, USER_BAG_PAGE_SIZE } from "../constants";

export default function UserBagManagementContainer() {
  const [bags, setBags] = useState<UserBagItem[]>(DUMMY_USER_BAGS);
  const [page, setPage] = useState(1);
  const [reviewBagId, setReviewBagId] = useState<string | null>(null);
  const [pendingDeleteBagId, setPendingDeleteBagId] = useState<string | null>(
    null,
  );
  const [historyYear, setHistoryYear] = useState<string>(
    HISTORY_YEAR_OPTIONS[5],
  );

  const totalPages = Math.max(1, Math.ceil(bags.length / USER_BAG_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedBags = useMemo(() => {
    const start = (currentPage - 1) * USER_BAG_PAGE_SIZE;
    return bags.slice(start, start + USER_BAG_PAGE_SIZE);
  }, [bags, currentPage]);

  const selectedBag = bags.find((item) => item.id === reviewBagId) ?? null;

  const handleDeleteConfirm = () => {
    if (!pendingDeleteBagId) return;
    setBags((prev) => prev.filter((item) => item.id !== pendingDeleteBagId));
    setPendingDeleteBagId(null);
  };

  return (
    <>
      <div className="w-full overflow-x-auto rounded-lg border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-2xl font-bold text-card-foreground">
            User Bag Management
          </h2>
        </div>

        <UserBagManagementTable
          bags={paginatedBags}
          onView={(id) => {
            setReviewBagId(id);
            setHistoryYear(HISTORY_YEAR_OPTIONS[5]);
          }}
          onDelete={setPendingDeleteBagId}
        />

        <UserBagPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <UserBagDeleteDialog
        open={pendingDeleteBagId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteBagId(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
      />

      <BagDetailsModal
        open={reviewBagId !== null}
        bag={selectedBag}
        historyYear={historyYear}
        onHistoryYearChange={setHistoryYear}
        onOpenChange={(open) => {
          if (!open) {
            setReviewBagId(null);
          }
        }}
      />
    </>
  );
}
