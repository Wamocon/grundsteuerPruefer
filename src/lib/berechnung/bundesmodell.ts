/**
 * Bundesmodell (11 Bundeslaender)
 *
 * Legal basis:
 *   - §§ 219-228 BewG: Grundsteuerwert (Bodenwert + Gebaeudewert)
 *   - § 13 GrStG: Steuermesszahl
 *   - § 14 GrStG: Steuermessbetrag
 *   - § 25 GrStG: Hebesatz -> Jahresbetrag
 *
 * Steuermesszahlen (§ 15 GrStG neue Fassung):
 *   - Wohnen:         0.31 Promille (0.00031)
 *   - Gewerbe:        0.34 Promille (0.00034)
 *   - Gemischt/sonst: 0.34 Promille (0.00034)
 */

import type { BerechnungsErgebnis } from "./types";

export type NutzungsartBundesmodell = "wohnen" | "gewerbe" | "gemischt";

export interface BundesmodellEingabe {
  /** Bodenrichtwert in Euro/m2 (Stichtag 01.01.2022) */
  bodenrichtwert: number;
  /** Grundstuecksflaeche in m2 */
  grundstuecksflaeche: number;
  /** Wohnflaeche in m2 (bei Wohnnutzung) */
  wohnflaeche: number;
  /** Nutzungsart */
  nutzungsart: NutzungsartBundesmodell;
  /** Baujahr des Gebaeudes */
  baujahr: number;
  /** Hebesatz der Gemeinde in Prozent (z.B. 430 fuer 430%) */
  hebesatz: number;
}

/** Steuermesszahlen nach § 15 GrStG (n.F.) in Dezimalform */
const STEUERMESSZAHLEN: Record<NutzungsartBundesmodell, number> = {
  wohnen: 0.00031,
  gewerbe: 0.00034,
  gemischt: 0.00034,
};

/**
 * Simplified Ertragswert for residential: monthly rent * 12 * 12.5 cap rate
 * For the Pruefer we use the published simplified formula:
 *   Gebaeudewert = Wohnflaeche * monatliche Nettokaltmiete * 12 * Liegenschaftszinssatz-Faktor
 * But the legally defined "Grundsteuerwert" for the Bundesmodell is:
 *   Bodenwert + Gebaeudewert (Sachwert or Ertragswert depending on type)
 *
 * For V1 we implement the SACHWERT (cost value) approach which applies to
 * single-family homes and condominiums (§ 214 BewG):
 *   Gebaeudewert = Wohnflaeche * Normalherstellungskosten * Alterswertminderung
 *   Grundsteuerwert = Bodenwert + Gebaeudewert
 *
 * Normalherstellungskosten (NHK 2010, Stand 2022 = 2.047 Euro/m2 Bundesdurchschnitt fuer EFH)
 */
const NHK_PRO_QM = 2047; // Euro/m2 fuer EFH/Wohnen (approximation fuer V1)
const NUTZUNGSDAUER_WOHNEN = 80; // years

export function berechneAbschreibung(baujahr: number, bewertungsjahr = 2022): number {
  const alter = bewertungsjahr - baujahr;
  const abschreibungProJahr = 1 / NUTZUNGSDAUER_WOHNEN;
  const gesamtAbschreibung = Math.min(alter * abschreibungProJahr, 0.7); // max 70%
  return 1 - gesamtAbschreibung;
}

export function berechneBundesmodell(eingabe: BundesmodellEingabe): BerechnungsErgebnis {
  const rechenschritte = [];

  // Step 1: Bodenwert
  const bodenwert = eingabe.bodenrichtwert * eingabe.grundstuecksflaeche;
  rechenschritte.push({
    bezeichnung: "Bodenwert",
    formel: "Bodenrichtwert × Grundstücksfläche",
    werte: {
      "Bodenrichtwert": `${eingabe.bodenrichtwert} €/m²`,
      "Grundstücksfläche": `${eingabe.grundstuecksflaeche} m²`,
    },
    ergebnis: bodenwert,
    einheit: "€",
  });

  // Step 2: Gebaeudewert (Sachwert)
  const alterswertminderung = berechneAbschreibung(eingabe.baujahr);
  const gebaeudewert = eingabe.wohnflaeche * NHK_PRO_QM * alterswertminderung;
  rechenschritte.push({
    bezeichnung: "Gebäudewert (Sachwert)",
    formel: "Wohnfläche × NHK × Alterswertminderung",
    werte: {
      "Wohnfläche": `${eingabe.wohnflaeche} m²`,
      "NHK 2010": `${NHK_PRO_QM} €/m²`,
      "Alterswertminderung": alterswertminderung.toFixed(4),
    },
    ergebnis: Math.round(gebaeudewert),
    einheit: "€",
  });

  // Step 3: Grundsteuerwert (§ 219 BewG)
  const grundsteuerwert = bodenwert + gebaeudewert;
  rechenschritte.push({
    bezeichnung: "Grundsteuerwert (§ 219 BewG)",
    formel: "Bodenwert + Gebäudewert",
    werte: {
      "Bodenwert": `${bodenwert.toFixed(2)} €`,
      "Gebäudewert": `${gebaeudewert.toFixed(2)} €`,
    },
    ergebnis: Math.round(grundsteuerwert),
    einheit: "€",
  });

  // Step 4: Steuermesszahl (§ 15 GrStG)
  const steuermesszahl = STEUERMESSZAHLEN[eingabe.nutzungsart];
  rechenschritte.push({
    bezeichnung: "Steuermesszahl (§ 15 GrStG)",
    formel: "Gesetzlich festgelegt nach Nutzungsart",
    werte: { "Nutzungsart": eingabe.nutzungsart },
    ergebnis: steuermesszahl,
    einheit: "‰ (Promille)",
  });

  // Step 5: Steuermessbetrag (§ 14 GrStG)
  const steuermessbetrag = grundsteuerwert * steuermesszahl;
  rechenschritte.push({
    bezeichnung: "Steuermessbetrag (§ 14 GrStG)",
    formel: "Grundsteuerwert × Steuermesszahl",
    werte: {
      "Grundsteuerwert": `${Math.round(grundsteuerwert)} €`,
      "Steuermesszahl": `${(steuermesszahl * 1000).toFixed(2)} ‰`,
    },
    ergebnis: parseFloat(steuermessbetrag.toFixed(2)),
    einheit: "€",
  });

  // Step 6: Jahresbetrag (§ 25 GrStG)
  const jahresBetrag = steuermessbetrag * (eingabe.hebesatz / 100);
  rechenschritte.push({
    bezeichnung: "Grundsteuer Jahresbetrag (§ 25 GrStG)",
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
