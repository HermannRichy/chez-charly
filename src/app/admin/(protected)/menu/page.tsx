import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui/page-header";
import { TableCard } from "@/components/admin/ui/table-card";
import { Button } from "@/components/ui/button";
import { MenuTable } from "@/components/admin/menu/MenuTable";

export default async function AdminMenuPage() {
  const items = await prisma.menuItem.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="grid gap-5 min-w-0">
      <PageHeader
        title="Menu"
        description={`${items.length} plat(s)`}
        actions={
          <Button asChild>
            <Link href="/admin/menu/new">
              <IconPlus size={16} />
              Nouveau plat
            </Link>
          </Button>
        }
      />
      <TableCard>
        <MenuTable items={items} />
      </TableCard>
    </div>
  );
}
