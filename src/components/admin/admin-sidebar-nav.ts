import {
  LayoutDashboard,
  User,
  ShoppingBag,
  BriefcaseBusiness,
  Boxes,
  Newspaper,
  Settings,
} from "lucide-react";

export type AdminSidebarNavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const adminSidebarNavItems: AdminSidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/dashboard/user-management",
    icon: User,
  },
  {
    title: "User Bag Management",
    href: "/dashboard/user-bag-management",
    icon: ShoppingBag,
  },
  {
    title: "Admin Bag Management",
    href: "/dashboard/admin-bag-management",
    icon: BriefcaseBusiness,
  },
  {
    title: "Brand",
    href: "/dashboard/brand",
    icon: Boxes,
  },
  {
    title: "Bag Model",
    href: "/dashboard/bag-model",
    icon: ShoppingBag,
  },
  {
    title: "Blog",
    href: "/dashboard/blog",
    icon: Newspaper,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];
