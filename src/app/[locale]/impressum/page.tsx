import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = { title: "Impressum" };

export default async function ImpressumPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Breadcrumb items={[{ label: "Startseite", href: `/${locale}` }, { label: "Impressum" }]} />
        <article className="mt-6 prose prose-sm max-w-none text-[var(--foreground)]">
          <h1>Impressum</h1>
          <p><em>Stand: Mai 2026</em></p>

          <h2>WAMOCON GmbH</h2>
          <p>
            Mergenthalerallee 79 - 81<br />
            65760 Eschborn<br />
            Deutschland
          </p>

          <h2>Kontakt</h2>
          <p>
            Telefon: +49 6196 5838311<br />
            E-Mail: info@wamocon.com<br />
            Projektkontakt: grundsteuer@wamocon.com
          </p>

          <h2>Vertretungsberechtigter Geschäftsführer</h2>
          <p>Dipl.-Ing. Waleri Moretz</p>

          <h2>Registereintrag</h2>
          <p>
            Handelsregister: Amtsgericht Eschborn, HRB 123666<br />
            Umsatzsteuer-ID: DE344930486
          </p>

          <h2>Rechtlicher Hinweis</h2>
          <p>
            Grundwächter ist ein informatorisches Self-Service-Tool.
            Die generierten Berechnungen und Einspruchsentwürfe stellen keine Rechtsberatung
            im Sinne des Rechtsdienstleistungsgesetzes (RDG) dar. Vor der Einreichung eines
            Einspruchs beim Finanzamt wird die Prüfung durch einen Rechtsanwalt oder
            Steuerberater ausdrücklich empfohlen.
          </p>

          <h2>Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen
            Seiten nach den allgemeinen Gesetzen verantwortlich.
          </p>
        </article>
      </div>
    </div>
  );
}
