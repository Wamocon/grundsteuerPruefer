/**
 * Hamburg-Modell (HmbGrStG)
 *
 * Legal basis: Hamburgisches Grundsteuergesetz (HmbGrStG)
 *
 * Formula:
 *   Aequivalenzbetrag = Wohnflaeche * Aequivalenzzahl
 *   Steuermessbetrag  = Aequivalenzbetrag * Lagefaktor * Steuermesszahl
 *   Jahresbetrag      = Steuermessbetrag * Hebesatz
 *
 * Aequivalenzzahl: 0.70 Euro/m2 (§ 3 Abs. 1 HmbGrStG)
 * Lagefaktoren:
 *   - gute Wohnlage:    1.25
 *   - normale Wohnlage: 1.00
 * Steuermesszahl: 100% = effectively 1.0 (the Aequivalenzbetrag * Lagefaktor
 *                 is directly the Steuermessbetrag in Hamburg's model)
 * Hebesatz Hamburg 2025: 975%
 */

import type { BerechnungsErgebnis } from "./types";

export type WohnlageHamburg = "normal" | "gut";

export interface HamburgmodellEingabe {
  /** Wohnflaeche in m2 */
  wohnflaeche: number;
  /** Wohnlage gemaess Mietspiegel Hamburg */
  wohnlage: WohnlageHamburg;
  /** Hebesatz der Stadt Hamburg in Prozent (2025: 975%) */
  hebesatz: number;
}

/** § 3 Abs. 1 HmbGrStG */
const AEQUIVALENZZAHL = 0.70; // Euro/m2

/** § 3 Abs. 2 HmbGrStG: Lagefaktoren */
const LAGEFAKTOREN: Record<WohnlageHamburg, number> = {
  normal: 1.00,
  gut: 1.25,
};

export function berechneHamburgmodell(eingabe: HamburgmodellEingabe): BerechnungsErgebnis {
  const rechenschritte = [];

  // Step 1: Aequivalenzbetrag
  const aequivalenzbetrag = eingabe.wohnflaeche * AEQUIVALENZZAHL;
  rechenschritte.push({
    bezeichnung: "Äquivalenzbetrag (§ 3 Abs. 1 HmbGrStG)",
    formel: "Wohnfläche × Äquivalenzzahl",
    werte: {
      "Wohnfläche": `${eingabe.wohnflaeche} m²`,
      "Äquivalenzzahl": `${AEQUIVALENZZAHL} €/m²`,
    },
    ergebnis: parseFloat(aequivalenzbetrag.toFixed(2)),
    einheit: "€",
  });

  // Step 2: Lagefaktor
  const lagefaktor = LAGEFAKTOREN[eingabe.wohnlage];
  rechenschritte.push({
    bezeichnung: "Lagefaktor (§ 3 Abs. 2 HmbGrStG)",
    formel: "Gesetzlich festgelegt nach Wohnlage",
    werte: {
      "Wohnlage": eingabe.wohnlage === "gut" ? "Gute Wohnlage" : "Normale Wohnlage",
      "Lagefaktor": lagefaktor.toString(),
    },
    ergebnis: lagefaktor,
    einheit: "",
  });

  // Step 3: Steuermessbetrag
  const steuermessbetrag = aequivalenzbetrag * lagefaktor;
  rechenschritte.push({
    bezeichnung: "Steuermessbetrag",
    formel: "Äquivalenzbetrag × Lagefaktor",
    werte: {
      "Äquivalenzbetrag": `${aequivalenzbetrag.toFixed(2)} €`,
      "Lagefaktor": lagefaktor.toString(),
    },
    ergebnis: parseFloat(steuermessbetrag.toFixed(2)),
    einheit: "€",
  });

  // Step 4: Jahresbetrag
  const jahresBetrag = steuermessbetrag * (eingabe.hebesatz / 100);
  rechenschritte.push({
    bezeichnung: "Grundsteuer Jahresbetrag",
    formel: "Steuermessbetrag × Hebesatz",
    werte: {
      "Steuermessbetrag": `${steuermessbetrag.toFixed(2)} €`,
      "Hebesatz": `${eingabe.hebesatz} %`,
    },
    ergebnis: parseFloat(jahresBetrag.toFixed(2)),
    einheit: "€/Jahr",
  });

  return {
    jahresBetrag: parseFloat(jahresBetrag.toFixed(2)),
    rechenschritte,
  };
}
