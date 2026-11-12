import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/layout/admin-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-4 border-b px-6">
          <SidebarTrigger />

          <h1 className="text-sm font-semibold">
            英语教学平台管理后台
          </h1>
        </header>

        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}