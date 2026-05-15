/**
 * Shared types and validation for the Pruefassistent wizard.
 */

import type { Bundesland } from "@/types/database";
import type { NutzungsartBundesmodell } from "@/lib/berechnung/bundesmodell";
import type { WohnlageHamburg } from "@/lib/berechnung/hamburgmodell";

export interface PruefassistentState {
  step: number;
  bundesland: Bundesland | null;
  // Common
  bescheidBetrag: string;
  bescheidDatum: string;
  hebesatz: string;
  // Bundesmodell
  bodenrichtwert: string;
  grundstuecksflaeche: string;
  wohnflaeche: string;
  nutzungsart: NutzungsartBundesmodell;
  baujahr: string;
  // Bayern
  bayernGrundstuecksflaeche: string;
  gebaeudeflaeche: string;
  // BaWue
  bawueBodenrichtwert: string;
  bawueGrundstuecksflaeche: string;
  // Hamburg
  hamburgWohnflaeche: string;
  wohnlage: WohnlageHamburg;
}

export const INITIAL_STATE: PruefassistentState = {
  step: 0,
  bundesland: null,
  bescheidBetrag: "",
  bescheidDatum: "",
  hebesatz: "",
  bodenrichtwert: "",
  grundstuecksflaeche: "",
  wohnflaeche: "",
  nutzungsart: "wohnen",
  baujahr: "",
  bayernGrundstuecksflaeche: "",
  gebaeudeflaeche: "",
  bawueBodenrichtwert: "",
  bawueGrundstuecksflaeche: "",
  hamburgWohnflaeche: "",
  wohnlage: "normal",
};

export interface PlausibilitaetsFehler {
  feld: string;
  nachricht: string;
}

export function pruefeEingaben(state: PruefassistentState): PlausibilitaetsFehler[] {
  const fehler: PlausibilitaetsFehler[] = [];

  // Common validations
  const betrag = parseFloat(state.bescheidBetrag);
  if (isNaN(betrag) || betrag <= 0) {
    fehler.push({ feld: "bescheidBetrag", nachricht: "Bitte geben Sie den Bescheidbetrag ein (positiver Wert)." });
  }

  const hebesatz = parseFloat(state.hebesatz);
  if (isNaN(hebesatz) || hebesatz < 100 || hebesatz > 1000) {
    fehler.push({ feld: "hebesatz", nachricht: "Der Hebesatz muss zwischen 100 % und 1000 % liegen." });
  }

  const modell = state.bundesland ? getModellForBundeslandOrNull(state.bundesland) : null;

  if (modell === "bundesmodell") {
    const wohnflaeche = parseFloat(state.wohnflaeche);
    if (isNaN(wohnflaeche) || wohnflaeche < 10 || wohnflaeche > 500) {
      fehler.push({ feld: "wohnflaeche", nachricht: "Wohnfläche muss zwischen 10 und 500 m² liegen." });
    }
    const bodenrichtwert = parseFloat(state.bodenrichtwert);
    if (isNaN(bodenrichtwert) || bodenrichtwert <= 0) {
      fehler.push({ feld: "bodenrichtwert", nachricht: "Bitte geben Sie einen gültigen Bodenrichtwert ein." });
    }
    const baujahr = parseInt(state.baujahr);
    if (isNaN(baujahr) || baujahr < 1800 || baujahr > 2022) {
      fehler.push({ feld: "baujahr", nachricht: "Baujahr muss zwischen 1800 und 2022 liegen." });
    }
  }

  if (modell === "bayernmodell") {
    const gf = parseFloat(state.gebaeudeflaeche);
    if (isNaN(gf) || gf < 10 || gf > 500) {
      fehler.push({ feld: "gebaeudeflaeche", nachricht: "Gebäudefläche muss zwischen 10 und 500 m² liegen." });
    }
  }

  if (modell === "bawuemodell") {
    const brw = parseFloat(state.bawueBodenrichtwert);
    if (isNaN(brw) || brw <= 0) {
      fehler.push({ feld: "bawueBodenrichtwert", nachricht: "Bitte geben Sie einen gültigen Bodenrichtwert ein." });
    }
  }

  if (modell === "hamburgmodell") {
    const wf = parseFloat(state.hamburgWohnflaeche);
    if (isNaN(wf) || wf < 10 || wf > 500) {
      fehler.push({ feld: "hamburgWohnflaeche", nachricht: "Wohnfläche muss zwischen 10 und 500 m² liegen." });
    }
  }

  return fehler;
}

function getModellForBundeslandOrNull(bundesland: Bundesland) {
  const map: Record<Bundesland, string> = {
    BB: "bundesmodell", BE: "bundesmodell", HB: "bundesmodell", HE: "bundesmodell",
    MV: "bundesmodell", NI: "bundesmodell", NW: "bundesmodell", RP: "bundesmodell",
    SH: "bundesmodell", SL: "bundesmodell", ST: "bundesmodell", TH: "bundesmodell",
    BY: "bayernmodell", BW: "bawuemodell", HH: "hamburgmodell",
  };
  return map[bundesland] ?? null;
}
