import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { EinspruchFormData } from "./EinspruchGenerator";
import type { EinspruchContext } from "@/components/pruefassistent/StepErgebnis";
import { BUNDESLAENDER_MODELL_MAP } from "@/lib/berechnung/modellauswahl";
import type { Bundesland } from "@/types/database";

const BUNDESLAND_NAMEN: Record<string, string> = {
  BB: "Brandenburg", BE: "Berlin", HB: "Bremen", HE: "Hessen",
  MV: "Mecklenburg-Vorpommern", NI: "Niedersachsen", NW: "Nordrhein-Westfalen",
  RP: "Rheinland-Pfalz", SH: "Schleswig-Holstein", SL: "Saarland",
  ST: "Sachsen-Anhalt", TH: "Thüringen", BY: "Bayern", BW: "Baden-Württemberg",
  HH: "Hamburg",
};

const MODELL_NAMEN: Record<string, string> = {
  bundesmodell: "Bundesmodell",
  bayernmodell: "Bayernmodell",
  bawuemodell: "Baden-Württemberg-Modell",
  hamburgmodell: "Hamburger Modell",
};

// A4 German letter style
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.5,
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 70,
    color: "#1a1a1a",
  },
  sender: {
    marginBottom: 20,
    fontSize: 9,
    color: "#555",
    borderBottom: "0.5 solid #ccc",
    paddingBottom: 4,
  },
  addressBlock: {
    marginBottom: 24,
  },
  date: {
    textAlign: "right",
    marginBottom: 24,
    fontSize: 10,
  },
  subject: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 16,
    fontSize: 12,
  },
  body: {
    marginBottom: 12,
  },
  highlight: {
    fontFamily: "Helvetica-Bold",
  },
  disclaimer: {
    marginTop: 24,
    fontSize: 8,
    color: "#666",
    borderTop: "0.5 solid #ccc",
    paddingTop: 8,
    lineHeight: 1.4,
  },
  signature: {
    marginTop: 32,
  },
  // Anlage styles
  anlageHeading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    marginBottom: 4,
    borderBottom: "1 solid #1a1a1a",
    paddingBottom: 4,
  },
  anlageSubHeading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    marginTop: 16,
    marginBottom: 6,
  },
  table: {
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "0.5 solid #ddd",
    paddingVertical: 4,
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  tableColLabel: {
    width: "55%",
    fontSize: 9,
    color: "#444",
  },
  tableColValue: {
    width: "45%",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  tableColStep: {
    width: "35%",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#222",
  },
  tableColFormula: {
    width: "40%",
    fontSize: 8,
    color: "#555",
    fontFamily: "Helvetica-Oblique",
  },
  tableColResult: {
    width: "25%",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#333",
  },
  anlageMeta: {
    fontSize: 9,
    color: "#555",
    marginBottom: 12,
  },
});

interface EinspruchPdfDocumentProps {
  data: EinspruchFormData;
  context?: EinspruchContext;
}

export function EinspruchPdfDocument({ data, context }: EinspruchPdfDocumentProps) {
  const heute = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const fristFormatiert = data.einspruchFrist
    ? new Date(data.einspruchFrist).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "gemäß § 355 AO";

  const bescheidFormatiert = data.bescheidDatum
    ? new Date(data.bescheidDatum).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : data.bescheidDatum;

  // Build property data rows from wizard state
  const grundstueckRows = buildGrundstueckRows(context);
  const bundeslandName = context?.state.bundesland
    ? BUNDESLAND_NAMEN[context.state.bundesland] ?? context.state.bundesland
    : null;
  const modellName = context
    ? getModellName(context.state.bundesland)
    : null;

  return (
    <Document
      title="Einspruch gegen Grundsteuerbescheid"
      author={data.antragstellerName}
      subject="Einspruch Grundsteuer"
    >
      {/* ===== Page 1: Cover letter ===== */}
      <Page size="A4" style={styles.page}>
        {/* Sender line */}
        <View style={styles.sender}>
          <Text>{data.antragstellerName} · {data.antragstellerAdresse}</Text>
        </View>

        {/* Recipient */}
        <View style={styles.addressBlock}>
          <Text style={styles.highlight}>{data.finanzamt}</Text>
          <Text>– Rechtsbehelfsstelle –</Text>
        </View>

        {/* Date */}
        <Text style={styles.date}>{data.antragstellerAdresse.split(",").pop()?.trim() ?? ""}, den {heute}</Text>

        {/* Subject */}
        <Text style={styles.subject}>
          Einspruch gegen den Grundsteuerbescheid{"\n"}
          vom {bescheidFormatiert} – Aktenzeichen: {data.aktenzeichen}
        </Text>

        {/* Salutation */}
        <Text style={styles.body}>Sehr geehrte Damen und Herren,</Text>

        {/* Main text */}
        <Text style={styles.body}>
          hiermit lege ich fristgerecht Einspruch gegen den oben genannten Grundsteuerbescheid
          vom{" "}<Text style={styles.highlight}>{bescheidFormatiert}</Text>{" "}ein.
        </Text>

        <Text style={styles.body}>
          Im Bescheid wurde eine Grundsteuer in Höhe von{" "}
          <Text style={styles.highlight}>{data.bescheidBetrag.toFixed(2)} €</Text>{" "}
          festgesetzt. Nach meiner Berechnung auf Basis der geltenden gesetzlichen Vorschriften
          beträgt der korrekte Jahresbetrag{" "}
          <Text style={styles.highlight}>{data.berechneterBetrag.toFixed(2)} €</Text>.
          Dies ergibt eine Abweichung von{" "}
          <Text style={styles.highlight}>{Math.abs(data.abweichungEuro).toFixed(2)} €</Text>.
        </Text>

        <Text style={styles.body}>
          Begründung:{"\n"}{data.begruendung}
        </Text>

        {context && (
          <Text style={styles.body}>
            Die detaillierte Berechnung einschließlich aller Eingabedaten und Rechenschritte
            ist als Anlage 1 beigefügt.
          </Text>
        )}

        <Text style={styles.body}>
          Ich bitte um Überprüfung des Bescheids und um Abhilfe im Sinne des Einspruchs
          gemäß § 355 der Abgabenordnung (AO). Die Einspruchsfrist läuft am{" "}
          <Text style={styles.highlight}>{fristFormatiert}</Text> ab.
        </Text>

        <Text style={styles.body}>
          Ich bitte um schriftliche Bestätigung des Eingangs dieses Einspruchs.
        </Text>

        {/* Signature */}
        <View style={styles.signature}>
          <Text>Mit freundlichen Grüßen</Text>
          <Text style={{ marginTop: 32 }}>{data.antragstellerName}</Text>
          <Text style={{ fontSize: 9, color: "#666" }}>{data.antragstellerAdresse}</Text>
        </View>

        {/* Legal disclaimer */}
        <View style={styles.disclaimer}>
          <Text>
            HINWEIS: Dieses Schreiben wurde mit Grundwächter (WAMOCON GmbH)
            erstellt und basiert auf den Angaben des Nutzers. Es stellt keine Rechtsberatung dar
            und ersetzt nicht die Prüfung durch einen Rechtsanwalt oder Steuerberater.
            Vor der Einreichung wird die anwaltliche Überprüfung ausdrücklich empfohlen.
          </Text>
        </View>
      </Page>

      {/* ===== Page 2: Anlage – only when context is available ===== */}
      {context && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.anlageHeading}>Anlage 1: Detaillierte Berechnung</Text>
          <Text style={styles.anlageMeta}>
            Einspruch vom {heute} · Aktenzeichen: {data.aktenzeichen}
          </Text>

          {/* Section A: Objekt-Infos */}
          <Text style={styles.anlageSubHeading}>A. Objekt und Berechnungsmodell</Text>
          <View style={styles.table}>
            <View style={styles.tableRowHeader}>
              <Text style={[styles.tableColLabel, styles.tableHeaderText]}>Merkmal</Text>
              <Text style={[styles.tableColValue, styles.tableHeaderText]}>Wert</Text>
            </View>
            {bundeslandName && (
              <View style={styles.tableRow}>
                <Text style={styles.tableColLabel}>Bundesland</Text>
                <Text style={styles.tableColValue}>{bundeslandName}</Text>
              </View>
            )}
            {modellName && (
              <View style={styles.tableRow}>
                <Text style={styles.tableColLabel}>Berechnungsmodell</Text>
                <Text style={styles.tableColValue}>{modellName}</Text>
              </View>
            )}
            <View style={styles.tableRow}>
              <Text style={styles.tableColLabel}>Hebesatz</Text>
              <Text style={styles.tableColValue}>{context.state.hebesatz} %</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColLabel}>Grundsteuerbescheid (Betrag)</Text>
              <Text style={styles.tableColValue}>{context.abweichung.bescheidBetrag.toFixed(2)} €</Text>
            </View>
            {context.state.bescheidDatum && (
              <View style={styles.tableRow}>
                <Text style={styles.tableColLabel}>Datum des Bescheids</Text>
                <Text style={styles.tableColValue}>
                  {new Date(context.state.bescheidDatum).toLocaleDateString("de-DE")}
                </Text>
              </View>
            )}
          </View>

          {/* Section B: Grundstücksdaten */}
          <Text style={styles.anlageSubHeading}>B. Eingabedaten (Grundstück)</Text>
          <View style={styles.table}>
            <View style={styles.tableRowHeader}>
              <Text style={[styles.tableColLabel, styles.tableHeaderText]}>Feld</Text>
              <Text style={[styles.tableColValue, styles.tableHeaderText]}>Eingabe</Text>
            </View>
            {grundstueckRows.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableColLabel}>{row.label}</Text>
                <Text style={styles.tableColValue}>{row.value}</Text>
              </View>
            ))}
          </View>

          {/* Section C: Berechnungsschritte */}
          <Text style={styles.anlageSubHeading}>C. Berechnungsschritte</Text>
          <View style={styles.table}>
            <View style={styles.tableRowHeader}>
              <Text style={[styles.tableColStep, styles.tableHeaderText]}>Schritt</Text>
              <Text style={[styles.tableColFormula, styles.tableHeaderText]}>Formel / Grundlage</Text>
              <Text style={[styles.tableColResult, styles.tableHeaderText]}>Ergebnis</Text>
            </View>
            {context.ergebnis.rechenschritte.map((schritt, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableColStep}>{schritt.bezeichnung}</Text>
                <Text style={styles.tableColFormula}>{schritt.formel}</Text>
                <Text style={styles.tableColResult}>
                  {schritt.ergebnis !== 0
                    ? `${typeof schritt.ergebnis === "number" ? schritt.ergebnis.toFixed(4) : schritt.ergebnis} ${schritt.einheit}`
                    : "–"}
                </Text>
              </View>
            ))}
          </View>

          {/* Section D: Ergebnis-Vergleich */}
          <Text style={styles.anlageSubHeading}>D. Vergleich Bescheid / eigene Berechnung</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColLabel}>Betrag laut Bescheid</Text>
              <Text style={styles.tableColValue}>{context.abweichung.bescheidBetrag.toFixed(2)} €</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColLabel}>Berechneter Betrag (eigene Ermittlung)</Text>
              <Text style={styles.tableColValue}>{context.abweichung.berechneterBetrag.toFixed(2)} €</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColLabel}>Abweichung</Text>
              <Text style={styles.tableColValue}>
                {context.abweichung.abweichungEuro > 0 ? "+" : ""}
                {context.abweichung.abweichungEuro.toFixed(2)} € ({context.abweichung.abweichungProzent.toFixed(2)} %)
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColLabel}>Einstufung</Text>
              <Text style={styles.tableColValue}>
                {context.abweichung.stufe === "erheblich" ? "Erheblich (> 50 €)" : "Gering"}
              </Text>
            </View>
          </View>

          <View style={styles.disclaimer}>
            <Text>
              Diese Anlage wurde automatisch durch Grundwächter (WAMOCON GmbH) erstellt.
              Die Berechnung basiert auf den eingegebenen Daten und den gesetzlichen Vorschriften
              zum Zeitpunkt der Erstellung. Sie stellt keine Rechtsberatung dar.
            </Text>
          </View>
        </Page>
      )}
    </Document>
  );
}

// ---- helper functions --------------------------------------------------------

function getModellName(bundesland: Bundesland | null): string | null {
  if (!bundesland) return null;
  const modell = BUNDESLAENDER_MODELL_MAP[bundesland];
  return modell ? (MODELL_NAMEN[modell] ?? modell) : null;
}

function buildGrundstueckRows(ctx: EinspruchContext | undefined): { label: string; value: string }[] {
  if (!ctx) return [];
  const s = ctx.state;
  const modell = s.bundesland ? BUNDESLAENDER_MODELL_MAP[s.bundesland] : null;
  const rows: { label: string; value: string }[] = [];

  if (modell === "bundesmodell") {
    if (s.bodenrichtwert) rows.push({ label: "Bodenrichtwert", value: `${s.bodenrichtwert} €/m²` });
    if (s.grundstuecksflaeche) rows.push({ label: "Grundstücksfläche", value: `${s.grundstuecksflaeche} m²` });
    if (s.wohnflaeche) rows.push({ label: "Wohnfläche", value: `${s.wohnflaeche} m²` });
    if (s.nutzungsart) rows.push({ label: "Nutzungsart", value: s.nutzungsart });
    if (s.baujahr) rows.push({ label: "Baujahr", value: s.baujahr });
  } else if (modell === "bayernmodell") {
    if (s.bayernGrundstuecksflaeche) rows.push({ label: "Grundstücksfläche", value: `${s.bayernGrundstuecksflaeche} m²` });
    if (s.gebaeudeflaeche) rows.push({ label: "Gebäudefläche", value: `${s.gebaeudeflaeche} m²` });
  } else if (modell === "bawuemodell") {
    if (s.bawueBodenrichtwert) rows.push({ label: "Bodenrichtwert", value: `${s.bawueBodenrichtwert} €/m²` });
    if (s.bawueGrundstuecksflaeche) rows.push({ label: "Grundstücksfläche", value: `${s.bawueGrundstuecksflaeche} m²` });
  } else if (modell === "hamburgmodell") {
    if (s.hamburgWohnflaeche) rows.push({ label: "Wohnfläche", value: `${s.hamburgWohnflaeche} m²` });
    if (s.wohnlage) rows.push({ label: "Wohnlage", value: s.wohnlage });
  }

  return rows;
}
