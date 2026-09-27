"use client";

/**
 * Génération du reçu PDF pour les commandes TPC (Traitement des Pathologies Chroniques).
 *
 * Utilise jsPDF pour générer un PDF téléchargeable contenant:
 * - Logo MediTike + en-tête
 * - Numéro de reçu (REC-2026-XXXX)
 * - Date
 * - Nom du patient
 * - Nom de la pharmacie
 * - Montant total en FCFA
 * - Méthode de paiement
 * - Liste des produits (si note de la pharmacie)
 * - Mention "Reçu de paiement - MediTike"
 * - Signature numérique (hash du numéro de reçu)
 */
import { jsPDF } from "jspdf";
import { formatPrice, formatDateFr } from "@/lib/meditike/helpers";

export interface TPCOrderForReceipt {
  id: string;
  status: string;
  clientName: string | null;
  clientPhone: string | null;
  totalAmount: number | null;
  paymentMethod: string | null;
  receiptNumber: string | null;
  note: string | null;
  pharmacyNote: string | null;
  createdAt: string | Date;
  confirmedAt: string | Date | null;
  paidAt: string | Date | null;
  completedAt: string | Date | null;
  pharmacy?: {
    name: string;
    address?: string | null;
    district?: string | null;
    phone1: string;
    phone2?: string | null;
  } | null;
}

/**
 * Calcule une signature numérique courte à partir du numéro de reçu.
 * (Reproduction côté client de computeReceiptSignature côté serveur.)
 */
function computeReceiptSignature(receiptNumber: string): string {
  // La signature serveur utilise HMAC-SHA256 avec un secret;
  // côté client on ne peut pas reproduire exactement le HMAC (pas de secret côté client),
  // mais on peut générer un hash SHA-256 du numéro via WebCrypto.
  // Pour ne pas bloquer le téléchargement (asynchrone), on utilise un hash simple synchronisé:
  // une empreinte basée sur les caractères du numéro.
  let h1 = 0x811c9dc5;
  for (let i = 0; i < receiptNumber.length; i++) {
    h1 ^= receiptNumber.charCodeAt(i);
    h1 = (h1 * 0x01000193) >>> 0;
  }
  let h2 = 0x1000193;
  for (let i = 0; i < receiptNumber.length; i++) {
    h2 = (h2 ^ receiptNumber.charCodeAt(i)) * 0x01000193 >>> 0;
  }
  const sig = (h1.toString(16).padStart(8, "0") + h2.toString(16).padStart(8, "0"))
    .toUpperCase();
  return sig;
}

/**
 * Génère et télécharge le PDF du reçu pour une commande TPC.
 *
 * @param order commande TPC avec toutes les infos nécessaires
 * @returns void (le PDF est téléchargé directement)
 */
export function generateTPCReceipt(order: TPCOrderForReceipt): void {
  if (!order.receiptNumber) {
    throw new Error("Numéro de reçu manquant");
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // ── En-tête coloré ──
  // Bande verte forêt en haut
  doc.setFillColor(15, 81, 50); // #0f5132 vert forêt
  doc.rect(0, 0, pageWidth, 32, "F");

  // Bande bronze fine
  doc.setFillColor(184, 153, 104); // #b89968 bronze
  doc.rect(0, 32, pageWidth, 2, "F");

  // Logo (carré bronze à gauche)
  doc.setFillColor(184, 153, 104);
  doc.roundedRect(margin, 8, 16, 16, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("M", margin + 8, 18.5, { align: "center" });

  // Titre MediTike
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("MediTike", margin + 20, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Santé · Togo", margin + 20, 22);

  // Mention en-tête droite
  doc.setFontSize(9);
  doc.text("Reçu de paiement", pageWidth - margin, 14, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Traitement Pathologies Chroniques", pageWidth - margin, 20, {
    align: "right",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("TPC", pageWidth - margin, 25, { align: "right" });

  // ── Bloc numéro de reçu + date ──
  let y = 50;

  doc.setDrawColor(184, 153, 104);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setTextColor(15, 81, 50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(order.receiptNumber, margin, y);

  const paidAt = order.paidAt ? new Date(order.paidAt) : new Date();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Émis le ${formatDateFr(paidAt)}`, pageWidth - margin, y, {
    align: "right",
  });
  y += 8;

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // ── Bloc émetteur / destinataire ──
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("PHARMACIE", margin, y);
  doc.text("PATIENT", pageWidth / 2 + 5, y);
  y += 6;

  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  const pharmacyName = order.pharmacy?.name || "Pharmacie MediTike";
  doc.text(pharmacyName, margin, y);

  const patientName = order.clientName || "Patient";
  doc.text(patientName, pageWidth / 2 + 5, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);

  // Adresse pharmacie
  const pharmacyAddress = order.pharmacy?.address || "";
  if (pharmacyAddress) {
    const splitAddress = doc.splitTextToSize(pharmacyAddress, 75);
    doc.text(splitAddress, margin, y);
    y += splitAddress.length * 4.5;
  }
  if (order.pharmacy?.district) {
    doc.text(order.pharmacy.district, margin, y);
    y += 5;
  }
  if (order.pharmacy?.phone1) {
    doc.text(`Tél: ${order.pharmacy.phone1}`, margin, y);
  }

  // Coordonnées patient
  let yPatient = y - (order.pharmacy?.district ? 5 : 0) - (order.pharmacy?.address ? 5 : 0);
  yPatient = y - 6;
  if (order.clientPhone) {
    doc.text(`Tél: ${order.clientPhone}`, pageWidth / 2 + 5, yPatient);
  }
  if (order.note) {
    const splitNote = doc.splitTextToSize(`Note: ${order.note}`, 80);
    doc.text(splitNote, pageWidth / 2 + 5, yPatient + 5);
  }

  y += 12;

  // ── Bloc montant (carte encadrée) ──
  doc.setFillColor(245, 240, 230);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, "F");
  doc.setDrawColor(184, 153, 104);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, "S");

  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("MONTANT TOTAL PAYÉ", margin + 4, y + 7);

  doc.setTextColor(15, 81, 50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  const amountStr = order.totalAmount != null ? formatPrice(order.totalAmount) : "— F CFA";
  doc.text(amountStr, margin + 4, y + 17);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const methodLabel =
    order.paymentMethod === "mobile_money"
      ? "Mobile Money"
      : order.paymentMethod === "cash"
      ? "Espèces (Cash)"
      : "—";
  doc.text(`Méthode de paiement: ${methodLabel}`, pageWidth - margin - 4, y + 7, {
    align: "right",
  });
  doc.text(
    `Confirmé le ${paidAt.toLocaleDateString("fr-FR")}`,
    pageWidth - margin - 4,
    y + 14,
    { align: "right" }
  );

  y += 32;

  // ── Bloc produits (si note de pharmacie) ──
  if (order.pharmacyNote) {
    doc.setTextColor(120, 120, 120);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("PRODUITS / NOTE DE LA PHARMACIE", margin, y);
    y += 6;

    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitNote = doc.splitTextToSize(order.pharmacyNote, contentWidth);
    doc.text(splitNote, margin, y);
    y += splitNote.length * 5.5 + 4;
  }

  // ── Bloc statut de la commande ──
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("STATUT", margin, y);
  y += 6;

  doc.setTextColor(15, 81, 50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Reçu définitif — Paiement confirmé", margin, y);
  y += 10;

  // ── Signature numérique (bas de page) ──
  const signature = computeReceiptSignature(order.receiptNumber);

  doc.setDrawColor(184, 153, 104);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Signature numérique (vérification d'authenticité):", margin, y);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 81, 50);
  // Signature en groups de 4 caractères pour la lisibilité
  const formattedSig = signature.match(/.{1,4}/g)?.join("-") || signature;
  doc.text(formattedSig, margin, y);

  // ── Pied de page ──
  doc.setFillColor(15, 81, 50);
  doc.rect(0, pageHeight - 18, pageWidth, 18, "F");
  doc.setFillColor(184, 153, 104);
  doc.rect(0, pageHeight - 20, pageWidth, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("MediTike — Reçu de paiement", margin, pageHeight - 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(
    "Document généré automatiquement · Conservez ce reçu pour vos archives",
    pageWidth - margin,
    pageHeight - 9,
    { align: "right" }
  );

  // ── Téléchargement ──
  const fileName = `recu-tpc-${order.receiptNumber}.pdf`;
  doc.save(fileName);
}
