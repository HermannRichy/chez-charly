/**
 * Formatage F CFA du design : separateur de milliers par espace insecable
 * ("\u00A0", pas un espace normal - sinon "1 200" peut se couper en fin de
 * ligne) + suffixe "F" (ex. "1 200 F"). Reprend le calcul de `fmt()` du
 * prototype - volontairement pas `Intl.NumberFormat(..., { currency: "XOF" })`,
 * qui produit "1 200 F CFA" et casse la maquette.
 */
const NBSP = "\u00A0";

/** Nombre seul, milliers separes par NBSP - sans suffixe (ex. "3 500 / 5 000 F"). */
export function fmtNumber(n: number): string {
  return (n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

export function fmt(n: number): string {
  return fmtNumber(n) + NBSP + "F";
}
