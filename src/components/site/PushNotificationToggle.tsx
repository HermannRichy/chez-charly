"use client";

import { useEffect, useState, useTransition } from "react";
import { IconBellRinging, IconBellOff } from "@tabler/icons-react";
import {
  isPushSupported,
  getExistingPushSubscription,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/lib/push-client";

export function PushNotificationToggle() {
  const [subscribed, setSubscribed] = useState(false);
  const [ready, setReady] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!isPushSupported()) return;
    getExistingPushSubscription()
      .then((sub) => setSubscribed(!!sub))
      .finally(() => setReady(true));
  }, []);

  if (!isPushSupported()) return null;

  function enable() {
    startTransition(async () => {
      const ok = await subscribeToPush();
      setSubscribed(ok);
    });
  }

  function disable() {
    startTransition(async () => {
      await unsubscribeFromPush();
      setSubscribed(false);
    });
  }

  return (
    <button
      type="button"
      disabled={!ready || pending}
      onClick={subscribed ? disable : enable}
      className="w-full flex items-center justify-center gap-2.5 border-[1.5px] border-border-mid-3 bg-transparent text-deep min-h-14 rounded-full text-[15px] font-extrabold hover:border-deep disabled:opacity-60"
    >
      {subscribed ? <IconBellOff size={18} /> : <IconBellRinging size={18} />}
      {subscribed ? "Désactiver les notifications" : "Activer les notifications de commande"}
    </button>
  );
}
