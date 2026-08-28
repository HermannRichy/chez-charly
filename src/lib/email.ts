import { Resend } from "resend";
import { fmt } from "@/lib/format";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL!;
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/** Palette du design system (globals.css) - dupliquée ici car les emails
 * n'ont pas accès à Tailwind ni aux variables CSS. */
const COLOR = {
  orange: "#FB6117",
  deep: "#B71D29",
  ink: "#24100C",
  cream: "#FFF4EC",
  creamText: "#4A2318",
  border: "#F2DDD0",
  muted: "#8A6154",
};

/**
 * Coquille commune à tous les emails : logo, carte blanche arrondie, pied de
 * page - reprend l'identité visuelle du site (cream + accents deep/orange)
 * plutôt que de laisser chaque template réinventer sa mise en page.
 */
function emailLayout(bodyHtml: string): string {
  return `
    <div style="background:${COLOR.cream};padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:480px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:20px;">
          <img src="${SITE_URL}/logo-charly.png" alt="Chez Charly" width="56" height="56" style="display:inline-block;" />
        </div>
        <div style="background:#ffffff;border-radius:22px;border:1px solid ${COLOR.border};padding:28px 26px;">
          ${bodyHtml}
        </div>
        <div style="text-align:center;padding:20px 12px 0;font-size:12px;color:${COLOR.muted};">
          Chez Charly · Abomey-Calavi, Womey<br/>
          <a href="${SITE_URL}" style="color:${COLOR.deep};text-decoration:none;">chezcharly.site</a>
        </div>
      </div>
    </div>
  `;
}

function ctaButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;margin-top:16px;background:${COLOR.orange};color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold;font-size:14px;">${label}</a>`;
}

function heading(text: string): string {
  return `<h1 style="color:${COLOR.deep};font-size:20px;margin:0 0 12px;">${text}</h1>`;
}

function paragraph(text: string): string {
  return `<p style="color:${COLOR.creamText};font-size:14.5px;line-height:1.5;margin:0 0 12px;">${text}</p>`;
}

async function send(to: string, subject: string, bodyHtml: string) {
  try {
    await resend.emails.send({ from: FROM, to, subject, html: emailLayout(bodyHtml) });
  } catch {
    // Un email raté ne doit jamais faire échouer l'action métier qui l'a
    // déclenché (commande, inscription... déjà enregistrées en base).
  }
}

// ─── Client ────────────────────────────────────────────────────────────────

export async function sendOrderConfirmationEmail(input: {
  to: string;
  customerName: string;
  orderNumber: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  deliveryFee: number;
  paymentLabel: string;
}) {
  const rows = input.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;color:${COLOR.ink};font-size:14px;">${i.qty}× ${i.name}</td><td style="padding:6px 0;text-align:right;color:${COLOR.ink};font-size:14px;">${fmt(i.price * i.qty)}</td></tr>`,
    )
    .join("");

  const deliveryLabel = input.deliveryFee === 0 ? "Gratuite" : fmt(input.deliveryFee);
  const total = input.subtotal + input.deliveryFee;

  const body = `
    ${heading(`Commande ${input.orderNumber} confirmée`)}
    ${paragraph(`Bonjour ${input.customerName}, on a bien reçu votre commande - merci !`)}
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      ${rows}
      <tr><td style="padding-top:10px;color:${COLOR.creamText};font-size:14px;">Sous-total</td>
          <td style="padding-top:10px;text-align:right;color:${COLOR.creamText};font-size:14px;">${fmt(input.subtotal)}</td></tr>
      <tr><td style="color:${COLOR.creamText};font-size:14px;">Livraison</td>
          <td style="text-align:right;color:${COLOR.creamText};font-size:14px;">${deliveryLabel}</td></tr>
      <tr><td style="padding-top:10px;border-top:1px solid ${COLOR.border};font-weight:bold;color:${COLOR.ink};">Total</td>
          <td style="padding-top:10px;border-top:1px solid ${COLOR.border};text-align:right;font-weight:bold;color:${COLOR.deep};">${fmt(total)}</td></tr>
    </table>
    ${paragraph(`Paiement : ${input.paymentLabel}`)}
    ${ctaButton(`${SITE_URL}/suivi/${input.orderNumber}`, "Suivre ma commande")}
  `;

  await send(input.to, `Commande ${input.orderNumber} confirmée - Chez Charly`, body);
}

export async function sendWelcomeEmail(input: { to: string; name: string }) {
  const body = `
    ${heading(`Bienvenue chez Chez Charly, ${input.name} !`)}
    ${paragraph(
      "Votre compte est prêt. Chaque commande vous rapporte des points fidélité, avec des paliers à débloquer et une roue de la chance à tourner à chaque niveau franchi.",
    )}
    <h2 style="color:${COLOR.ink};font-size:15px;margin:22px 0 6px;">Installez l'app pour ne rien manquer</h2>
    ${paragraph("<strong>Sur iPhone (Safari)</strong> : Partager → Sur l'écran d'accueil → Ajouter")}
    ${paragraph("<strong>Sur Android/Chrome</strong> : menu ⋮ du navigateur → « Installer l'application » (ou l'icône d'installation dans la barre d'adresse)")}
    ${ctaButton(`${SITE_URL}/menu`, "Découvrir le menu")}
  `;

  await send(input.to, `Bienvenue chez Chez Charly, ${input.name} !`, body);
}

export async function sendPasswordResetEmail(input: { to: string; name: string; resetUrl: string }) {
  const body = `
    ${heading("Réinitialiser votre mot de passe")}
    ${paragraph(`Bonjour ${input.name}, une demande de réinitialisation de mot de passe a été faite pour ce compte.`)}
    ${paragraph("Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email - rien ne change.")}
    ${ctaButton(input.resetUrl, "Choisir un nouveau mot de passe")}
    ${paragraph('<span style="font-size:12.5px;color:' + COLOR.muted + ';">Ce lien expire dans 1 heure.</span>')}
  `;

  await send(input.to, "Réinitialisation de votre mot de passe - Chez Charly", body);
}

export async function sendPaymentVerifiedEmail(input: { to: string; name: string; orderNumber: string }) {
  const body = `
    ${heading(`Paiement vérifié - ${input.orderNumber}`)}
    ${paragraph(`Bonjour ${input.name}, votre paiement a été vérifié - votre commande est confirmée et part en préparation.`)}
    ${ctaButton(`${SITE_URL}/suivi/${input.orderNumber}`, "Suivre ma commande")}
  `;

  await send(input.to, `Paiement vérifié - Commande ${input.orderNumber}`, body);
}

export async function sendTierReachedEmail(input: {
  to: string;
  name: string;
  tierName: string;
  reward: string;
}) {
  const body = `
    ${heading("Palier de fidélité atteint !")}
    ${paragraph(`Bonjour ${input.name}, vous avez débloqué le palier « ${input.tierName} » : ${input.reward}.`)}
    ${paragraph("Un tour de roue supplémentaire vous attend sur votre page fidélité.")}
    ${ctaButton(`${SITE_URL}/fidelite`, "Voir mes points")}
  `;

  await send(input.to, `Palier « ${input.tierName} » débloqué - Chez Charly`, body);
}

export async function sendWheelPrizeEmail(input: { to: string; name: string; prizeLabel: string }) {
  const body = `
    ${heading("Vous avez gagné à la roue !")}
    ${paragraph(`Bonjour ${input.name}, votre tour de roue vient de vous faire gagner : <strong>${input.prizeLabel}</strong>.`)}
    ${paragraph("Passez au restaurant pour le récupérer, ou mentionnez-le à votre prochaine commande.")}
    ${ctaButton(`${SITE_URL}/fidelite`, "Voir mes gains")}
  `;

  await send(input.to, `Vous avez gagné : ${input.prizeLabel} - Chez Charly`, body);
}

// ─── Admin (staff) ────────────────────────────────────────────────────────

// Boîte partagée du resto plutôt que l'email personnel de chaque compte
// STAFF - un seul destinataire à surveiller, pas un par compte.
async function sendToStaff(subject: string, bodyHtml: string) {
  await send(FROM, subject, bodyHtml);
}

export async function sendNewOrderStaffEmail(input: {
  orderNumber: string;
  customerName: string;
  total: number;
  orderId: string;
}) {
  const body = `
    ${heading("Nouvelle commande")}
    ${paragraph(`${input.customerName} vient de passer la commande ${input.orderNumber} pour ${fmt(input.total)}.`)}
    ${ctaButton(`${SITE_URL}/admin/commandes/${input.orderId}`, "Voir la commande")}
  `;

  await sendToStaff(`Nouvelle commande ${input.orderNumber}`, body);
}

export async function sendTierReachedStaffEmail(input: {
  customerName: string;
  tierName: string;
  reward: string;
  orderId: string;
}) {
  const body = `
    ${heading("Lot de fidélité à préparer")}
    ${paragraph(`${input.customerName} a débloqué le palier « ${input.tierName} » : ${input.reward}.`)}
    ${ctaButton(`${SITE_URL}/admin/commandes/${input.orderId}`, "Voir la commande")}
  `;

  await sendToStaff(`Lot à préparer - ${input.customerName}`, body);
}

export async function sendWheelPrizeStaffEmail(input: { customerName: string; prizeLabel: string }) {
  const body = `
    ${heading("Lot de roue à préparer")}
    ${paragraph(`${input.customerName} vient de gagner « ${input.prizeLabel} » à la roue de la chance.`)}
    ${ctaButton(`${SITE_URL}/admin/utilisateurs`, "Voir les utilisateurs")}
  `;

  await sendToStaff(`Lot de roue à préparer - ${input.customerName}`, body);
}

export async function sendNewAccountStaffEmail(input: { name: string; email: string }) {
  const body = `
    ${heading("Nouveau compte créé")}
    ${paragraph(`${input.name} (${input.email}) vient de créer un compte.`)}
    ${ctaButton(`${SITE_URL}/admin/utilisateurs`, "Voir les utilisateurs")}
  `;

  await sendToStaff("Nouveau compte créé", body);
}
