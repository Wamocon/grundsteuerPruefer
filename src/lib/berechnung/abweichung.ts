/**
 * Abweichungsermittlung (Anforderung P-05)
 *
 * Compares the Bescheid amount with the calculated amount
 * and classifies the deviation by threshold.
 */

import { ABWEICHUNG_SCHWELLE_ERHEBLICH } from "./types";
import type { AbweichungsErgebnis } from "./types";

export function berechneAbweichung(
  bescheidBetrag: number,
  berechneterBetrag: number
): AbweichungsErgebnis {
  const abweichungEuro = parseFloat(
    (bescheidBetrag - berechneterBetrag).toFixed(2)
  );
  const abweichungProzent =
    berechneterBetrag !== 0
      ? parseFloat(((abweichungEuro / berechneterBetrag) * 100).toFixed(2))
      : 0;

  const absoluteAbweichung = Math.abs(abweichungEuro);

  let stufe: AbweichungsErgebnis["stufe"];
  if (absoluteAbweichung === 0) {
    stufe = "keine";
  } else if (absoluteAbweichung < ABWEICHUNG_SCHWELLE_ERHEBLICH) {
    stufe = "gering";
  } else {
    stufe = "erheblich";
  }

  return {
    bescheidBetrag,
    berechneterBetrag,
    abweichungEuro,
    abweichungProzent,
    stufe,
  };
}
