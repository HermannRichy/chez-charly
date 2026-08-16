import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { MenuItemEditor } from "@/components/admin/menu/MenuItemEditor";

export default async function EditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [item, categoryRows] = await Promise.all([
    prisma.menuItem.findUnique({ where: { id } }),
    prisma.menuItem.findMany({ select: { category: true }, distinct: ["category"] }),
  ]);

  if (!item) notFound();
  const categories = categoryRows.map((c) => c.category);

  return (
    <div className="grid gap-5 min-w-0">
      <div>
        <Link
          href="/admin/menu"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft size={15} />
          Menu
        </Link>
        <h1 className="font-grifter text-2xl text-foreground mt-2">{item.name}</h1>
      </div>
      <MenuItemEditor item={item} categories={categories} />
    </div>
  );
}
