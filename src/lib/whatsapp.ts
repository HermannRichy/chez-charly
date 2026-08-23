import type { OrderStatus } from "@prisma/client";

/**
 * Message WhatsApp pré-rempli par statut de commande, envoyé en un clic
 * depuis le dashboard admin (lien wa.me, pas d'API WhatsApp Business).
 */
const STATUS_MESSAGES: Record<OrderStatus, (name: string, orderNumber: string) => string> = {
  RECEIVED: (name, id) =>
    `Bonjour ${name}, votre commande ${id} chez Chez Charly a bien été reçue. On s'y met tout de suite.`,
  PREPARING: (name, id) => `Bonjour ${name}, votre commande ${id} est en cours de préparation chez Chez Charly.`,
  ON_THE_WAY: (name, id) => `Bonjour ${name}, votre commande ${id} est en route.`,
  DELIVERED: (name, id) =>
    `Bonjour ${name}, votre commande ${id} a été livrée. Merci pour votre commande chez Chez Charly !`,
};

/** Numéro béninois -> format international attendu par wa.me (chiffres seuls, préfixé 229). */
export function toWhatsAppNumber(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  return digits.startsWith("229") ? digits : `229${digits}`;
}

export function buildStatusWhatsAppLink(input: {
  phone: string;
  name: string;
  orderNumber: string;
  status: OrderStatus;
}): string {
  const message = STATUS_MESSAGES[input.status](input.name, input.orderNumber);
  const number = toWhatsAppNumber(input.phone);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildWelcomeWhatsAppLink(input: { phone: string; name: string }): string {
  const message = `Bonjour ${input.name}, bienvenue chez Chez Charly ! Ravis de vous compter parmi nous - à très vite pour votre prochaine commande.`;
  const number = toWhatsAppNumber(input.phone);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
