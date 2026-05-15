/**
 * Bayern-Modell (BayGrStG)
 *
 * Legal basis: Bayerisches Grundsteuergesetz (BayGrStG)
 *
 * Formula:
 *   Grundsteuerwert = (Grundstuecksflaeche * Aequivalenzzahl_Grund)
 *                   + (Gebaeudeflaeche    * Aequivalenzzahl_Gebaeude)
 *   Steuermessbetrag = Grundsteuerwert * Steuermesszahl
 *   Jahresbetrag     = Steuermessbetrag * Hebesatz
 *
 * Aequivalenzzahlen (Art. 3 BayGrStG):
 *   Grundstueck:      0.04 Euro/m2
 *   Gebaeude (Wohnen): 0.50 Euro/m2
 *   Nicht-Wohnen:      0.50 Euro/m2 (same in current BayGrStG)
 *
 * Steuermesszahl (Art. 4 BayGrStG): 100% = 1.0 (conceptually - see note)
 * Note: In the Bavaria model the "Steuermesszahl" is 1.0 (100%)
 * meaning the Aequivalenzbetrag IS the Steuermessbetrag directly.
 * The Hebesatz is then applied by the Gemeinde.
 */

import type { BerechnungsErgebnis } from "./types";

export interface BayernmodellEingabe {
  /** Grundstuecksflaeche in m2 */
  grundstuecksflaeche: number;
  /** Wohn-/Nutzflaeche des Gebaeudes in m2 */
  gebaeudeflaeche: number;
  /** Hebesatz der Gemeinde in Prozent */
  hebesatz: number;
}

/** Art. 3 Abs. 1 BayGrStG */
const AEQUIVALENZZAHL_GRUNDSTUECK = 0.04; // Euro/m2
/** Art. 3 Abs. 2 BayGrStG */
const AEQUIVALENZZAHL_GEBAEUDE = 0.50; // Euro/m2

export function berechneBayernmodell(eingabe: BayernmodellEingabe): BerechnungsErgebnis {
  const rechenschritte = [];

  // Step 1: Aequivalenzbetrag Grundstueck
  const aequivalenzGrundstueck = eingabe.grundstuecksflaeche * AEQUIVALENZZAHL_GRUNDSTUECK;
  rechenschritte.push({
    bezeichnung: "Äquivalenzbetrag Grundstück (Art. 3 Abs. 1 BayGrStG)",
    formel: "Grundstücksfläche × Äquivalenzzahl Grundstück",
    werte: {
      "Grundstücksfläche": `${eingabe.grundstuecksflaeche} m²`,
      "Äquivalenzzahl": `${AEQUIVALENZZAHL_GRUNDSTUECK} €/m²`,
    },
    ergebnis: parseFloat(aequivalenzGrundstueck.toFixed(2)),
    einheit: "€",
  });

  // Step 2: Aequivalenzbetrag Gebaeude
  const aequivalenzGebaeude = eingabe.gebaeudeflaeche * AEQUIVALENZZAHL_GEBAEUDE;
  rechenschritte.push({
    bezeichnung: "Äquivalenzbetrag Gebäude (Art. 3 Abs. 2 BayGrStG)",
    formel: "Gebäudefläche × Äquivalenzzahl Gebäude",
    werte: {
      "Gebäudefläche": `${eingabe.gebaeudeflaeche} m²`,
      "Äquivalenzzahl": `${AEQUIVALENZZAHL_GEBAEUDE} €/m²`,
    },
    ergebnis: parseFloat(aequivalenzGebaeude.toFixed(2)),
    einheit: "€",
  });

  // Step 3: Gesamter Aequivalenzbetrag (= Steuermessbetrag, da Messzahl = 1)
  const steuermessbetrag = aequivalenzGrundstueck + aequivalenzGebaeude;
  rechenschritte.push({
    bezeichnung: "Steuermessbetrag (Art. 4 BayGrStG)",
    formel: "Äquivalenzbetrag Grundstück + Äquivalenzbetrag Gebäude",
    werte: {
      "Äquivalenzbetrag Grundstück": `${aequivalenzGrundstueck.toFixed(2)} €`,
      "Äquivalenzbetrag Gebäude": `${aequivalenzGebaeude.toFixed(2)} €`,
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
