"use client";

import type { BerechnungsErgebnis, AbweichungsErgebnis } from "@/lib/berechnung";
import { verbleibendeTage } from "@/lib/berechnung/fristen";
import Link from "next/link";

interface StepErgebnisProps {
  ergebnis: BerechnungsErgebnis;
  abweichung: AbweichungsErgebnis;
  einspruchsFrist: Date | null;
  onBack: () => void;
  onNeuerPrueffall: () => void;
}

const STUFE_CONFIG = {
  keine: {
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-[var(--success)]",
    text: "text-[var(--success)]",
    label: "Kein Fehler gefunden",
    icon: "✓",
  },
  gering: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-[var(--warning)]",
    text: "text-[var(--warning)]",
    label: "Geringe Abweichung",
    icon: "⚠",
  },
  erheblich: {
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-[var(--danger)]",
    text: "text-[var(--danger)]",
    label: "Erhebliche Abweichung",
    icon: "✕",
  },
};

export function StepErgebnis({
  ergebnis,
  abweichung,
  einspruchsFrist,
  onBack,
  onNeuerPrueffall,
}: StepErgebnisProps) {
  const config = STUFE_CONFIG[abweichung.stufe];
  const tageVerbleibend = einspruchsFrist ? verbleibendeTage(einspruchsFrist) : null;
  const hatAbweichung = abweichung.stufe !== "keine";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[var(--foreground)]">Prüfergebnis</h2>

      {/* Main result card */}
      <div className={`rounded-xl border ${config.border} ${config.bg} p-6 text-center`}>
        <span className={`text-4xl ${config.text}`}>{config.icon}</span>
        <p className={`mt-2 text-lg font-bold ${config.text}`}>{config.label}</p>
        {hatAbweichung && (
          <p className="mt-1 text-sm text-[var(--foreground)]">
            Abweichung:{" "}
            <strong>
              {abweichung.abweichungEuro > 0 ? "+" : ""}
              {abweichung.abweichungEuro.toFixed(2)} € ({abweichung.abweichungProzent > 0 ? "+" : ""}
              {abweichung.abweichungProzent.toFixed(2)} %)
            </strong>
          </p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-left">
          <div>
            <p className="text-xs text-[var(--muted)]">Laut Bescheid</p>
            <p className="font-semibold">{abweichung.bescheidBetrag.toFixed(2)} €</p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted)]">Unsere Berechnung</p>
            <p className="font-semibold">{abweichung.berechneterBetrag.toFixed(2)} €</p>
          </div>
        </div>
      </div>

      {/* Frist */}
      {einspruchsFrist && tageVerbleibend !== null && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${
          tageVerbleibend < 0
            ? "border-[var(--danger)] bg-red-50 dark:bg-red-950/20"
            : tageVerbleibend <= 7
            ? "border-[var(--warning)] bg-amber-50 dark:bg-amber-950/20"
            : "border-[var(--card-border)] bg-[var(--card)]"
        }`}>
          <p className="text-xs text-[var(--muted)] mb-0.5">Einspruchsfrist (§ 355 AO)</p>
          <p className="font-semibold">
            {einspruchsFrist.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
          {tageVerbleibend >= 0 ? (
            <p className="text-xs text-[var(--muted)] mt-0.5">Noch {tageVerbleibend} {tageVerbleibend === 1 ? "Tag" : "Tage"}</p>
          ) : (
            <p className="text-xs text-[var(--danger)] mt-0.5">Frist abgelaufen</p>
          )}
        </div>
      )}

      {/* Calculation steps */}
      <details className="rounded-lg border border-[var(--card-border)]">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition-colors">
          Berechnungsschritte anzeigen ({ergebnis.rechenschritte.length} Schritte)
        </summary>
        <div className="divide-y divide-[var(--card-border)] border-t border-[var(--card-border)]">
          {ergebnis.rechenschritte.map((schritt, i) => (
            <div key={i} className="px-4 py-3 text-sm">
              <p className="font-medium text-[var(--foreground)]">{schritt.bezeichnung}</p>
              <p className="text-xs text-[var(--muted)] mt-0.5 font-mono">{schritt.formel}</p>
              {Object.entries(schritt.werte).length > 0 && (
                <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-[var(--muted)]">
                  {Object.entries(schritt.werte).map(([k, v]) => (
                    <span key={k}>{k}: <strong>{String(v)}</strong></span>
                  ))}
                </div>
              )}
              {schritt.ergebnis !== 0 && (
                <p className="mt-1 text-xs font-semibold text-[var(--foreground)]">
                  = {typeof schritt.ergebnis === "number" ? schritt.ergebnis.toFixed(2) : schritt.ergebnis} {schritt.einheit}
                </p>
              )}
            </div>
          ))}
        </div>
      </details>

      {/* Legal disclaimer */}
      <p className="text-xs text-[var(--muted)] rounded-lg border border-[var(--card-border)] px-3 py-2">
        Das Prüfergebnis basiert auf Ihren Eingaben. Bei Unsicherheit über Eingabewerte empfehlen
        wir die Beratung durch einen Steuerberater.
      </p>

      {/* Actions */}
      {hatAbweichung && (
        <Link
          href={`/de/einspruch?bescheidBetrag=${abweichung.bescheidBetrag}&berechneterBetrag=${abweichung.berechneterBetrag}&abweichung=${abweichung.abweichungEuro}&frist=${einspruchsFrist?.toISOString() ?? ""}`}
          className="block w-full rounded-lg bg-[var(--primary)] py-2.5 text-center text-sm font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors"
        >
          Einspruchsentwurf erstellen
        </Link>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 rounded-lg border border-[var(--card-border)] py-2.5 text-sm font-medium hover:bg-[var(--muted-bg)] transition-colors">
          Eingaben ändern
        </button>
        <button onClick={onNeuerPrueffall} className="flex-1 rounded-lg border border-[var(--card-border)] py-2.5 text-sm font-medium hover:bg-[var(--muted-bg)] transition-colors">
          Neuer Prüffall
        </button>
      </div>
    </div>
  );
}
