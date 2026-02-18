import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminHeader from "@/components/admin/admin-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen>
      <AdminSidebar />
      <SidebarInset className="border-l border-[#2c323b]">
        <div className="min-h-screen bg-background text-foreground">
          <AdminHeader />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
