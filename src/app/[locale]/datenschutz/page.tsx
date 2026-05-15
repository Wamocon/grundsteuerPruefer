import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = { title: "Datenschutzerklärung" };

export default async function DatenschutzPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Breadcrumb items={[{ label: "Startseite", href: `/${locale}` }, { label: "Datenschutzerklärung" }]} />
        <article className="mt-6 prose prose-sm max-w-none text-[var(--foreground)]">
          <h1>Datenschutzerklärung</h1>
          <p><em>Stand: Mai 2026</em></p>

          <h2>1. Verantwortlicher</h2>
          <p>
            WAMOCON GmbH, Mergenthalerallee 79 - 81, 65760 Eschborn<br />
            Telefon: +49 6196 5838311 | E-Mail: info@wamocon.com<br />
            Geschäftsführer: Dipl.-Ing. Waleri Moretz | HRB 123666 | USt-ID: DE344930486
          </p>

          <h2>2. Überblick</h2>
          <p>
            Diese Datenschutzerklärung gilt für Grundwächter
            (grundwaechter.de). Wir verarbeiten personenbezogene Daten nur, soweit
            dies zur Bereitstellung der App erforderlich ist.
          </p>

          <h2>3. Rechtsgrundlagen</h2>
          <ul>
            <li>Einwilligung - Art. 6 Abs. 1 lit. a DSGVO</li>
            <li>Vertragserfüllung - Art. 6 Abs. 1 lit. b DSGVO</li>
            <li>Rechtliche Verpflichtung - Art. 6 Abs. 1 lit. c DSGVO</li>
            <li>Berechtigtes Interesse - Art. 6 Abs. 1 lit. f DSGVO</li>
          </ul>

          <h2>4. Hosting und Infrastruktur</h2>
          <p>
            <strong>Vercel Inc.</strong>: Hosting der Web-App. Verarbeitung technisch
            notwendiger Verbindungsdaten. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.
          </p>
          <p>
            <strong>Supabase Inc. (EU-Region Frankfurt)</strong>: Datenbank, Authentifizierung,
            Session-Management. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Supabase ist
            DSGVO-konform und verarbeitet Daten ausschließlich in der EU (Frankfurt).
          </p>

          <h2>5. Verarbeitete Daten</h2>
          <p>
            Bei Registrierung: E-Mail-Adresse, Passwort (verschlüsselt).<br />
            Bei Nutzung der Prüffunktion: Von Ihnen eingegebene Bescheidwerte (lokal
            verarbeitet; nur bei eingeloggten Nutzern serverseitig gespeichert).<br />
            Server-Logs: IP-Adresse, Zeitstempel, aufgerufene Seiten.
          </p>

          <h2>6. Cookies</h2>
          <p>
            Technisch notwendige Cookies für Session-Management und Authentifizierung.
            Keine Tracking-Cookies, keine Werbe-Cookies.
          </p>

          <h2>7. Ihre Rechte</h2>
          <ul>
            <li>Auskunft (Art. 15 DSGVO)</li>
            <li>Berichtigung (Art. 16 DSGVO)</li>
            <li>Löschung (Art. 17 DSGVO) - direkt in der App unter Profil</li>
            <li>Einschränkung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO) - JSON-Export in der App</li>
            <li>Widerspruch (Art. 21 DSGVO)</li>
          </ul>
          <p>
            Kontakt für Datenschutzanfragen: info@wamocon.com
          </p>
        </article>
      </div>
    </div>
  );
}
