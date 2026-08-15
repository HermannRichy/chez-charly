/**
 * Formatage F CFA du design : séparateur de milliers par espace insécable +
 * suffixe "F" (ex. "1 200 F"). Reprend exactement `fmt()` du prototype —
 * volontairement pas `Intl.NumberFormat(..., { currency: "XOF" })`, qui
 * produit "1 200 F CFA" et casse la maquette.
 */
export function fmt(n: number): string {
  return (
    (n || 0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " F"
  );
}
