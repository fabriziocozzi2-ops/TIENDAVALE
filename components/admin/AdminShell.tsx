"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F7F8FA] text-gray-900">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 min-w-0">
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
