"use client";

import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

const AdminHeader = () => {
  return (
    <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-[#2c323b] bg-[#0f131a]/90 px-6 backdrop-blur-sm">
      <SidebarTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] text-[#d2d8e3] transition hover:bg-[#252b35] hover:text-white" />

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-[8px] text-[#d2d8e3] transition hover:bg-[#252b35] hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="size-[20px]" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#ff4d4f]" />
        </button>

        <Link
          href={"/dashboard/profile"}
          type="button"
          className="h-10 w-10 overflow-hidden rounded-full border border-[#7a8290]"
          aria-label="Profile"
        >
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(https://thumbs.dreamstime.com/b/cute-cartoon-girl-avatar-long-brown-hair-friendly-expression-various-uses-showcasing-young-female-character-371428712.jpg)`,
            }}
          ></div>
        </Link>
      </div>
    </header>
  );
};

export default AdminHeader;
