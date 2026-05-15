/**
 * Shared types for all Grundsteuer calculation models.
 */

export interface BerechnungsErgebnis {
  /** Calculated annual Grundsteuer amount in Euro */
  jahresBetrag: number;
  /** Step-by-step calculation trace */
  rechenschritte: Rechenschritt[];
}

export interface Rechenschritt {
  bezeichnung: string;
  formel: string;
  werte: Record<string, number | string>;
  ergebnis: number;
  einheit: string;
}

export interface AbweichungsErgebnis {
  bescheidBetrag: number;
  berechneterBetrag: number;
  abweichungEuro: number;
  abweichungProzent: number;
  stufe: "keine" | "gering" | "erheblich";
}

/** Threshold in Euro for 'erheblich' deviation (requirement P-05) */
export const ABWEICHUNG_SCHWELLE_ERHEBLICH = 50;
