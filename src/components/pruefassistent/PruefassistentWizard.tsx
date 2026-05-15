"use client";

import { useState } from "react";
import { INITIAL_STATE, pruefeEingaben } from "./types";
import type { PruefassistentState } from "./types";
import { StepBundesland } from "./StepBundesland";
import { StepEingabe } from "./StepEingabe";
import { StepErgebnis } from "./StepErgebnis";
import {
  berechneBundesmodell,
  berechneBayernmodell,
  berechneBawuemodell,
  berechneHamburgmodell,
  berechneAbweichung,
  getModellForBundesland,
  berechneEinspruchsFrist,
} from "@/lib/berechnung";
import type { BerechnungsErgebnis, AbweichungsErgebnis } from "@/lib/berechnung";
import type { Bundesland } from "@/types/database";

const STEPS = ["Bundesland", "Eingabe", "Ergebnis"];

export function PruefassistentWizard() {
  const [state, setState] = useState<PruefassistentState>(INITIAL_STATE);
  const [ergebnis, setErgebnis] = useState<BerechnungsErgebnis | null>(null);
  const [abweichung, setAbweichung] = useState<AbweichungsErgebnis | null>(null);
  const [einspruchsFrist, setEinspruchsFrist] = useState<Date | null>(null);
  const [fehler, setFehler] = useState<Array<{ feld: string; nachricht: string }>>([]);

  function update(partial: Partial<PruefassistentState>) {
    setState((prev) => ({ ...prev, ...partial }));
  }

  function naechsterSchritt() {
    setState((prev) => ({ ...prev, step: prev.step + 1 }));
  }

  function vorherigerSchritt() {
    setState((prev) => ({ ...prev, step: Math.max(0, prev.step - 1) }));
  }

  function berechnen() {
    const validierungsFehler = pruefeEingaben(state);
    if (validierungsFehler.length > 0) {
      setFehler(validierungsFehler);
      return;
    }
    setFehler([]);

    const bundesland = state.bundesland as Bundesland;
    const modell = getModellForBundesland(bundesland);
    const hebesatz = parseFloat(state.hebesatz);
    const bescheidBetrag = parseFloat(state.bescheidBetrag);

    let ergebnisBerechnung: BerechnungsErgebnis;

    if (modell === "bundesmodell") {
      ergebnisBerechnung = berechneBundesmodell({
        bodenrichtwert: parseFloat(state.bodenrichtwert),
        grundstuecksflaeche: parseFloat(state.grundstuecksflaeche),
        wohnflaeche: parseFloat(state.wohnflaeche),
        nutzungsart: state.nutzungsart,
        baujahr: parseInt(state.baujahr),
        hebesatz,
      });
    } else if (modell === "bayernmodell") {
      ergebnisBerechnung = berechneBayernmodell({
        grundstuecksflaeche: parseFloat(state.bayernGrundstuecksflaeche),
        gebaeudeflaeche: parseFloat(state.gebaeudeflaeche),
        hebesatz,
      });
    } else if (modell === "bawuemodell") {
      ergebnisBerechnung = berechneBawuemodell({
        bodenrichtwert: parseFloat(state.bawueBodenrichtwert),
        grundstuecksflaeche: parseFloat(state.bawueGrundstuecksflaeche),
        hebesatz,
      });
    } else {
      ergebnisBerechnung = berechneHamburgmodell({
        wohnflaeche: parseFloat(state.hamburgWohnflaeche),
        wohnlage: state.wohnlage,
        hebesatz,
      });
    }

    const abweichungsErgebnis = berechneAbweichung(
      bescheidBetrag,
      ergebnisBerechnung.jahresBetrag
    );

    let frist: Date | null = null;
    if (state.bescheidDatum) {
      frist = berechneEinspruchsFrist(new Date(state.bescheidDatum));
    }

    setErgebnis(ergebnisBerechnung);
    setAbweichung(abweichungsErgebnis);
    setEinspruchsFrist(frist);
    setState((prev) => ({ ...prev, step: 2 }));
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={`text-xs font-medium ${
                i === state.step
                  ? "text-[var(--primary)]"
                  : i < state.step
                  ? "text-[var(--success)]"
                  : "text-[var(--muted)]"
              }`}
            >
              {i + 1}. {label}
            </span>
          ))}
        </div>
        <div className="h-1.5 w-full rounded-full bg-[var(--muted-bg)]">
          <div
            className="h-1.5 rounded-full bg-[var(--primary)] transition-all duration-300"
            style={{ width: `${((state.step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      {state.step === 0 && (
        <StepBundesland state={state} update={update} onNext={naechsterSchritt} />
      )}
      {state.step === 1 && (
        <StepEingabe
          state={state}
          update={update}
          fehler={fehler}
          onBack={vorherigerSchritt}
          onBerechnen={berechnen}
        />
      )}
      {state.step === 2 && ergebnis && abweichung && (
        <StepErgebnis
          ergebnis={ergebnis}
          abweichung={abweichung}
          einspruchsFrist={einspruchsFrist}
          onBack={vorherigerSchritt}
          onNeuerPrueffall={() => setState(INITIAL_STATE)}
        />
      )}
    </div>
  );
}
