import { requireClient } from "@/lib/session";
import { AccountSidebar } from "@/components/site/AccountSidebar";

export default async function CompteLayout({ children }: { children: React.ReactNode }) {
  const user = await requireClient("/compte");

  return (
    <div className="max-w-310 mx-auto px-4 pt-[clamp(20px,3vw,32px)] pb-[clamp(56px,8vw,92px)] flex flex-col md:flex-row gap-6 md:gap-8">
      <AccountSidebar name={user.name} email={user.email} isStaff={user.role === "STAFF"} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
