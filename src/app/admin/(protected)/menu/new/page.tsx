import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { MenuItemEditor } from "@/components/admin/menu/MenuItemEditor";

export default async function NewMenuItemPage() {
  const items = await prisma.menuItem.findMany({ select: { category: true }, distinct: ["category"] });
  const categories = items.map((i) => i.category);

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
        <h1 className="font-grifter text-2xl text-foreground mt-2">Nouveau plat</h1>
      </div>
      <MenuItemEditor categories={categories} />
    </div>
  );
}
