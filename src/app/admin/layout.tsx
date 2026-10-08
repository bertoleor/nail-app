import type { Metadata } from "next";

import AdminSidebar from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: "Admin — NailApp",
};

export default function AdminLayout({
  children,
}: Readonly<{
  readonly children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50/30 lg:flex">
      <aside className="flex w-full flex-col border-b border-gray-200 bg-white/80 p-4 backdrop-blur-md lg:fixed lg:top-0 lg:bottom-0 lg:left-0 lg:w-64 lg:border-r lg:border-b-0">
        <div className="mb-8 hidden lg:block">
          <h1 className="font-serif text-2xl">NailApp</h1>
          <p className="text-xs text-[rgba(15,15,20,0.5)]">Panel de administración</p>
        </div>

        <AdminSidebar />
      </aside>

      <main className="flex-1 p-4 sm:p-8 lg:ml-64">{children}</main>
    </div>
  );
}
