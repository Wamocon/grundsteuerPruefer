"use client";

import { useState } from "react";
import { berechneEinspruchsFrist, verbleibendeTage } from "@/lib/berechnung/fristen";

export function DeadlineCalculator() {
  const [bescheidDatum, setBescheidDatum] = useState("");
  const [fristDatum, setFristDatum] = useState<Date | null>(null);
  const [tageVerbleibend, setTageVerbleibend] = useState<number | null>(null);

  function berechnen() {
    if (!bescheidDatum) return;
    const datum = new Date(bescheidDatum);
    const frist = berechneEinspruchsFrist(datum);
    setFristDatum(frist);
    setTageVerbleibend(verbleibendeTage(frist));
  }

  const istDringend = tageVerbleibend !== null && tageVerbleibend <= 7;
  const istAbgelaufen = tageVerbleibend !== null && tageVerbleibend < 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <div className="flex-1">
          <label
            htmlFor="bescheidDatum"
            className="block text-xs font-medium text-[var(--muted)] mb-1 text-left"
          >
            Datum des Grundsteuerbescheids
          </label>
          <input
            id="bescheidDatum"
            type="date"
            value={bescheidDatum}
            onChange={(e) => setBescheidDatum(e.target.value)}
            className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
          />
        </div>
        <button
          onClick={berechnen}
          disabled={!bescheidDatum}
          className="self-end rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Berechnen
        </button>
      </div>

      {fristDatum && tageVerbleibend !== null && (
        <div
          className={`w-full max-w-md rounded-lg border p-4 text-center ${
            istAbgelaufen
              ? "border-[var(--danger)] bg-red-50 dark:bg-red-950/20"
              : istDringend
              ? "border-[var(--warning)] bg-amber-50 dark:bg-amber-950/20"
              : "border-[var(--success)] bg-green-50 dark:bg-green-950/20"
          }`}
        >
          <p className="text-xs text-[var(--muted)] mb-1">Einspruchsfrist (§ 355 AO)</p>
          <p className="text-xl font-bold text-[var(--foreground)]">
            {fristDatum.toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p
            className={`mt-1 text-sm font-medium ${
              istAbgelaufen
                ? "text-[var(--danger)]"
                : istDringend
                ? "text-[var(--warning)]"
                : "text-[var(--success)]"
            }`}
          >
            {istAbgelaufen
              ? `Frist abgelaufen (vor ${Math.abs(tageVerbleibend)} Tagen)`
              : tageVerbleibend === 0
              ? "Frist läuft heute ab!"
              : `Noch ${tageVerbleibend} ${tageVerbleibend === 1 ? "Tag" : "Tage"}`}
          </p>
        </div>
      )}
    </div>
  );
}
