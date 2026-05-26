import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = { title: "Hilfe & FAQ" };

const MODELLE = [
  {
    name: "Bundesmodell",
    bundeslaender: "Berlin, Brandenburg, Bremen, Mecklenburg-Vorpommern, NRW, Rheinland-Pfalz, Sachsen, Sachsen-Anhalt, Schleswig-Holstein, Thüringen",
    beschreibung:
      "Das Bundesmodell nach §§ 219-228 BewG berechnet den Grundsteuerwert als Sachwert (Bodenwert + Gebäudewert) und wendet darauf die Steuermesszahl (0,031 % für Wohnnutzung, 0,034 % für Gewerbe) sowie den Hebesatz der Gemeinde an.",
  },
  {
    name: "Bayern-Modell",
    bundeslaender: "Bayern",
    beschreibung:
      "Bayern nutzt ein flächenbasiertes Modell (BayGrStG). Grundlage sind Äquivalenzzahlen auf Grundstücks- und Gebäudefläche, unabhängig vom Bodenwert.",
  },
  {
    name: "Baden-Württemberg-Modell",
    bundeslaender: "Baden-Württemberg",
    beschreibung:
      "BW verwendet ein reines Bodenwertmodell (LGrStG BW). Es wird nur der Bodenrichtwert multipliziert mit der Grundstücksfläche berücksichtigt - kein Gebäudewert.",
  },
  {
    name: "Hamburg-Modell",
    bundeslaender: "Hamburg",
    beschreibung:
      "Hamburg nutzt ein wohnflächenbasiertes Modell (HmbGrStG). Die Wohnfläche wird mit einer Äquivalenzzahl und einem Lagefaktor multipliziert.",
  },
];

const FAQS = [
  {
    frage: "Wie lese ich meinen Grundsteuerbescheid?",
    antwort:
      "Ihr Grundsteuerbescheid enthält den Grundsteuerbetrag in Euro (Jahresbetrag), das Datum des Bescheids und den Fälligkeitstermin. Wichtig: Der Bescheid basiert auf dem Grundsteuerwertbescheid und dem Steuermessbescheid des Finanzamts - prüfen Sie alle drei Dokumente.",
  },
  {
    frage: "Wie lange habe ich Zeit für einen Einspruch?",
    antwort:
      "Die Einspruchsfrist beträgt einen Monat ab Bekanntgabe des Bescheids (§ 355 AO). Bei Postversand gilt der Bescheid nach 3 Tagen als bekanntgegeben (§ 122 Abs. 2 AO). Beispiel: Bescheid vom 1. Mai 2025 → bekanntgegeben am 4. Mai → Einspruchsfrist bis 4. Juni 2025.",
  },
  {
    frage: "Ab welcher Abweichung lohnt sich ein Einspruch?",
    antwort:
      "Wir markieren Abweichungen ab 50 € als 'erheblich'. Die Entscheidung über einen Einspruch liegt bei Ihnen - berücksichtigen Sie auch den Aufwand. Bei kleinen Abweichungen kann ein informelles Schreiben an das Finanzamt ausreichen.",
  },
  {
    frage: "Ist der generierte Einspruchsentwurf rechtsverbindlich?",
    antwort:
      "Nein. Der Entwurf ist ein informatorisches Muster auf Basis gesetzlicher Formeln. Er stellt keine Rechtsberatung dar. Vor der Einreichung empfehlen wir die Prüfung durch einen Steuerberater oder Rechtsanwalt.",
  },
  {
    frage: "Welche Daten werden gespeichert?",
    antwort:
      "Ohne Konto werden keine Daten gespeichert - alles bleibt im Browser. Mit Konto werden Ihre Prüffälle und Fristen in der Datenbank gespeichert, damit Sie jederzeit darauf zurückgreifen können. Sie können alle Daten jederzeit exportieren oder löschen.",
  },
  {
    frage: "Warum unterscheidet sich mein Ergebnis vom Bescheid?",
    antwort:
      "Mögliche Ursachen: (1) Abweichende Grundstücksdaten im Bescheid, (2) Sonderregelungen Ihrer Gemeinde (abweichender Hebesatz), (3) Steuerbefreiungen oder Vergünstigungen, (4) Rundungsdifferenzen. Prüfen Sie zunächst Ihre Eingaben gegen die Angaben im Grundsteuerwertbescheid.",
  },
];

export default async function HilfePage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Breadcrumb items={[{ label: "Startseite", href: `/${locale}` }, { label: "Hilfe & FAQ" }]} />
        <h1 className="mt-6 text-2xl font-bold text-[var(--foreground)]">Hilfe & FAQ</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Alles Wissenswerte zur Grundsteuerreform, den Berechnungsmodellen und dem Einspruchsverfahren.
        </p>

        {/* Handbook CTA */}
        <Link
          href={`/${locale}/hilfe/handbuch`}
          className="mt-6 flex items-center gap-4 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-5 transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)]/10"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </span>
          <div className="flex-1">
            <p className="font-semibold text-[var(--foreground)]">
              {locale === "en" ? "Product Handbook" : "Produkthandbuch"}
            </p>
            <p className="text-sm text-[var(--muted)]">
              {locale === "en"
                ? "Complete guide with search and PDF download"
                : "Vollständige Anleitung mit Suche und PDF-Download"}
            </p>
          </div>
          <svg className="h-5 w-5 shrink-0 text-[var(--muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        {/* Models section */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Die 4 Berechnungsmodelle</h2>
          <div className="space-y-4">
            {MODELLE.map((m) => (
              <div
                key={m.name}
                className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4"
              >
                <h3 className="font-semibold text-[var(--foreground)]">{m.name}</h3>
                <p className="text-xs text-[var(--muted)] mt-0.5 mb-2">
                  Gilt für: {m.bundeslaender}
                </p>
                <p className="text-sm text-[var(--foreground)]">{m.beschreibung}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ section */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Häufige Fragen
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details
                key={faq.frage}
                className="group rounded-xl border border-[var(--card-border)] bg-[var(--card)]"
              >
                <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-[var(--foreground)] marker:hidden list-none">
                  {faq.frage}
                  <span className="ml-2 text-[var(--muted)] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="border-t border-[var(--card-border)] px-4 py-3 text-sm text-[var(--muted)]">
                  {faq.antwort}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mt-10 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 text-sm">
          <h2 className="font-semibold text-[var(--foreground)] mb-2">Weitere Fragen?</h2>
          <p className="text-[var(--muted)]">
            Bei technischen Fragen wenden Sie sich an{" "}
            <a href="mailto:grundsteuer@wamocon.com" className="text-[var(--primary)] underline">
              grundsteuer@wamocon.com
            </a>
            . Für rechtliche Beratung empfehlen wir einen Steuerberater oder Rechtsanwalt.
          </p>
        </section>
      </div>
    </div>
  );
}
