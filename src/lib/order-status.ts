import type { OrderStatus } from "@prisma/client";

/** Ordre de la timeline client (README : Commande reçue → En préparation → En route → Livré). */
export const STATUS_FLOW: OrderStatus[] = ["RECEIVED", "PREPARING", "ON_THE_WAY", "DELIVERED"];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  RECEIVED: "Reçue",
  PREPARING: "En préparation",
  ON_THE_WAY: "En route",
  DELIVERED: "Livrée",
};

export const STATUS_TRACK_LABEL: Record<OrderStatus, string> = {
  RECEIVED: "Commande reçue",
  PREPARING: "En préparation",
  ON_THE_WAY: "En route",
  DELIVERED: "Livré",
};

export function statusIndex(status: OrderStatus): number {
  return STATUS_FLOW.indexOf(status);
}

export function nextStatus(status: OrderStatus): OrderStatus {
  const i = Math.min(STATUS_FLOW.length - 1, statusIndex(status) + 1);
  return STATUS_FLOW[i];
}

export function prevStatus(status: OrderStatus): OrderStatus {
  const i = Math.max(0, statusIndex(status) - 1);
  return STATUS_FLOW[i];
}
