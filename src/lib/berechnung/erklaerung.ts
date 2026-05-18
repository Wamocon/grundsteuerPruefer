/**
 * P-07: Plain-language explanation of the deviation.
 *
 * Generates a human-readable German sentence explaining WHY the
 * calculated amount differs from the assessment amount, based on
 * the key inputs and the deviation result.
 */

import type { AbweichungsErgebnis } from "./types";
import type { PruefassistentState } from "@/components/pruefassistent/types";
import { BUNDESLAENDER_MODELL_MAP } from "./modellauswahl";
import type { Bundesland } from "@/types/database";

export function generiereAbweichungsErklaerung(
  state: PruefassistentState,
  abweichung: AbweichungsErgebnis
): string {
  if (abweichung.stufe === "keine") {
    return (
      "Ihre Berechnung stimmt mit dem Bescheid überein. " +
      "Es wurde kein rechnerischer Fehler gefunden."
    );
  }

  const richtung =
    abweichung.abweichungEuro > 0
      ? "zu hoch festgesetzt"
      : "zu niedrig festgesetzt";
  const betragAbs = Math.abs(abweichung.abweichungEuro).toFixed(2);
  const bundesland = state.bundesland as Bundesland;
  const modell = bundesland ? BUNDESLAENDER_MODELL_MAP[bundesland] : null;

  let ursache = "";

  if (modell === "bundesmodell") {
    const wohnflaeche = parseFloat(state.wohnflaeche);
    const bodenrichtwert = parseFloat(state.bodenrichtwert);
    const grundstuecksflaeche = parseFloat(state.grundstuecksflaeche);
    const baujahr = parseInt(state.baujahr);

    if (!isNaN(wohnflaeche) && !isNaN(bodenrichtwert) && !isNaN(grundstuecksflaeche)) {
      ursache =
        `Grundlage der Berechnung sind eine Wohnfläche von ${wohnflaeche} m², ` +
        `eine Grundstücksfläche von ${grundstuecksflaeche} m², ` +
        `ein Bodenrichtwert von ${bodenrichtwert} €/m² (Stichtag 01.01.2022)` +
        (!isNaN(baujahr) ? ` und ein Baujahr von ${baujahr}` : "") +
        `. Weicht einer dieser Werte im Bescheid von Ihren tatsächlichen Angaben ab, ` +
        `erklärt das die Differenz.`;
    }
  } else if (modell === "bayernmodell") {
    const grundstuecksflaeche = parseFloat(state.bayernGrundstuecksflaeche);
    const gebaeudeflaeche = parseFloat(state.gebaeudeflaeche);
    if (!isNaN(grundstuecksflaeche) && !isNaN(gebaeudeflaeche)) {
      ursache =
        `Grundlage sind eine Grundstücksfläche von ${grundstuecksflaeche} m² ` +
        `und eine Gebäudefläche von ${gebaeudeflaeche} m². ` +
        `Im Bayern-Modell werden ausschließlich Flächen bewertet – kein Bodenwert. ` +
        `Weicht eine dieser Flächen im Bescheid von Ihren Angaben ab, erklärt das die Differenz.`;
    }
  } else if (modell === "bawuemodell") {
    const bodenrichtwert = parseFloat(state.bawueBodenrichtwert);
    const grundstuecksflaeche = parseFloat(state.bawueGrundstuecksflaeche);
    if (!isNaN(bodenrichtwert) && !isNaN(grundstuecksflaeche)) {
      ursache =
        `Im Baden-Württemberg-Modell fließt nur der Bodenwert ein (kein Gebäudewert). ` +
        `Grundlage sind ein Bodenrichtwert von ${bodenrichtwert} €/m² ` +
        `und eine Grundstücksfläche von ${grundstuecksflaeche} m². ` +
        `Eine Abweichung beim Bodenrichtwert oder der Fläche im Bescheid erklärt die Differenz.`;
    }
  } else if (modell === "hamburgmodell") {
    const wohnflaeche = parseFloat(state.hamburgWohnflaeche);
    const wohnlage = state.wohnlage;
    if (!isNaN(wohnflaeche)) {
      ursache =
        `Im Hamburger Modell wird die Wohnfläche (${wohnflaeche} m²) mit einem ` +
        `lageabhängigen Faktor (Wohnlage: ${wohnlage === "gut" ? "gut" : "normal"}) bewertet. ` +
        `Wenn das Finanzamt eine andere Wohnfläche oder Wohnlage hinterlegt hat, ` +
        `erklärt das die Differenz.`;
    }
  }

  const hebesatz = parseFloat(state.hebesatz);
  const hebesatzHinweis =
    !isNaN(hebesatz)
      ? ` Außerdem wird der Hebesatz Ihrer Gemeinde (${hebesatz} %) direkt auf den Steuermessbetrag angewendet – prüfen Sie, ob dieser mit dem Bescheid übereinstimmt.`
      : "";

  return (
    `Die Grundsteuer wurde laut Bescheid um ${betragAbs} € ${richtung} (${Math.abs(abweichung.abweichungProzent).toFixed(1)} %). ` +
    ursache +
    hebesatzHinweis +
    ` Bitte vergleichen Sie Ihre Eingaben mit den Angaben im Grundsteuerwertbescheid des Finanzamts.`
  );
}
