"use client";

import type { PruefassistentState } from "./types";
import { BUNDESLAND_NAMES, MODELL_NAMES, getModellForBundesland } from "@/lib/berechnung/modellauswahl";
import type { Bundesland } from "@/types/database";

interface StepBundeslandProps {
  state: PruefassistentState;
  update: (partial: Partial<PruefassistentState>) => void;
  onNext: () => void;
}

const BUNDESLAENDER = Object.entries(BUNDESLAND_NAMES) as [Bundesland, string][];

export function StepBundesland({ state, update, onNext }: StepBundeslandProps) {
  const selectedModell = state.bundesland
    ? MODELL_NAMES[getModellForBundesland(state.bundesland)]
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">Schritt 1: Ihr Bundesland</h2>
        <p className="text-sm text-[var(--muted)]">
          Das Berechnungsmodell hängt von Ihrem Bundesland ab. Die App erkennt es automatisch.
        </p>
      </div>

      <div>
        <label htmlFor="bundesland" className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Bundesland des Grundstücks
        </label>
        <select
          id="bundesland"
          value={state.bundesland ?? ""}
          onChange={(e) =>
            update({ bundesland: e.target.value as Bundesland || null })
          }
          className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
        >
          <option value="">Bundesland auswählen...</option>
          {BUNDESLAENDER.map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {selectedModell && (
        <div className="rounded-lg border border-[var(--primary)] bg-blue-50 dark:bg-blue-950/20 px-4 py-3">
          <p className="text-xs text-[var(--muted)] mb-0.5">Ihr Berechnungsmodell</p>
          <p className="text-sm font-semibold text-[var(--primary)]">{selectedModell}</p>
        </div>
      )}

      <button
        onClick={onNext}
        disabled={!state.bundesland}
        className="w-full rounded-lg bg-[var(--primary)] py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Weiter
      </button>
    </div>
  );
}
