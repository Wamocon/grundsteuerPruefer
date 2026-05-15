"use client";

import type { PruefassistentState, PlausibilitaetsFehler } from "./types";
import { getModellForBundesland } from "@/lib/berechnung/modellauswahl";
import type { Bundesland } from "@/types/database";

interface StepEingabeProps {
  state: PruefassistentState;
  update: (partial: Partial<PruefassistentState>) => void;
  fehler: PlausibilitaetsFehler[];
  onBack: () => void;
  onBerechnen: () => void;
}

export function StepEingabe({ state, update, fehler, onBack, onBerechnen }: StepEingabeProps) {
  const modell = state.bundesland
    ? getModellForBundesland(state.bundesland as Bundesland)
    : null;

  function getFehler(feld: string) {
    return fehler.find((f) => f.feld === feld)?.nachricht;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">Schritt 2: Bescheiddaten eingeben</h2>
        <p className="text-sm text-[var(--muted)]">
          Geben Sie die Werte aus Ihrem Grundsteuerbescheid und Ihrer Grundsteuererklärung ein.
        </p>
      </div>

      {/* Common fields */}
      <fieldset className="space-y-4 rounded-lg border border-[var(--card-border)] p-4">
        <legend className="text-xs font-semibold text-[var(--muted)] px-1">Aus dem Bescheid</legend>

        <InputField
          id="bescheidBetrag"
          label="Grundsteuer Jahresbetrag laut Bescheid (€)"
          hint="Den Jahresbetrag finden Sie im Bescheid als 'Grundsteuer B' oder 'festgesetzter Betrag'."
          value={state.bescheidBetrag}
          onChange={(v) => update({ bescheidBetrag: v })}
          type="number"
          fehler={getFehler("bescheidBetrag")}
        />
        <InputField
          id="bescheidDatum"
          label="Datum des Bescheids"
          hint="Das Bescheiddatum finden Sie oben rechts auf dem Bescheid."
          value={state.bescheidDatum}
          onChange={(v) => update({ bescheidDatum: v })}
          type="date"
        />
        <InputField
          id="hebesatz"
          label="Hebesatz der Gemeinde (%)"
          hint="Den Hebesatz finden Sie auf dem Bescheid, z.B. '430 v.H.' = 430 %."
          value={state.hebesatz}
          onChange={(v) => update({ hebesatz: v })}
          type="number"
          fehler={getFehler("hebesatz")}
        />
      </fieldset>

      {/* Model-specific fields */}
      {modell === "bundesmodell" && (
        <fieldset className="space-y-4 rounded-lg border border-[var(--card-border)] p-4">
          <legend className="text-xs font-semibold text-[var(--muted)] px-1">Bundesmodell - Ihre Grundstücksdaten</legend>
          <InputField
            id="bodenrichtwert"
            label="Bodenrichtwert (€/m², Stichtag 01.01.2022)"
            hint="Den Bodenrichtwert finden Sie im Grundsteuermessbescheid oder beim BORIS-Portal Ihres Bundeslandes."
            value={state.bodenrichtwert}
            onChange={(v) => update({ bodenrichtwert: v })}
            type="number"
            fehler={getFehler("bodenrichtwert")}
          />
          <InputField
            id="grundstuecksflaeche"
            label="Grundstücksfläche (m²)"
            hint="Die Grundstücksfläche finden Sie im Grundbuchauszug oder im Bescheid."
            value={state.grundstuecksflaeche}
            onChange={(v) => update({ grundstuecksflaeche: v })}
            type="number"
          />
          <InputField
            id="wohnflaeche"
            label="Wohnfläche des Gebäudes (m²)"
            hint="Die Wohnfläche haben Sie in Ihrer Grundsteuererklärung angegeben. Vergleichen Sie mit dem Bescheid."
            value={state.wohnflaeche}
            onChange={(v) => update({ wohnflaeche: v })}
            type="number"
            fehler={getFehler("wohnflaeche")}
          />
          <InputField
            id="baujahr"
            label="Baujahr des Gebäudes"
            hint="Das Baujahr finden Sie in Ihrer Grundsteuererklärung oder im Bescheid."
            value={state.baujahr}
            onChange={(v) => update({ baujahr: v })}
            type="number"
            fehler={getFehler("baujahr")}
          />
          <div>
            <label htmlFor="nutzungsart" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Nutzungsart
            </label>
            <select
              id="nutzungsart"
              value={state.nutzungsart}
              onChange={(e) => update({ nutzungsart: e.target.value as PruefassistentState["nutzungsart"] })}
              className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
            >
              <option value="wohnen">Wohnen (Steuermesszahl 0,31 ‰)</option>
              <option value="gewerbe">Gewerbe (Steuermesszahl 0,34 ‰)</option>
              <option value="gemischt">Gemischt (Steuermesszahl 0,34 ‰)</option>
            </select>
          </div>
        </fieldset>
      )}

      {modell === "bayernmodell" && (
        <fieldset className="space-y-4 rounded-lg border border-[var(--card-border)] p-4">
          <legend className="text-xs font-semibold text-[var(--muted)] px-1">Bayern-Modell - Flächenangaben</legend>
          <InputField
            id="bayernGrundstuecksflaeche"
            label="Grundstücksfläche (m²)"
            hint="Die Grundstücksfläche finden Sie im Grundbuchauszug oder im Bescheid."
            value={state.bayernGrundstuecksflaeche}
            onChange={(v) => update({ bayernGrundstuecksflaeche: v })}
            type="number"
          />
          <InputField
            id="gebaeudeflaeche"
            label="Gebäudefläche / Wohnfläche (m²)"
            hint="Die Gebäudefläche haben Sie in der Grundsteuererklärung angegeben."
            value={state.gebaeudeflaeche}
            onChange={(v) => update({ gebaeudeflaeche: v })}
            type="number"
            fehler={getFehler("gebaeudeflaeche")}
          />
        </fieldset>
      )}

      {modell === "bawuemodell" && (
        <fieldset className="space-y-4 rounded-lg border border-[var(--card-border)] p-4">
          <legend className="text-xs font-semibold text-[var(--muted)] px-1">BaWü-Modell - Bodenwert</legend>
          <InputField
            id="bawueBodenrichtwert"
            label="Bodenrichtwert (€/m², Stichtag 01.01.2022)"
            hint="Den Bodenrichtwert finden Sie im Bescheid oder beim BORIS-BW Portal."
            value={state.bawueBodenrichtwert}
            onChange={(v) => update({ bawueBodenrichtwert: v })}
            type="number"
            fehler={getFehler("bawueBodenrichtwert")}
          />
          <InputField
            id="bawueGrundstuecksflaeche"
            label="Grundstücksfläche (m²)"
            hint="Die Grundstücksfläche finden Sie im Grundbuchauszug oder im Bescheid."
            value={state.bawueGrundstuecksflaeche}
            onChange={(v) => update({ bawueGrundstuecksflaeche: v })}
            type="number"
          />
        </fieldset>
      )}

      {modell === "hamburgmodell" && (
        <fieldset className="space-y-4 rounded-lg border border-[var(--card-border)] p-4">
          <legend className="text-xs font-semibold text-[var(--muted)] px-1">Hamburg-Modell - Wohnfläche und Lage</legend>
          <InputField
            id="hamburgWohnflaeche"
            label="Wohnfläche (m²)"
            hint="Die Wohnfläche haben Sie in der Grundsteuererklärung angegeben."
            value={state.hamburgWohnflaeche}
            onChange={(v) => update({ hamburgWohnflaeche: v })}
            type="number"
            fehler={getFehler("hamburgWohnflaeche")}
          />
          <div>
            <label htmlFor="wohnlage" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Wohnlage
              <span className="ml-1 text-xs font-normal text-[var(--muted)]">(gemäß Hamburger Mietspiegel)</span>
            </label>
            <select
              id="wohnlage"
              value={state.wohnlage}
              onChange={(e) => update({ wohnlage: e.target.value as PruefassistentState["wohnlage"] })}
              className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
            >
              <option value="normal">Normale Wohnlage (Faktor 1,00)</option>
              <option value="gut">Gute Wohnlage (Faktor 1,25)</option>
            </select>
          </div>
        </fieldset>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 rounded-lg border border-[var(--card-border)] py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition-colors">
          Zurück
        </button>
        <button
          onClick={onBerechnen}
          className="flex-1 rounded-lg bg-[var(--primary)] py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors"
        >
          Bescheid prüfen
        </button>
      </div>
    </div>
  );
}

function InputField({
  id,
  label,
  hint,
  value,
  onChange,
  type = "text",
  fehler,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  fehler?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--foreground)] mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none transition-colors ${
          fehler
            ? "border-[var(--danger)] focus:border-[var(--danger)]"
            : "border-[var(--card-border)] focus:border-[var(--primary)]"
        } bg-[var(--background)]`}
      />
      {hint && <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>}
      {fehler && <p className="mt-1 text-xs text-[var(--danger)]">{fehler}</p>}
    </div>
  );
}
