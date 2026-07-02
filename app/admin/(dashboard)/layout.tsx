import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F7F8FA] text-gray-900">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <AdminHeader />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
