/**
 * Baden-Wuerttemberg-Modell (LGrStG BW)
 *
 * Legal basis: Landesgrundsteuergesetz Baden-Wuerttemberg (LGrStG BW)
 *
 * Formula:
 *   Grundsteuerwert = Bodenrichtwert * Grundstuecksflaeche
 *   Steuermessbetrag = Grundsteuerwert * Steuermesszahl (1.3 Promille)
 *   Jahresbetrag = Steuermessbetrag * Hebesatz
 *
 * Key characteristic: Only land value, NO building value (unique in Germany).
 * Steuermesszahl: 1.3 Promille (0.0013) - uniform for all property types.
 */

import type { BerechnungsErgebnis } from "./types";

export interface BawuemodellEingabe {
  /** Bodenrichtwert in Euro/m2 (Stichtag 01.01.2022) */
  bodenrichtwert: number;
  /** Grundstuecksflaeche in m2 */
  grundstuecksflaeche: number;
  /** Hebesatz der Gemeinde in Prozent */
  hebesatz: number;
}

/** § 30 LGrStG BW: einheitliche Steuermesszahl 1,3 Promille */
const STEUERMESSZAHL_BAWUE = 0.0013;

export function berechneBawuemodell(eingabe: BawuemodellEingabe): BerechnungsErgebnis {
  const rechenschritte = [];

  // Step 1: Grundsteuerwert (nur Bodenwert - kein Gebaeudewert in BaWue)
  const grundsteuerwert = eingabe.bodenrichtwert * eingabe.grundstuecksflaeche;
  rechenschritte.push({
    bezeichnung: "Grundsteuerwert (§ 38 LGrStG BW)",
    formel: "Bodenrichtwert × Grundstücksfläche",
    werte: {
      "Bodenrichtwert": `${eingabe.bodenrichtwert} €/m²`,
      "Grundstücksfläche": `${eingabe.grundstuecksflaeche} m²`,
    },
    ergebnis: parseFloat(grundsteuerwert.toFixed(2)),
    einheit: "€",
  });

  rechenschritte.push({
    bezeichnung: "Hinweis: Kein Gebäudewert",
    formel: "Das Baden-Württemberg-Modell berücksichtigt ausschließlich den Bodenwert.",
    werte: {},
    ergebnis: 0,
    einheit: "",
  });

  // Step 2: Steuermesszahl
  rechenschritte.push({
    bezeichnung: "Steuermesszahl (§ 30 LGrStG BW)",
    formel: "Einheitlich 1,3 Promille für alle Grundstücksarten",
    werte: { "Steuermesszahl": "1,3 ‰ (0,0013)" },
    ergebnis: STEUERMESSZAHL_BAWUE,
    einheit: "‰",
  });

  // Step 3: Steuermessbetrag
  const steuermessbetrag = grundsteuerwert * STEUERMESSZAHL_BAWUE;
  rechenschritte.push({
    bezeichnung: "Steuermessbetrag",
    formel: "Grundsteuerwert × Steuermesszahl",
    werte: {
      "Grundsteuerwert": `${grundsteuerwert.toFixed(2)} €`,
      "Steuermesszahl": "0,0013",
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
