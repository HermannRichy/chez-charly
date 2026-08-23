import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/session";
import { relativeTime } from "@/lib/relative-time";
import { PageHeader } from "@/components/admin/ui/page-header";
import { TableCard } from "@/components/admin/ui/table-card";
import { UsersTable } from "@/components/admin/utilisateurs/UsersTable";

export default async function AdminUtilisateursPage() {
  const currentUser = await requireStaff();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grid gap-5 min-w-0">
      <PageHeader title="Utilisateurs" description={`${users.length} compte(s)`} />
      <TableCard>
        <UsersTable
          currentUserId={currentUser.id}
          users={users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            role: u.role,
            points: u.points,
            joinedLabel: relativeTime(u.createdAt),
          }))}
        />
      </TableCard>
    </div>
  );
}
