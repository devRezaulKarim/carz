import { AI } from "@/actions/ai";
import { AdminHeader } from "@/components/layouts/admin-header";
import { AdminSidebar } from "@/components/layouts/admin-sidebar";
import { PropsWithChildren } from "react";

export default async function AdminLayout({ children }: PropsWithChildren) {
  return (
    <AI>
      <div className="flex min-h-screen w-full items-start bg-primary-900">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader />
          <main className="admin-scrollbar flex flex-1 flex-col gap-4 overflow-auto p-4 md:gap-8 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </AI>
  );
}
