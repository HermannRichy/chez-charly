import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/session";

export default async function SuiviIndexPage() {
  const user = await requireClient("/suivi");

  const lastOrder = await prisma.order.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { orderNumber: true },
  });

  if (lastOrder) redirect(`/suivi/${lastOrder.orderNumber}`);

  return (
    <div className="max-w-225 mx-auto px-4 pt-[clamp(34px,6vw,56px)] pb-[clamp(56px,8vw,92px)] text-center">
      <h1 className="font-grifter text-[clamp(38px,5vw,64px)] leading-[.92] text-ink">
        Aucune commande pour l&apos;instant
      </h1>
      <p className="text-base text-[#6A392C] mt-3">
        Vos commandes apparaîtront ici dès que vous en passerez une.
      </p>
      <Link
        href="/menu"
        className="inline-block mt-6.5 border-0 bg-orange text-white px-7 py-3.75 rounded-full text-[15px] font-extrabold hover:bg-deep"
      >
        Parcourir le menu
      </Link>
    </div>
  );
}
