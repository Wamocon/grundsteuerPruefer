# Grundwächter - Produkthandbuch

> Dieses Handbuch beschreibt die Geschäftslogik, Features und Nutzerflüsse von Grundwächter.
> Es ist die zentrale Referenz für KI-Agenten (@planner, @developer, @reviewer) und Entwickler.
> Immer aktuell halten, wenn sich user-facing Verhalten ändert.

---

## 1. Produktübersicht

**Grundwächter** ist ein kostenloses Web-Tool, das Eigentümern hilft, ihren Grundsteuerbescheid auf Korrektheit zu prüfen. Die App rechnet den Bescheid nach den 4 gesetzlichen Berechnungsmodellen nach und generiert bei Abweichung einen druckfertigen Einspruchsentwurf.

### Kernversprechen
- Kein Fachwissen nötig
- Alle 4 Berechnungsmodelle abgedeckt
- Einspruchsentwurf in unter 5 Minuten
- Version 1 vollständig kostenlos, kein Pflicht-Login

### Zielgruppe
Privateigentümer und kleine Vermieter in Deutschland, die einen neuen Grundsteuerbescheid erhalten haben und prüfen wollen, ob der Betrag korrekt berechnet wurde.

---

## 2. Berechnungsmodelle

Die Modellauswahl erfolgt automatisch anhand des Bundeslandes (Anforderung K-01).

| Modell | Bundesländer | Rechtsgrundlage |
|---|---|---|
| **Bundesmodell** | BB, BE, HB, HE, MV, NI, NW, RP, SH, SL, ST, TH | §§ 219-228 BewG |
| **Bayern-Modell** | BY | BayGrStG |
| **Baden-Württemberg-Modell** | BW | LGrStG BW |
| **Hamburg-Modell** | HH | HmbGrStG |

### Bundesmodell
Berechnung: Grundsteuerwert (Bodenwert + Gebäudewert) × Steuermesszahl × Hebesatz
- Steuermesszahl Wohnnutzung: 0,031 %
- Steuermesszahl Gewerbe: 0,034 %

### Bayern-Modell
Flächenbasiertes Modell (Äquivalenzzahlen). Bodenwert spielt keine Rolle.
- Grundstücksfläche × Äquivalenzzahl Grundstück
- Gebäudefläche × Äquivalenzzahl Gebäude
- Summe × Steuermesszahl × Hebesatz

### Baden-Württemberg-Modell
Reines Bodenwertmodell.
- Grundstücksfläche × Bodenrichtwert × Steuermesszahl × Hebesatz
- Gebäudewert wird ignoriert

### Hamburg-Modell
Wohnflächenbasiertes Modell.
- Wohnfläche × Äquivalenzzahl × Lagefaktor × Steuermesszahl × Hebesatz

### Abweichungsstufen (Anforderung P-05)
| Stufe | Bedingung | Anzeige |
|---|---|---|
| `keine` | Abweichung < 5 € | Grün - kein Handlungsbedarf |
| `gering` | 5 € bis < 50 € | Orange - optional prüfen |
| `erheblich` | >= 50 € | Rot - Einspruch empfohlen |

Schwellenwert für `erheblich`: **50 €** (Konstante `ABWEICHUNG_SCHWELLE_ERHEBLICH` in `src/lib/berechnung/types.ts`)

---

## 3. Hauptfunktionen (Version 1)

### 3.1 Prüfassistent-Wizard (`/pruefen`)
3-schrittiger geführter Prozess:

**Schritt 0 - Bundesland wählen**
- Alle 16 Bundesländer auswählbar
- Modell wird automatisch bestimmt
- Fortschrittsbalken startet bei 0 %

**Schritt 1 - Eingabe**
- Eingabefelder variieren je nach Modell (bundeslandspezifisch)
- Pflichtfelder: Bescheid-Betrag (€), modellspezifische Flächenangaben, Hebesatz
- Wizard-Zustand wird in `localStorage` persistiert (K-05) - Abbruch und Fortführung möglich
- Validierung mit sofortiger Fehlermeldung pro Feld

**Schritt 2 - Ergebnis**
- Berechneter Jahresbetrag vs. Bescheid-Betrag
- Abweichung in Euro und Prozent mit farblicher Stufe
- Erklärung in verständlicher Sprache (P-07): "Das Finanzamt hat X m² angenommen..."
- Detaillierte Rechenschritte als aufklappbare Tabelle (transparent, kein Black-Box)
- CTA "Einspruch generieren" bei erheblicher Abweichung

Bei eingeloggten Nutzern: Prüffall wird automatisch in Supabase gespeichert (best-effort, silent fail).

### 3.2 Einspruchsgenerator (`/einspruch`)
- Nur eingeloggt zugänglich (Anforderung B-03)
- Generiert rechtlich strukturierten Einspruchsentwurf nach § 355 AO
- Enthält: Absenderdaten, Aktenzeichen, Einspruchsbegründung, Berechnungsdetails
- Export als PDF (inkl. Anlage 1 mit Rechenschritten)
- Hinweis: Kein Rechtsberatungsersatz - Steuerberater empfohlen

### 3.3 Dashboard (`/dashboard`)
- Nur eingeloggt zugänglich - Redirect auf Login wenn unauthentifiziert
- Zeigt alle gespeicherten Prüffälle des Nutzers (absteigend nach Datum, max. 20)
- Zeigt offene Einspruchsfristen mit Countdown (Warnung bei <= 7 Tagen)
- "Erneut prüfen"-Link je Prüffall (F-08)
- "Neuen Prüffall starten"-Button

### 3.4 Fristrechner (Homepage-Widget)
- Berechnet Einspruchsfrist automatisch bei Datumseingabe (F-11, kein Button nötig)
- Einspruchsfrist: 1 Monat nach Bescheidbekanntgabe (§ 355 AO)
- Bekanntgabe bei Postversand: +3 Tage (§ 122 Abs. 2 AO)
- Zeigt verbleibende Tage mit Farbindikator (rot bei < 7 Tage)

### 3.5 Authentifizierung
- Provider: Supabase Auth (E-Mail + Passwort)
- Seiten: Login (`/auth/login`), Register (`/auth/register`), Passwort-Reset (`/auth/passwort-reset`)
- E-Mail-Bestätigung erforderlich nach Registrierung
- Lokalisierte Fehlermeldungen (F-06): Kein roher Supabase-Fehlertext
- Passwort-Toggle sichtbar/versteckt (F-07)
- Spinner beim Submit (F-10)
- Konto löschen unter Profil (`/profil/konto-loeschen`)

### 3.6 Admin-Bereich (`/admin`)
- Nur für Nutzer mit `is_admin = true` in der Profiles-Tabelle
- Zeigt alle registrierten Nutzer
- Sperren/Deaktivieren von Nutzern (B-05)

---

## 4. Navigation

### Desktop (>= 768px)
- Logo (-> Startseite)
- Prüfen (immer sichtbar)
- Meine Prüfungen (nur eingeloggt -> Dashboard)
- Hilfe (immer sichtbar)
- Sprachumschalter (DE/EN)
- Dark/Light Mode Toggle
- Eingeloggt: Nutzername -> Dashboard + Abmelden-Button
- Nicht eingeloggt: Anmelden-Button

### Mobile (< 768px)
- Hamburger-Menü (F-03)
- Prüfen
- Meine Prüfungen (nur eingeloggt)
- Hilfe
- Trennlinie
- Eingeloggt: E-Mail-Anzeige + Abmelden
- Nicht eingeloggt: Anmelden

---

## 5. Datenmodell (Supabase)

### Tabelle `profiles`
| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid (FK auth.users) | Primärschlüssel |
| `email` | text | E-Mail-Adresse |
| `is_admin` | boolean | Admin-Flag |
| `is_blocked` | boolean | Gesperrt-Flag |
| `created_at` | timestamptz | Erstellungsdatum |

### Tabelle `prueffaelle`
| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid | Primärschlüssel |
| `user_id` | uuid (FK profiles) | Eigentümer |
| `bundesland` | text | Bundesland-Kürzel (BE, BY, ...) |
| `berechnungsmodell` | text | bundesmodell / bayernmodell / bawuemodell / hamburgmodell |
| `bescheid_betrag` | numeric | Betrag laut Bescheid (€) |
| `berechneter_betrag` | numeric | Von App berechneter Betrag (€) |
| `abweichung_euro` | numeric | Differenz (€) |
| `abweichungs_stufe` | text | keine / gering / erheblich |
| `eingabe_daten` | jsonb | Alle Wizard-Eingaben |
| `created_at` | timestamptz | Erstellungsdatum |

### Tabelle `fristen`
| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid | Primärschlüssel |
| `prueffall_id` | uuid (FK prueffaelle) | Zugehöriger Prüffall |
| `user_id` | uuid (FK profiles) | Eigentümer |
| `frist_datum` | date | Ablaufdatum der Einspruchsfrist |
| `bescheid_datum` | date | Datum des Bescheids |
| `erinnerung_gesendet` | boolean | E-Mail-Erinnerung bereits gesendet? |

Alle Tabellen sind per **Row Level Security (RLS)** geschützt - Nutzer sehen nur ihre eigenen Daten.

---

## 6. Nutzerflüsse

### Fluss A - Prüfung ohne Konto
1. Startseite -> "Prüfung starten"
2. Wizard: Bundesland -> Eingabe -> Ergebnis
3. Ergebnis wird angezeigt, kein Speichern
4. Bei erheblicher Abweichung: CTA "Einspruch generieren" -> Redirect auf Login

### Fluss B - Prüfung mit Konto
1. Login -> Dashboard oder direkt Prüfen
2. Wizard: gleich wie Fluss A
3. Prüffall wird nach Schritt 2 automatisch gespeichert (silent)
4. Dashboard zeigt gespeicherten Prüffall mit "Erneut prüfen"

### Fluss C - Einspruch generieren
1. Muss eingeloggt sein (Redirect wenn nicht)
2. Prüffall aus Dashboard oder nach Wizard-Ergebnis
3. Eingabe Absenderdaten (Name, Adresse, Aktenzeichen)
4. PDF-Vorschau und Download

### Fluss D - Frist prüfen (Homepage)
1. Datum des Bescheids eingeben
2. Frist wird sofort berechnet (kein Button-Klick nötig)
3. Ampel-Anzeige: grün/gelb/rot je nach verbleibenden Tagen

---

## 7. Internationalisierung (i18n)

- Framework: next-intl (App Router)
- Sprachen: Deutsch (DE, Standard), Englisch (EN)
- Routenpräfix: `/{locale}/...` (z.B. `/de/pruefen`, `/en/pruefen`)
- Übersetzungsdateien: `messages/de.json`, `messages/en.json`
- Alle UI-Strings ausschließlich über `t()` - keine hartcodierten deutschen Strings in Komponenten
- Sprachumschalter im Header wechselt zur Root-URL der anderen Sprache (`/${otherLocale}`)

---

## 8. Technische Entscheidungen

| Entscheidung | Begründung |
|---|---|
| FOUC-Prevention via Inline-Script (F-01) | `localStorage`-Theme vor erstem Paint lesen - verhindert Aufflackern |
| Skip-Nav-Link (F-14) | Barrierefreiheit - screen reader und keyboard navigation |
| SVG-Icons statt Emoji (F-15) | Konsistente Darstellung über alle Betriebssysteme und Browser |
| Lokalisierte Auth-Fehler (F-06) | Kein Supabase-internen Fehlertext dem Nutzer zeigen |
| Wizard-Persistierung in localStorage (K-05) | Abbruch ohne Datenverlust - Wizard nach Reload fortsetzbar |
| Silent Supabase-Speicherung im Wizard | Kein Login-Zwang - Prüfung funktioniert auch ohne Konto |

---

## 9. Bekannte Einschränkungen (Version 1)

- Sachsen (SN) fehlt in der Modell-Map (nutzt Bundesmodell - korrekt)
- E-Mail-Fristenerinnerungen (E-06) - implementiert als Cron-Route, aber Resend-Integration ausstehend
- Einspruch-Seite erfordert Login (B-03) - korrekt implementiert
- Admin sperren/deaktivieren (B-05) - UI vorhanden, Backend-Logik ausstehend

---

## 10. Deployment

- Hosting: Vercel
- Supabase-Projekt: `oomxrcusxszwdekhthms.supabase.co`
- CI/CD: GitHub Actions (`.github/workflows/deploy.yml`)
- Branch `main` -> automatisches Deployment auf Production
- Umgebungsvariablen in Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
