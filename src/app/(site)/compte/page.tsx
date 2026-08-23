import Link from "next/link";
import { requireClient } from "@/lib/session";
import { Avatar } from "@/components/site/Avatar";
import { LogoutButton } from "@/components/site/LogoutButton";
import { PushNotificationToggle } from "@/components/site/PushNotificationToggle";

export default async function ComptePage() {
  const user = await requireClient("/compte");

  return (
    <div>
      <h1 className="font-grifter text-[clamp(38px,5vw,64px)] leading-[.92] text-ink">Mon compte</h1>

      <div className="bg-white border border-border-light rounded-[26px] p-6.5 mt-7.5 flex items-center gap-4.5">
        <Avatar name={user.name} size="lg" />
        <div className="min-w-0">
          <div className="text-lg font-extrabold text-ink truncate">{user.name}</div>
          <div className="text-sm text-text-tertiary truncate">{user.email}</div>
          {user.phone && <div className="text-sm text-text-tertiary">{user.phone}</div>}
        </div>
      </div>

      {user.role === "STAFF" && (
        <Link
          href="/admin"
          className="mt-4 flex items-center justify-center border-0 bg-orange text-white min-h-14 rounded-full text-[15px] font-extrabold hover:bg-deep"
        >
          Accéder au dashboard
        </Link>
      )}

      <div className="mt-7.5 max-w-90 grid gap-3">
        <PushNotificationToggle />
        <LogoutButton />
      </div>
    </div>
  );
}
