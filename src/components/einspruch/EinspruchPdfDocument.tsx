import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { EinspruchFormData } from "./EinspruchGenerator";

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
});

interface EinspruchPdfDocumentProps {
  data: EinspruchFormData;
}

export function EinspruchPdfDocument({ data }: EinspruchPdfDocumentProps) {
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

  return (
    <Document
      title="Einspruch gegen Grundsteuerbescheid"
      author={data.antragstellerName}
      subject="Einspruch Grundsteuer"
    >
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
    </Document>
  );
}
