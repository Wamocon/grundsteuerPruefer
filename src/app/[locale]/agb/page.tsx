import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = { title: "AGB" };

export default async function AgbPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Breadcrumb items={[{ label: "Startseite", href: `/${locale}` }, { label: "AGB" }]} />
        <article className="mt-6 prose prose-sm max-w-none text-[var(--foreground)]">
          <h1>Allgemeine Geschäftsbedingungen</h1>
          <p><em>Stand: Mai 2026</em></p>

          <h2>§ 1 Geltungsbereich und Anbieter</h2>
          <p>
            Diese AGB gelten für die Nutzung des Grundsteuerbescheid-Prüfers, einem
            informatorischen Self-Service-Tool der WAMOCON GmbH, Mergenthalerallee 79 - 81,
            65760 Eschborn (nachfolgend &ldquo;Anbieter&rdquo;). Version 1 ist vollständig kostenlos.
          </p>

          <h2>§ 2 Leistungsbeschreibung</h2>
          <p>
            Der Grundsteuerbescheid-Prüfer ist ein informatorisches Werkzeug zur
            Plausibilitätsprüfung von Grundsteuerbescheiden. Er berechnet den Grundsteuerbetrag
            anhand öffentlich zugänglicher gesetzlicher Formeln und vergleicht ihn mit dem
            Bescheidbetrag.
          </p>

          <h2>§ 3 Keine Rechtsberatung (RDG)</h2>
          <p>
            Der Grundsteuerbescheid-Prüfer erbringt keine Rechtsdienstleistungen im Sinne
            des § 2 Abs. 1 RDG. Die App zeigt rechnerische Abweichungen auf und generiert
            Musterschreiben. Diese stellen nach herrschender Rechtsprechung (BGH, I ZR 118/09)
            keine Rechtsdienstleistung dar. Vor der Einreichung eines Einspruchs beim Finanzamt
            wird die Prüfung durch einen Rechtsanwalt oder Steuerberater ausdrücklich empfohlen.
          </p>

          <h2>§ 4 Haftungsausschluss</h2>
          <p>
            Der Anbieter übernimmt keine Haftung für die Richtigkeit der Berechnungsergebnisse,
            die auf Nutzereingaben basieren. Der Nutzer ist für die Korrektheit seiner Eingaben
            verantwortlich. Eine Haftung für unbegründete Einsprüche, die auf fehlerhaften
            Nutzereingaben basieren, ist ausgeschlossen.
          </p>

          <h2>§ 5 Nutzungsrechte</h2>
          <p>
            Der Anbieter räumt dem Nutzer ein einfaches, nicht übertragbares Recht zur
            persönlichen Nutzung der App ein. Eine gewerbliche Weiterverwendung der generierten
            Inhalte bedarf der schriftlichen Zustimmung des Anbieters.
          </p>

          <h2>§ 6 Datenschutz</h2>
          <p>
            Die Verarbeitung personenbezogener Daten erfolgt gemäß der Datenschutzerklärung
            des Anbieters und der DSGVO (EU) 2016/679.
          </p>

          <h2>§ 7 Schlussbestimmungen</h2>
          <p>
            Es gilt deutsches Recht. Gerichtsstand ist Eschborn. Sollten einzelne Bestimmungen
            unwirksam sein, bleibt der Vertrag im Übrigen wirksam.
          </p>
        </article>
      </div>
    </div>
  );
}
