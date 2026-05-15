"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { EinspruchPdfDocument } from "./EinspruchPdfDocument";

export interface EinspruchFormData {
  antragstellerName: string;
  antragstellerAdresse: string;
  finanzamt: string;
  aktenzeichen: string;
  bescheidDatum: string;
  bescheidBetrag: number;
  berechneterBetrag: number;
  abweichungEuro: number;
  einspruchFrist: string;
  begruendung: string;
}

interface EinspruchGeneratorProps {
  bescheidBetrag?: number;
  berechneterBetrag?: number;
  abweichungEuro?: number;
  einspruchFrist?: string;
}

export function EinspruchGenerator({
  bescheidBetrag = 0,
  berechneterBetrag = 0,
  abweichungEuro = 0,
  einspruchFrist = "",
}: EinspruchGeneratorProps) {
  const [formData, setFormData] = useState<EinspruchFormData>({
    antragstellerName: "",
    antragstellerAdresse: "",
    finanzamt: "",
    aktenzeichen: "",
    bescheidDatum: "",
    bescheidBetrag,
    berechneterBetrag,
    abweichungEuro,
    einspruchFrist,
    begruendung:
      `Laut meiner Berechnung auf Basis der gesetzlichen Vorschriften beträgt die korrekte Grundsteuer ${berechneterBetrag.toFixed(2)} €. Im Bescheid wurde ein Betrag von ${bescheidBetrag.toFixed(2)} € festgesetzt. Dies ergibt eine Abweichung von ${Math.abs(abweichungEuro).toFixed(2)} €.`,
  });
  const [generating, setGenerating] = useState(false);

  function update(key: keyof EinspruchFormData, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function downloadPdf() {
    setGenerating(true);
    try {
      const blob = await pdf(<EinspruchPdfDocument data={formData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Einspruch_Grundsteuer_${new Date().toISOString().split("T")[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  }

  const isComplete =
    formData.antragstellerName &&
    formData.antragstellerAdresse &&
    formData.finanzamt &&
    formData.aktenzeichen &&
    formData.bescheidDatum;

  return (
    <div className="space-y-6">
      {/* Legal disclaimer - prominent */}
      <div className="rounded-lg border border-[var(--warning)] bg-amber-50 dark:bg-amber-950/20 px-4 py-3 text-sm">
        <strong className="text-[var(--warning)]">Rechtlicher Hinweis:</strong>{" "}
        Dieses Schreiben ist ein Musterbrief auf Basis Ihrer Angaben. Es stellt keine
        Rechtsberatung dar. Bei komplexen Sachverhalten empfehlen wir die Prüfung durch
        einen Rechtsanwalt oder Steuerberater vor der Einreichung.
      </div>

      {/* Form */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Ihre Angaben</h3>

        <InputField id="name" label="Ihr vollständiger Name" value={formData.antragstellerName} onChange={(v) => update("antragstellerName", v)} />
        <InputField id="adresse" label="Ihre Adresse" value={formData.antragstellerAdresse} onChange={(v) => update("antragstellerAdresse", v)} placeholder="Musterstraße 1, 12345 Musterstadt" />
        <InputField id="finanzamt" label="Zuständiges Finanzamt" value={formData.finanzamt} onChange={(v) => update("finanzamt", v)} />
        <InputField id="aktenzeichen" label="Aktenzeichen / Steuernummer" value={formData.aktenzeichen} onChange={(v) => update("aktenzeichen", v)} hint="Das Aktenzeichen finden Sie oben auf dem Bescheid." />
        <InputField id="bescheidDatum" label="Datum des Bescheids" value={formData.bescheidDatum} onChange={(v) => update("bescheidDatum", v)} type="date" />

        <div>
          <label htmlFor="begruendung" className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Begründung
          </label>
          <textarea
            id="begruendung"
            rows={4}
            value={formData.begruendung}
            onChange={(e) => update("begruendung", e.target.value)}
            className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none resize-y"
          />
        </div>
      </div>

      <button
        onClick={downloadPdf}
        disabled={!isComplete || generating}
        className="w-full rounded-lg bg-[var(--primary)] py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {generating ? "PDF wird erstellt..." : "Als PDF herunterladen"}
      </button>
    </div>
  );
}

function InputField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
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
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
      />
      {hint && <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>}
    </div>
  );
}
