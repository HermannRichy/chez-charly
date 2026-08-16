import { requireStaffPage } from "@/lib/session";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaffPage();

  return (
    <AdminShell user={{ name: user.name, email: user.email }}>
      {children}
    </AdminShell>
  );
}
