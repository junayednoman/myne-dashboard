"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { useGetAdminProfileQuery } from "@/redux/api/profileApi";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholder-image";

const AdminHeader = () => {
  const { data } = useGetAdminProfileQuery();
  const avatar = data?.data?.avatar || PLACEHOLDER_IMAGE;

  return (
    <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-[#2c323b] bg-[#0f131a]/90 px-6 backdrop-blur-sm">
      <SidebarTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] text-[#d2d8e3] transition hover:bg-[#252b35] hover:text-white" />

      <div className="flex items-center gap-4">
        <Link
          href={"/dashboard/profile"}
          type="button"
          className="h-10 w-10 overflow-hidden rounded-full border border-[#7a8290]"
          aria-label="Profile"
        >
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${avatar})`,
            }}
          ></div>
        </Link>
      </div>
    </header>
  );
};

export default AdminHeader;
