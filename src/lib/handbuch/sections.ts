/**
 * Produkthandbuch content data – DE + EN
 * Content is defined inline (not in messages JSON) to keep translation files lean.
 */

export type BlockType = "p" | "h2" | "ul" | "note" | "warn" | "table";

export interface Block {
  type: BlockType;
  text?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
}

export interface HandbuchSection {
  id: string;
  title: string;
  blocks: Block[];
}

// ---------------------------------------------------------------------------
// DE
// ---------------------------------------------------------------------------

const DE_SECTIONS: HandbuchSection[] = [
  {
    id: "willkommen",
    title: "Willkommen bei Grundwächter",
    blocks: [
      {
        type: "p",
        text: "Grundwächter ist ein kostenloses Web-Tool, das Ihnen hilft, Ihren Grundsteuerbescheid schnell und einfach zu überprüfen. Die App rechnet Ihren Bescheid nach den gesetzlichen Vorschriften nach und zeigt Ihnen sofort, ob das Finanzamt korrekt gerechnet hat.",
      },
      { type: "h2", text: "Wer profitiert von Grundwächter?" },
      {
        type: "ul",
        items: [
          "Eigentümer von Wohnimmobilien (Häuser, Wohnungen, Grundstücke)",
          "Vermieter mit einem oder mehreren Objekten",
          "Alle, die ihren Bescheid nachvollziehen möchten",
          "Personen, die einen Einspruch prüfen wollen",
        ],
      },
      {
        type: "note",
        text: "Version 1 ist vollständig kostenlos. Alle Funktionen sind ohne Konto nutzbar. Ein Konto ermöglicht zusätzlich das Speichern Ihrer Prüffälle und Fristenerinnerungen.",
      },
    ],
  },
  {
    id: "voraussetzungen",
    title: "Was Sie benötigen",
    blocks: [
      {
        type: "p",
        text: "Für die Prüfung benötigen Sie Ihren Grundsteuerbescheid. Je nach Bundesland können weitere Dokumente hilfreich sein.",
      },
      {
        type: "table",
        headers: ["Bundesland", "Benötigte Dokumente"],
        rows: [
          [
            "Alle außer BY, BW, HH",
            "Grundsteuerbescheid, Grundsteuerwertbescheid (Bodenrichtwert, Flächen)",
          ],
          ["Bayern", "Grundsteuerbescheid, Fläche Grundstück und Gebäude"],
          ["Baden-Württemberg", "Grundsteuerbescheid, Grundstücksfläche, Bodenrichtwert"],
          ["Hamburg", "Grundsteuerbescheid, Wohnfläche, Lagefaktor"],
        ],
      },
      {
        type: "note",
        text: "Alle Werte finden Sie auf Ihrem Grundsteuerwertbescheid oder Grundsteuermessbescheid des Finanzamts. Achten Sie auf die korrekte Einheit (m², €/m², %).",
      },
    ],
  },
  {
    id: "pruefung-starten",
    title: "Prüfung Schritt für Schritt",
    blocks: [
      {
        type: "p",
        text: "Die Prüfung führen Sie in drei Schritten durch. Der Fortschrittsbalken oben zeigt Ihnen, wie weit Sie sind.",
      },
      { type: "h2", text: "Schritt 1 – Bundesland auswählen" },
      {
        type: "p",
        text: "Wählen Sie das Bundesland, in dem sich das Grundstück befindet. Die App wählt automatisch das korrekte Berechnungsmodell.",
      },
      { type: "h2", text: "Schritt 2 – Daten eingeben" },
      {
        type: "p",
        text: "Geben Sie die Werte aus Ihrem Bescheid ein. Welche Felder erscheinen, hängt vom Berechnungsmodell ab.",
      },
      {
        type: "ul",
        items: [
          "Betrag laut Bescheid (€) – den Jahresbetrag aus dem Grundsteuerbescheid",
          "Grundstücksfläche (m²) – aus Grundbuch oder Bescheid",
          "Wohnfläche/Gebäudefläche – je nach Modell unterschiedlich",
          "Bodenrichtwert (€/m²) – vom Gutachterausschuss Ihrer Gemeinde",
          "Hebesatz (%) – von Ihrer Gemeinde festgelegt",
          "Baujahr – Jahr der Fertigstellung des Gebäudes",
        ],
      },
      {
        type: "note",
        text: "Ihre Eingaben werden automatisch im Browser gespeichert. Wenn Sie die Seite schließen, können Sie die Prüfung später nahtlos fortsetzen.",
      },
      { type: "h2", text: "Schritt 3 – Ergebnis auswerten" },
      {
        type: "p",
        text: "Die App zeigt Ihnen den berechneten Betrag, den Bescheidbetrag und die Abweichung – mit einer farblich codierten Einschätzung und einer Empfehlung.",
      },
    ],
  },
  {
    id: "berechnungsmodelle",
    title: "Berechnungsmodelle",
    blocks: [
      {
        type: "p",
        text: "Seit der Grundsteuerreform 2025 gibt es in Deutschland vier verschiedene Berechnungsmodelle. Ihr Bundesland bestimmt, welches Modell angewendet wird.",
      },
      {
        type: "table",
        headers: ["Modell", "Bundesländer", "Berechnungsgrundlage"],
        rows: [
          [
            "Bundesmodell",
            "BB, BE, HB, HE, MV, NI, NW, RP, SH, SL, ST, TH",
            "Bodenwert + Gebäudewert × Steuermesszahl × Hebesatz",
          ],
          ["Bayern-Modell", "BY", "Grundstücks- und Gebäudefläche × Äquivalenzzahl × Hebesatz"],
          ["BaWü-Modell", "BW", "Grundstücksfläche × Bodenrichtwert × Steuermesszahl × Hebesatz"],
          ["Hamburg-Modell", "HH", "Wohnfläche × Äquivalenzzahl × Lagefaktor × Hebesatz"],
        ],
      },
      { type: "h2", text: "Bundesmodell (12 Bundesländer)" },
      {
        type: "p",
        text: "Der Grundsteuerwert ergibt sich aus Bodenwert und Gebäudewert. Darauf wird die Steuermesszahl (0,031 % Wohnnutzung, 0,034 % Gewerbe) und der Hebesatz angewendet. Die Formel lautet: Grundsteuerwert × Steuermesszahl × Hebesatz.",
      },
      { type: "h2", text: "Bayern-Modell" },
      {
        type: "p",
        text: "Flächenbasiertes Modell ohne Berücksichtigung des Bodenwerts. Grundlage sind Äquivalenzzahlen auf Grundstücks- und Gebäudefläche. Vorteil: keine Bewertung des Marktwerts nötig.",
      },
      { type: "h2", text: "Baden-Württemberg-Modell" },
      {
        type: "p",
        text: "Reines Bodenwertmodell. Nur Grundstücksfläche multipliziert mit dem Bodenrichtwert wird berücksichtigt – der Gebäudewert wird vollständig ignoriert.",
      },
      { type: "h2", text: "Hamburg-Modell" },
      {
        type: "p",
        text: "Wohnflächenbasiertes Modell. Die Wohnfläche wird mit einer Äquivalenzzahl und einem Lagefaktor multipliziert. Der Lagefaktor berücksichtigt die Lage des Grundstücks in Hamburg.",
      },
    ],
  },
  {
    id: "ergebnis",
    title: "Ergebnis verstehen",
    blocks: [
      {
        type: "p",
        text: "Das Ergebnis vergleicht den von der App berechneten Grundsteuerbetrag mit dem Betrag in Ihrem Bescheid und zeigt die Abweichung.",
      },
      { type: "h2", text: "Abweichungsstufen" },
      {
        type: "table",
        headers: ["Stufe", "Abweichung", "Empfehlung"],
        rows: [
          ["Kein Fehler", "< 5 €", "Bescheid korrekt. Kein Handlungsbedarf."],
          ["Geringe Abweichung", "5 – 49 €", "Eingaben prüfen. Einspruch optional."],
          ["Erhebliche Abweichung", "≥ 50 €", "Einspruch dringend empfohlen."],
        ],
      },
      { type: "h2", text: "Rechenschritte" },
      {
        type: "p",
        text: "Alle Berechnungsschritte mit Formel, Eingabewerten und Zwischenergebnis werden transparent angezeigt. Klappen Sie die Detailansicht auf, um jeden Schritt nachzuvollziehen.",
      },
      { type: "h2", text: "Erklärung in verständlicher Sprache" },
      {
        type: "p",
        text: 'Unter dem Ergebnis finden Sie eine automatisch generierte Erklärung in einfachen Worten – beispielsweise: "Das Finanzamt hat eine Wohnfläche von 120 m² angenommen, Ihre Angabe ergibt 105 m²."',
      },
      {
        type: "warn",
        text: "Die App arbeitet ausschließlich auf Basis Ihrer Eingaben. Prüfen Sie alle Angaben sorgfältig gegen Ihren Originalbescheid, bevor Sie einen Einspruch einreichen.",
      },
    ],
  },
  {
    id: "einspruch",
    title: "Einspruch generieren",
    blocks: [
      {
        type: "p",
        text: "Bei einer erheblichen Abweichung können Sie direkt aus der App einen rechtlich strukturierten Einspruchsentwurf als PDF generieren.",
      },
      { type: "h2", text: "Wann lohnt ein Einspruch?" },
      {
        type: "ul",
        items: [
          "Abweichung von 50 € oder mehr",
          "Fehlerhafte Grundstücksdaten im Bescheid",
          "Falsche Flächenangaben oder falscher Hebesatz",
          "Wenn Sie konkrete Fehler in der Berechnung identifiziert haben",
        ],
      },
      { type: "h2", text: "Einspruchsfrist" },
      {
        type: "p",
        text: "Die Einspruchsfrist beträgt 1 Monat nach Bekanntgabe (§ 355 AO). Bei Postversand gilt der Bescheid 3 Tage nach dem Briefdatum als bekanntgegeben (§ 122 Abs. 2 AO). Fällt das Fristende auf ein Wochenende oder Feiertag, verschiebt es sich auf den nächsten Werktag.",
      },
      {
        type: "warn",
        text: "Der generierte Einspruchsentwurf ist ein Musterbrief und stellt keine Rechtsberatung dar. Wir empfehlen ausdrücklich, den Entwurf vor der Einreichung von einem Steuerberater oder Rechtsanwalt prüfen zu lassen.",
      },
      { type: "h2", text: "Schritt für Schritt" },
      {
        type: "ul",
        items: [
          "Prüfung durchführen (Ergebnis: erhebliche Abweichung)",
          'Auf "Einspruch generieren" klicken',
          "Eigene Kontaktdaten und Aktenzeichen eingeben",
          "Begründung prüfen und ggf. anpassen",
          "PDF herunterladen",
          "Per Einschreiben an das zuständige Finanzamt senden",
          "Sendebeleg aufbewahren",
        ],
      },
      {
        type: "note",
        text: "Das Aktenzeichen finden Sie oben auf Ihrem Grundsteuerbescheid oder Grundsteuerwertbescheid.",
      },
    ],
  },
  {
    id: "fristrechner",
    title: "Fristrechner",
    blocks: [
      {
        type: "p",
        text: "Auf der Startseite befindet sich ein Fristrechner. Geben Sie das Datum Ihres Bescheids ein – die Einspruchsfrist wird sofort automatisch berechnet.",
      },
      { type: "h2", text: "Berechnung der Frist" },
      {
        type: "ul",
        items: [
          "Briefdatum des Bescheids + 3 Tage = Bekanntgabedatum (§ 122 Abs. 2 AO)",
          "Bekanntgabedatum + 1 Monat = Einspruchsfrist (§ 355 AO)",
          "Fällt der letzte Tag auf Sa/So/Feiertag → nächster Werktag",
        ],
      },
      {
        type: "note",
        text: "Falls der Bescheid nachweislich erst später bei Ihnen ankam, gilt das tatsächliche Zustelldatum. Im Zweifel früher handeln.",
      },
      { type: "h2", text: "Fristen im Dashboard" },
      {
        type: "p",
        text: "Mit einem Konto werden Ihre Einspruchsfristen im Dashboard gespeichert und zeigen einen Countdown. Bei weniger als 7 verbleibenden Tagen erscheint eine Warnung.",
      },
    ],
  },
  {
    id: "dashboard",
    title: "Dashboard & Meine Prüfungen",
    blocks: [
      {
        type: "p",
        text: "Mit einem kostenlosen Konto speichert Grundwächter Ihre Prüffälle und Fristen automatisch. Das Dashboard gibt Ihnen einen Überblick über alle Ihre Prüfungen.",
      },
      { type: "h2", text: "Was zeigt das Dashboard?" },
      {
        type: "ul",
        items: [
          "Alle gespeicherten Prüffälle mit Datum, Bundesland, Modell und Abweichung",
          "Offene Einspruchsfristen mit Countdown (Warnung bei ≤ 7 Tagen)",
          '"Erneut prüfen"-Link zum Wiederholen einer gespeicherten Prüfung',
          "Button zum Starten einer neuen Prüfung",
        ],
      },
      { type: "h2", text: "Konto erstellen" },
      {
        type: "ul",
        items: [
          'Im Header auf "Anmelden" klicken',
          '"Noch kein Konto? Jetzt registrieren" wählen',
          "E-Mail und Passwort (mind. 8 Zeichen) eingeben",
          "Bestätigungs-E-Mail öffnen und auf den Link klicken",
          "Anmelden und loslegen",
        ],
      },
      {
        type: "note",
        text: "Ohne Konto werden Prüfungen nicht dauerhaft gespeichert – nur im Browser. Mit Konto sind alle Prüfungen geräteübergreifend abrufbar.",
      },
    ],
  },
  {
    id: "datenschutz",
    title: "Datenschutz & Ihre Daten",
    blocks: [
      {
        type: "p",
        text: "Grundwächter verarbeitet nur die Daten, die für die Funktion der App notwendig sind. Die Anwendung entspricht den Anforderungen der DSGVO.",
      },
      { type: "h2", text: "Gespeicherte Daten im Überblick" },
      {
        type: "table",
        headers: ["Daten", "Ohne Konto", "Mit Konto"],
        rows: [
          ["Prüfeingaben", "Browser (localStorage)", "Verschlüsselte Datenbank"],
          ["Prüfergebnisse", "Browser (localStorage)", "Verschlüsselte Datenbank"],
          ["Einspruchsfristen", "Nicht gespeichert", "Verschlüsselte Datenbank"],
          ["E-Mail-Adresse", "Nicht erfasst", "Nur für Login & Erinnerungen"],
        ],
      },
      { type: "h2", text: "Ihre DSGVO-Rechte" },
      {
        type: "ul",
        items: [
          "Auskunft & Export: Profil → Daten exportieren (JSON-Download aller gespeicherten Daten)",
          "Löschung: Profil → Konto löschen (löscht alle Daten unwiderruflich)",
          "Berichtigung: Durch erneute Prüfung mit korrigierten Werten",
        ],
      },
      {
        type: "note",
        text: "Weitere Informationen finden Sie in unserer Datenschutzerklärung (Link im Footer).",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// EN
// ---------------------------------------------------------------------------

const EN_SECTIONS: HandbuchSection[] = [
  {
    id: "willkommen",
    title: "Welcome to Grundwächter",
    blocks: [
      {
        type: "p",
        text: "Grundwächter is a free web tool that helps you quickly and easily verify your property tax (Grundsteuer) notice. The app recalculates your notice according to legal regulations and immediately shows you whether the tax authority has calculated correctly.",
      },
      { type: "h2", text: "Who benefits from Grundwächter?" },
      {
        type: "ul",
        items: [
          "Owners of residential properties (houses, apartments, plots)",
          "Landlords with one or more properties",
          "Anyone who wants to understand how their notice is calculated",
          "People considering filing an objection",
        ],
      },
      {
        type: "note",
        text: "Version 1 is completely free. All features are available without an account. An account additionally allows you to save your checks and deadline reminders.",
      },
    ],
  },
  {
    id: "voraussetzungen",
    title: "What you need",
    blocks: [
      {
        type: "p",
        text: "To perform a check you need your Grundsteuer notice. Depending on your federal state, additional documents may be helpful.",
      },
      {
        type: "table",
        headers: ["Federal state", "Required documents"],
        rows: [
          [
            "All except BY, BW, HH",
            "Tax notice, property value notice (land value, floor areas)",
          ],
          ["Bavaria", "Tax notice, plot area and building area"],
          ["Baden-Württemberg", "Tax notice, plot area, land value (Bodenrichtwert)"],
          ["Hamburg", "Tax notice, living area, location factor"],
        ],
      },
      {
        type: "note",
        text: "All values can be found on your Grundsteuerwertbescheid or Grundsteuermessbescheid. Pay attention to the correct unit (m², €/m², %).",
      },
    ],
  },
  {
    id: "pruefung-starten",
    title: "Check step by step",
    blocks: [
      {
        type: "p",
        text: "The check is carried out in three steps. The progress bar at the top shows you how far along you are.",
      },
      { type: "h2", text: "Step 1 – Select federal state" },
      {
        type: "p",
        text: "Select the federal state in which the property is located. The app automatically selects the correct calculation model.",
      },
      { type: "h2", text: "Step 2 – Enter data" },
      {
        type: "p",
        text: "Enter the values from your notice. Which fields appear depends on the calculation model.",
      },
      {
        type: "ul",
        items: [
          "Amount on notice (€) – the annual amount from the Grundsteuer notice",
          "Plot area (m²) – from the land register or notice",
          "Living area / building area – varies by model",
          "Land value (€/m²) – from your municipality's appraisal committee",
          "Assessment rate (%) – set by your municipality",
          "Year of construction – year the building was completed",
        ],
      },
      {
        type: "note",
        text: "Your entries are automatically saved in the browser. If you close the page, you can seamlessly continue the check later.",
      },
      { type: "h2", text: "Step 3 – Evaluate result" },
      {
        type: "p",
        text: "The app shows you the calculated amount, the notice amount and the discrepancy – with a colour-coded assessment and a recommendation.",
      },
    ],
  },
  {
    id: "berechnungsmodelle",
    title: "Calculation models",
    blocks: [
      {
        type: "p",
        text: "Since the Grundsteuer reform in 2025, Germany uses four different calculation models. Your federal state determines which model is applied.",
      },
      {
        type: "table",
        headers: ["Model", "Federal states", "Calculation basis"],
        rows: [
          [
            "Federal model",
            "BB, BE, HB, HE, MV, NI, NW, RP, SH, SL, ST, TH",
            "Land value + building value × tax rate × assessment rate",
          ],
          ["Bavaria model", "BY", "Plot and building area × equivalent figure × assessment rate"],
          ["BaWü model", "BW", "Plot area × land value × tax rate × assessment rate"],
          ["Hamburg model", "HH", "Living area × equivalent figure × location factor × assessment rate"],
        ],
      },
      { type: "h2", text: "Federal model (12 federal states)" },
      {
        type: "p",
        text: "The property value consists of land value and building value. The tax rate (0.031% residential, 0.034% commercial) and the assessment rate are applied. Formula: property value × tax rate × assessment rate.",
      },
      { type: "h2", text: "Bavaria model" },
      {
        type: "p",
        text: "Area-based model without considering the land value. Based on equivalent figures for plot and building area. Advantage: no market value assessment needed.",
      },
      { type: "h2", text: "Baden-Württemberg model" },
      {
        type: "p",
        text: "Pure land value model. Only the plot area multiplied by the land value is taken into account – the building value is completely ignored.",
      },
      { type: "h2", text: "Hamburg model" },
      {
        type: "p",
        text: "Living-area-based model. The living area is multiplied by an equivalent figure and a location factor. The location factor accounts for the location of the property in Hamburg.",
      },
    ],
  },
  {
    id: "ergebnis",
    title: "Understanding the result",
    blocks: [
      {
        type: "p",
        text: "The result compares the Grundsteuer amount calculated by the app with the amount in your notice and shows the discrepancy.",
      },
      { type: "h2", text: "Discrepancy levels" },
      {
        type: "table",
        headers: ["Level", "Discrepancy", "Recommendation"],
        rows: [
          ["No error", "< €5", "Notice is correct. No action needed."],
          ["Minor discrepancy", "€5 – €49", "Check inputs. Objection optional."],
          ["Significant discrepancy", "≥ €50", "Objection strongly recommended."],
        ],
      },
      { type: "h2", text: "Calculation steps" },
      {
        type: "p",
        text: "All calculation steps with formula, input values and intermediate result are shown transparently. Expand the detail view to follow every step.",
      },
      { type: "h2", text: "Plain-language explanation" },
      {
        type: "p",
        text: 'Below the result you will find an automatically generated plain-language explanation – for example: "The tax authority assumed a living area of 120 m², your input results in 105 m²."',
      },
      {
        type: "warn",
        text: "The app works exclusively based on your inputs. Carefully check all entries against your original notice before filing an objection.",
      },
    ],
  },
  {
    id: "einspruch",
    title: "Generate an objection",
    blocks: [
      {
        type: "p",
        text: "In case of a significant discrepancy, you can generate a legally structured objection draft as a PDF directly from the app.",
      },
      { type: "h2", text: "When is an objection worthwhile?" },
      {
        type: "ul",
        items: [
          "Discrepancy of €50 or more",
          "Incorrect property data in the notice",
          "Wrong area figures or assessment rate",
          "When you have identified concrete errors in the calculation",
        ],
      },
      { type: "h2", text: "Objection deadline" },
      {
        type: "p",
        text: "The objection period is 1 month after notification (§ 355 AO). For postal delivery the notice is deemed received 3 days after the letter date (§ 122 Para. 2 AO). If the deadline falls on a weekend or public holiday, it moves to the next working day.",
      },
      {
        type: "warn",
        text: "The generated objection draft is a template and does not constitute legal advice. We strongly recommend having the draft reviewed by a tax advisor or lawyer before submitting.",
      },
      { type: "h2", text: "Step by step" },
      {
        type: "ul",
        items: [
          "Perform a check (result: significant discrepancy)",
          'Click "Generate objection"',
          "Enter your contact details and file reference number",
          "Review and adjust the justification if needed",
          "Download the PDF",
          "Send by registered mail to the responsible tax authority",
          "Keep the proof of postage",
        ],
      },
    ],
  },
  {
    id: "fristrechner",
    title: "Deadline calculator",
    blocks: [
      {
        type: "p",
        text: "On the home page you will find a deadline calculator. Enter the date of your notice – the objection deadline is calculated instantly and automatically.",
      },
      { type: "h2", text: "How the deadline is calculated" },
      {
        type: "ul",
        items: [
          "Letter date of notice + 3 days = notification date (§ 122 Para. 2 AO)",
          "Notification date + 1 month = objection deadline (§ 355 AO)",
          "If the last day falls on Sat/Sun/public holiday → next working day",
        ],
      },
      {
        type: "note",
        text: "If the notice demonstrably arrived later, the actual delivery date applies. When in doubt, act earlier.",
      },
    ],
  },
  {
    id: "dashboard",
    title: "Dashboard & My checks",
    blocks: [
      {
        type: "p",
        text: "With a free account, Grundwächter automatically saves your checks and deadlines. The dashboard gives you an overview of all your checks.",
      },
      { type: "h2", text: "What does the dashboard show?" },
      {
        type: "ul",
        items: [
          "All saved checks with date, federal state, model and discrepancy",
          "Open objection deadlines with countdown (warning at ≤ 7 days)",
          '"Check again" link to repeat a saved check',
          "Button to start a new check",
        ],
      },
      { type: "h2", text: "Creating an account" },
      {
        type: "ul",
        items: [
          'Click "Sign in" in the header',
          'Select "No account yet? Register now"',
          "Enter email and password (min. 8 characters)",
          "Open the confirmation email and click the link",
          "Sign in and get started",
        ],
      },
      {
        type: "note",
        text: "Without an account, checks are not permanently saved – only in the browser. With an account, all checks are accessible across devices.",
      },
    ],
  },
  {
    id: "datenschutz",
    title: "Privacy & your data",
    blocks: [
      {
        type: "p",
        text: "Grundwächter only processes the data necessary for the app to function. The application complies with GDPR requirements.",
      },
      { type: "h2", text: "Data stored at a glance" },
      {
        type: "table",
        headers: ["Data", "Without account", "With account"],
        rows: [
          ["Check inputs", "Browser (localStorage)", "Encrypted database"],
          ["Check results", "Browser (localStorage)", "Encrypted database"],
          ["Objection deadlines", "Not saved", "Encrypted database"],
          ["Email address", "Not collected", "Login & reminders only"],
        ],
      },
      { type: "h2", text: "Your GDPR rights" },
      {
        type: "ul",
        items: [
          "Access & export: Profile → Export data (JSON download of all saved data)",
          "Deletion: Profile → Delete account (deletes all data irreversibly)",
          "Correction: By repeating the check with corrected values",
        ],
      },
      {
        type: "note",
        text: "Further information can be found in our Privacy Policy (link in the footer).",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export function getHandbuchSections(locale: string): HandbuchSection[] {
  return locale === "en" ? EN_SECTIONS : DE_SECTIONS;
}
