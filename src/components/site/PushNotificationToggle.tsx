"use client";

import { useEffect, useState, useTransition } from "react";
import { IconBellRinging, IconBellOff } from "@tabler/icons-react";
import { subscribePushAction, unsubscribePushAction } from "@/app/(site)/push-actions";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

function isSupported() {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;
}

export function PushNotificationToggle() {
  const [subscribed, setSubscribed] = useState(false);
  const [ready, setReady] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!isSupported()) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then(async (registration) => {
        const sub = await registration.pushManager.getSubscription();
        setSubscribed(!!sub);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  if (!isSupported()) return null;

  function enable() {
    startTransition(async () => {
      const registration = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });
      const json = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
      await subscribePushAction({ endpoint: json.endpoint, keys: json.keys });
      setSubscribed(true);
    });
  }

  function disable() {
    startTransition(async () => {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        await unsubscribePushAction(sub.endpoint);
        await sub.unsubscribe();
      }
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
