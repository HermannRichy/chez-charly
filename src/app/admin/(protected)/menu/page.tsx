import { prisma } from "@/lib/prisma";
import { AdminAddMenuItem } from "@/components/admin/AdminAddMenuItem";
import { AdminMenuRow } from "@/components/admin/AdminMenuRow";

export default async function AdminMenuPage() {
  const items = await prisma.menuItem.findMany({ orderBy: { createdAt: "asc" } });

  const categories: string[] = [];
  for (const it of items) if (!categories.includes(it.category)) categories.push(it.category);

  return (
    <div>
      <AdminAddMenuItem categories={categories} />
      <div className="grid gap-2 mt-3.5">
        {items.map((item) => (
          <AdminMenuRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
