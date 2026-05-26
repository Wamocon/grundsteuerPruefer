/**
 * Seeds 3 Prueffaelle for ErwinMoretz@gmail.com.
 * Run with: npx tsx scripts/seed-erwin.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TARGET_EMAIL = "ErwinMoretz@gmail.com";

async function findUser(): Promise<string> {
  const { data } = await sb.auth.admin.listUsers({ perPage: 1000 });
  const user = data?.users.find((u) => u.email?.toLowerCase() === TARGET_EMAIL.toLowerCase());
  if (!user) throw new Error(`User ${TARGET_EMAIL} not found. Please register first.`);
  return user.id;
}

async function seedPrueffaelle(userId: string): Promise<void> {
  const faelle = [
    {
      bundesland: "NW",
      berechnungsmodell: "bundesmodell",
      eingabe_daten: {
        step: 2,
        bundesland: "NW",
        bodenrichtwert: 280,
        grundstuecksflaeche: 520,
        wohnflaeche: 145,
        nutzungsart: "wohnen",
        baujahr: 1995,
        hebesatz: 600,
        bescheidBetrag: 845,
        bescheidDatum: "2026-04-10",
      },
      bescheid_betrag: 845,
      berechneter_betrag: 718.30,
      abweichung_euro: 126.70,
      abweichung_prozent: 17.64,
      abweichungs_stufe: "erheblich",
      bescheid_datum: "2026-04-10",
      einspruch_frist: "2026-05-12",
      notizen: "Bundesmodell - Einfamilienhaus Koeln, erhebliche Abweichung",
    },
    {
      bundesland: "BY",
      berechnungsmodell: "bayernmodell",
      eingabe_daten: {
        step: 2,
        bundesland: "BY",
        grundstuecksflaeche: 350,
        gebaeudeflaeche: 110,
        hebesatz: 490,
        bescheidBetrag: 395,
        bescheidDatum: "2026-05-05",
      },
      bescheid_betrag: 395,
      berechneter_betrag: 372.85,
      abweichung_euro: 22.15,
      abweichung_prozent: 5.94,
      abweichungs_stufe: "gering",
      bescheid_datum: "2026-05-05",
      einspruch_frist: "2026-06-06",
      notizen: "Bayern-Modell - Reihenhaus Nuernberg, geringe Abweichung",
    },
    {
      bundesland: "HH",
      berechnungsmodell: "hamburgmodell",
      eingabe_daten: {
        step: 2,
        bundesland: "HH",
        wohnflaeche: 95,
        wohnlage: "gut",
        hebesatz: 975,
        bescheidBetrag: 680,
        bescheidDatum: "2026-05-20",
      },
      bescheid_betrag: 680,
      berechneter_betrag: 680,
      abweichung_euro: 0,
      abweichung_prozent: 0,
      abweichungs_stufe: "keine",
      bescheid_datum: "2026-05-20",
      einspruch_frist: null,
      notizen: "Hamburg-Modell - Wohnung gute Lage, kein Einspruch noetig",
    },
  ];

  for (const fall of faelle) {
    const { data: inserted, error } = await sb
      .from("prueffaelle")
      .insert({ user_id: userId, ...fall })
      .select("id")
      .single();

    if (error) {
      console.warn(`  ! Failed (${fall.bundesland}): ${error.message}`);
      continue;
    }
    console.log(`  + Prueffall ${fall.bundesland} [${fall.abweichungs_stufe}]: ${inserted.id}`);

    if (fall.einspruch_frist) {
      const { error: fErr } = await sb.from("fristen").insert({
        user_id: userId,
        prueffall_id: inserted.id,
        frist_datum: fall.einspruch_frist,
      });
      if (fErr) console.warn(`    ! Frist failed: ${fErr.message}`);
      else console.log(`    + Frist: ${fall.einspruch_frist}`);
    }
  }
}

async function main() {
  console.log(`\n=== Seed Prueffaelle for ${TARGET_EMAIL} ===\n`);
  console.log(`Target: ${SUPABASE_URL}\n`);

  const userId = await findUser();
  console.log(`User found: ${userId}\n`);

  await seedPrueffaelle(userId);
  console.log("\n=== Done ===\n");
}

main().catch((err) => {
  console.error("\nSeed failed:", err);
  process.exit(1);
});
