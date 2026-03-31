"use client";

import { useEffect, useMemo, useState } from "react";

import BagDetailsModal from "./BagDetailsModal";
import UserBagDeleteDialog from "./UserBagDeleteDialog";
import UserBagManagementTable from "./UserBagManagementTable";
import UserBagPagination from "./UserBagPagination";
import { UserBagItem } from "../types";
import { HISTORY_YEAR_OPTIONS } from "../utils";
import { USER_BAG_PAGE_SIZE } from "../constants";
import { useGetCollectionsQuery } from "@/redux/api/collectionApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserBagManagementContainer() {
  const placeholderImage =
    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
  const [bags, setBags] = useState<UserBagItem[]>([]);
  const [page, setPage] = useState(1);
  const [reviewBagId, setReviewBagId] = useState<string | null>(null);
  const [pendingDeleteBagId, setPendingDeleteBagId] = useState<string | null>(
    null,
  );
  const [historyYear, setHistoryYear] = useState<string>(
    HISTORY_YEAR_OPTIONS[5],
  );

  const { data, isLoading } = useGetCollectionsQuery({
    page,
    limit: USER_BAG_PAGE_SIZE,
  });

  const mappedBags = useMemo<UserBagItem[]>(() => {
    return (
      data?.data?.map((item) => ({
        id: item._id,
        bagName: item.model?.modelName ?? "Bag",
        bagImage:
          item.primaryImage ??
          item.model?.modelImage ??
          item.brand?.brandLogo ??
          placeholderImage,
        ownerName: item.user?.name ?? "User",
        ownerImage: item.user?.avatar ?? placeholderImage,
        brand: item.brand?.brandName ?? "",
        brandLogo: item.brand?.brandLogo ?? placeholderImage,
        model: item.model?.modelName ?? "",
        purchaseYear: item.purchaseDate
          ? new Date(item.purchaseDate).getFullYear()
          : new Date(item.createdAt).getFullYear(),
        cost: item.purchasePrice ?? 0,
        currentValue: item.priceStatus?.currentValue ?? 0,
        changePercentage: item.priceStatus?.changePercentage,
      })) ?? []
    );
  }, [data]);

  useEffect(() => {
    setBags(mappedBags);
  }, [mappedBags]);

  const totalPages = Math.max(1, data?.meta?.totalPages ?? 1);
  const currentPage = Math.min(page, totalPages);

  const paginatedBags = useMemo(() => {
    return bags;
  }, [bags]);

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

        {isLoading ? (
          <div className="space-y-3 px-6 py-4">
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton key={index} className="h-5 w-full" />
              ))}
            </div>
            {Array.from({ length: USER_BAG_PAGE_SIZE }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-9 w-40" />
            </div>
          </div>
        ) : paginatedBags.length === 0 ? (
          <div className="flex items-center justify-center px-6 py-10 text-sm text-muted-foreground">
            No user bag data available.
          </div>
        ) : (
          <>
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
          </>
        )}
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
        bagId={reviewBagId}
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
