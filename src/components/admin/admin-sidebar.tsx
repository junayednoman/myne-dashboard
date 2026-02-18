"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { adminSidebarNavItems } from "@/components/admin/admin-sidebar-nav";
import Image from "next/image";
import adminLogo from "@/assets/admin logo.svg";

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="flex flex-col bg-transparent">
      <SidebarHeader className="px-8 pb-8 pt-6 group-data-[collapsible=icon]:px-2">
        <Link href="/dashboard" className="block">
          <Image src={adminLogo} alt="logo" width={140} height={140} />
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-1 px-4 group-data-[collapsible=icon]:px-0">
        <SidebarMenu className="gap-2 group-data-[collapsible=icon]:items-center">
          {adminSidebarNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`h-11 rounded-md px-4 py-2 text-sm font-medium transition-colors group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:!justify-center ${
                    isActive
                      ? "bg-[#2c323b] text-[#ffffff]"
                      : "text-[#a6adb9] hover:bg-[#1a202c] hover:text-[#dfe3ea]"
                  }`}
                >
                  <Link
                    href={item.href}
                    className="flex w-full items-center gap-3 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                  >
                    <Icon className="size-4 flex-shrink-0 group-data-[collapsible=icon]:size-5" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="mt-auto px-4 pb-8 group-data-[collapsible=icon]:px-2">
        <button className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#353b46] text-sm font-medium text-[#a6adb9] transition-all hover:border-[#dc2626] hover:bg-[#dc2626]/10 hover:text-[#dc2626]">
          <LogOut className="size-4" />
          <span className="group-data-[collapsible=icon]:hidden">Log Out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
