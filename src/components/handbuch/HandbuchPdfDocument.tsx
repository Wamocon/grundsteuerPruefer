import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { HandbuchSection, Block } from "@/lib/handbuch/sections";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.6,
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 60,
    color: "#1a1a1a",
  },
  // Cover
  coverPage: {
    fontFamily: "Helvetica",
    paddingTop: 120,
    paddingHorizontal: 60,
    paddingBottom: 60,
    backgroundColor: "#f8fafc",
  },
  coverBadge: {
    fontSize: 9,
    color: "#3b82f6",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  coverTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 28,
    color: "#0f172a",
    marginBottom: 8,
    lineHeight: 1.3,
  },
  coverSubtitle: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 60,
  },
  coverMeta: {
    fontSize: 9,
    color: "#94a3b8",
    borderTop: "0.5 solid #cbd5e1",
    paddingTop: 12,
    marginTop: "auto",
  },
  // TOC
  tocTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    color: "#0f172a",
    marginBottom: 20,
    paddingBottom: 8,
    borderBottom: "0.5 solid #e2e8f0",
  },
  tocItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    borderBottom: "0.5 solid #f1f5f9",
  },
  tocItemTitle: {
    fontSize: 10,
    color: "#334155",
  },
  tocItemNumber: {
    fontSize: 9,
    color: "#94a3b8",
  },
  // Content
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    color: "#0f172a",
    marginBottom: 12,
    marginTop: 4,
    paddingBottom: 6,
    borderBottom: "0.5 solid #e2e8f0",
  },
  subHeading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: "#1e293b",
    marginTop: 14,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 10,
    color: "#334155",
    marginBottom: 8,
    lineHeight: 1.7,
  },
  listItem: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
  },
  listBullet: {
    fontSize: 10,
    color: "#3b82f6",
    marginTop: 1,
  },
  listText: {
    fontSize: 10,
    color: "#334155",
    flex: 1,
    lineHeight: 1.6,
  },
  noteBox: {
    backgroundColor: "#eff6ff",
    borderLeft: "3 solid #3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 8,
    borderRadius: 2,
  },
  noteText: {
    fontSize: 9.5,
    color: "#1e40af",
    lineHeight: 1.6,
  },
  warnBox: {
    backgroundColor: "#fffbeb",
    borderLeft: "3 solid #f59e0b",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 8,
    borderRadius: 2,
  },
  warnText: {
    fontSize: 9.5,
    color: "#92400e",
    lineHeight: 1.6,
  },
  // Table
  tableContainer: {
    marginVertical: 8,
    borderRadius: 2,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottom: "0.5 solid #cbd5e1",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "0.5 solid #f1f5f9",
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottom: "0.5 solid #f1f5f9",
    backgroundColor: "#f8fafc",
  },
  tableHeaderCell: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: "#64748b",
    padding: 6,
    flex: 1,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableCell: {
    fontSize: 9,
    color: "#334155",
    padding: 6,
    flex: 1,
    lineHeight: 1.5,
  },
  pageNumber: {
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },
});

interface HandbuchPdfDocumentProps {
  sections: HandbuchSection[];
  locale: string;
}

export function HandbuchPdfDocument({ sections, locale }: HandbuchPdfDocumentProps) {
  const isDE = locale !== "en";
  const title = isDE ? "Produkthandbuch" : "Product Handbook";
  const subtitle = isDE
    ? "Vollständige Anleitung zur Nutzung von Grundwächter"
    : "Complete guide to using Grundwächter";
  const tocLabel = isDE ? "Inhaltsverzeichnis" : "Table of Contents";
  const generatedOn = isDE ? "Erstellt am" : "Generated on";

  return (
    <Document title={`Grundwächter ${title}`} author="WAMOCON GmbH" subject={title}>
      {/* Cover page */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverBadge}>Grundwächter</Text>
        <Text style={styles.coverTitle}>{title}</Text>
        <Text style={styles.coverSubtitle}>{subtitle}</Text>
        <Text style={styles.coverMeta}>
          {generatedOn}: {new Date().toLocaleDateString(isDE ? "de-DE" : "en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
          {"  ·  "}WAMOCON GmbH
        </Text>
      </Page>

      {/* Table of contents */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.tocTitle}>{tocLabel}</Text>
        {sections.map((s, i) => (
          <View key={s.id} style={styles.tocItem}>
            <Text style={styles.tocItemTitle}>{`${i + 1}.  ${s.title}`}</Text>
            <Text style={styles.tocItemNumber}>{i + 3}</Text>
          </View>
        ))}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber }) => String(pageNumber)}
          fixed
        />
      </Page>

      {/* Content pages – one page per section */}
      {sections.map((section) => (
        <Page key={section.id} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.blocks.map((block, bi) => (
            <BlockPdf key={bi} block={block} />
          ))}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber }) => String(pageNumber)}
            fixed
          />
        </Page>
      ))}
    </Document>
  );
}

function BlockPdf({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <Text style={styles.paragraph}>{block.text}</Text>;

    case "h2":
      return <Text style={styles.subHeading}>{block.text}</Text>;

    case "ul":
      return (
        <View style={{ marginBottom: 8 }}>
          {(block.items ?? []).map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      );

    case "note":
      return (
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>{block.text}</Text>
        </View>
      );

    case "warn":
      return (
        <View style={styles.warnBox}>
          <Text style={styles.warnText}>{block.text}</Text>
        </View>
      );

    case "table": {
      const headers = block.headers ?? [];
      const rows = block.rows ?? [];
      return (
        <View style={styles.tableContainer}>
          {headers.length > 0 && (
            <View style={styles.tableHeader}>
              {headers.map((h, i) => (
                <Text key={i} style={styles.tableHeaderCell}>{h}</Text>
              ))}
            </View>
          )}
          {rows.map((row, ri) => (
            <View key={ri} style={ri % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              {row.map((cell, ci) => (
                <Text key={ci} style={styles.tableCell}>{cell}</Text>
              ))}
            </View>
          ))}
        </View>
      );
    }

    default:
      return null;
  }
}
