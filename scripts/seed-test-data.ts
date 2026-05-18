/**
 * Seed script: applies migration + creates test users and sample Prueffaelle.
 * Run with: npm run seed
 */
import { createClient } from "@supabase/supabase-js";
import pg from "pg";
import * as fs from "fs";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DATABASE_URL = process.env.DATABASE_URL ?? "";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("ERROR: Missing env vars. Check .env.local for NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function applyMigration(): Promise<void> {
  const migrationPath = path.join(__dirname, "..", "supabase", "migrations", "20260515000001_initial_schema.sql");
  const sql = fs.readFileSync(migrationPath, "utf-8");

  if (!DATABASE_URL) {
    console.log("  No DATABASE_URL set - skipping migration.");
    console.log("  Please apply the migration manually in the Supabase SQL Editor:");
    console.log("  https://supabase.com/dashboard/project/oomxrcusxszwdekhthms/sql/new\n");
    return;
  }

  const client = new pg.Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("  Connected to Postgres");
  try {
    await client.query(sql);
    console.log("  Migration applied");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("already exists")) {
      console.log("  Tables already exist - OK");
    } else {
      throw err;
    }
  } finally {
    await client.end();
  }
}

async function upsertUser(email: string, password: string, fullName: string, isAdmin: boolean): Promise<string> {
  const { data: listData } = await sb.auth.admin.listUsers({ perPage: 1000 });
  const existing = listData?.users.find((u) => u.email === email);
  let userId: string;
  if (existing) {
    userId = existing.id;
    await sb.auth.admin.updateUserById(userId, { password, email_confirm: true });
    console.log(`  ~ Updated: ${email}`);
  } else {
    const { data, error } = await sb.auth.admin.createUser({ email, password, email_confirm: true });
    if (error || !data.user) throw new Error(`Failed to create ${email}: ${error?.message}`);
    userId = data.user.id;
    console.log(`  + Created: ${email} (${userId})`);
  }
  const { error: profileErr } = await (sb as any)
    .from("profiles")
    .upsert({ id: userId, email, full_name: fullName, is_admin: isAdmin, updated_at: new Date().toISOString() });
  if (profileErr) {
    console.warn(`  ! Profile warning: ${profileErr.message}`);
  } else {
    console.log(`  + Profile set (admin=${isAdmin})`);
  }
  return userId;
}

async function seedPrueffaelle(userId: string): Promise<void> {
  const faelle = [
    {
      bundesland: "NW", berechnungsmodell: "bundesmodell",
      eingabe_daten: { step: 2, bundesland: "NW", bodenrichtwert: 320, grundstuecksflaeche: 450, wohnflaeche: 130, nutzungsart: "wohnen", baujahr: 1988, hebesatz: 550, bescheidBetrag: 720, bescheidDatum: "2026-02-15" },
      bescheid_betrag: 720, berechneter_betrag: 612.45, abweichung_euro: 107.55, abweichung_prozent: 17.56, abweichungs_stufe: "erheblich",
      bescheid_datum: "2026-02-15", einspruch_frist: "2026-03-19",
      notizen: "Bundesmodell - Einfamilienhaus NRW (Testfall - Frist abgelaufen)",
    },
    {
      bundesland: "BY", berechnungsmodell: "bayernmodell",
      eingabe_daten: { step: 2, bundesland: "BY", grundstuecksflaeche: 400, gebaeudeflaeche: 130, hebesatz: 535, bescheidBetrag: 480, bescheidDatum: "2026-04-01" },
      bescheid_betrag: 480, berechneter_betrag: 433.35, abweichung_euro: 46.65, abweichung_prozent: 10.76, abweichungs_stufe: "gering",
      bescheid_datum: "2026-04-01", einspruch_frist: "2026-05-04",
      notizen: "Bayern-Modell - Wohngebaeude Muenchen (Testfall - Frist bald)",
    },
    {
      bundesland: "BW", berechnungsmodell: "bawuemodell",
      eingabe_daten: { step: 2, bundesland: "BW", bodenrichtwert: 800, grundstuecksflaeche: 300, hebesatz: 520, bescheidBetrag: 1750, bescheidDatum: "2026-05-01" },
      bescheid_betrag: 1750, berechneter_betrag: 1622.40, abweichung_euro: 127.60, abweichung_prozent: 7.87, abweichungs_stufe: "erheblich",
      bescheid_datum: "2026-05-01", einspruch_frist: "2026-06-04",
      notizen: "BaWue-Modell - Stuttgart Wohngrundstuck (Testfall - Frist in Zukunft)",
    },
    {
      bundesland: "HH", berechnungsmodell: "hamburgmodell",
      eingabe_daten: { step: 2, bundesland: "HH", wohnflaeche: 80, wohnlage: "normal", hebesatz: 975, bescheidBetrag: 546, bescheidDatum: "2026-05-10" },
      bescheid_betrag: 546, berechneter_betrag: 546, abweichung_euro: 0, abweichung_prozent: 0, abweichungs_stufe: "keine",
      bescheid_datum: "2026-05-10", einspruch_frist: null,
      notizen: "Hamburg-Modell - Wohnung normale Lage (Testfall - kein Einspruch noetig)",
    },
  ];

  for (const fall of faelle) {
    const { data: inserted, error } = await (sb as any)
      .from("prueffaelle").insert({ user_id: userId, ...fall }).select("id").single();
    if (error) { console.warn(`  ! Failed (${fall.bundesland}): ${error.message}`); continue; }
    console.log(`  + Prueffall ${fall.bundesland} [${fall.abweichungs_stufe}]: ${inserted.id}`);
    if (fall.einspruch_frist) {
      const { error: fErr } = await (sb as any).from("fristen").insert({
        user_id: userId, prueffall_id: inserted.id, frist_datum: fall.einspruch_frist,
      });
      if (fErr) { console.warn(`    ! Frist failed: ${fErr.message}`); }
      else { console.log(`    + Frist: ${fall.einspruch_frist}`); }
    }
  }
}

async function main() {
  console.log("\n=== Grundwaechter Seed Script ===\n");
  console.log(`Target: ${SUPABASE_URL}\n`);

  console.log("1. Applying database migration...");
  await applyMigration();

  console.log("\n2. Creating test users...");
  await upsertUser("admin@grundwaechter.de", "GrundAdmin2026!", "Max Muster (Admin)", true);
  const testUserId = await upsertUser("test@grundwaechter.de", "GrundTest2026!", "Anna Testerin", false);

  console.log("\n3. Seeding Prueffaelle...");
  await seedPrueffaelle(testUserId);

  console.log("\n=== Done ===\n");
  console.log("Test accounts:");
  console.log("  Admin: admin@grundwaechter.de  / GrundAdmin2026!");
  console.log("  User:  test@grundwaechter.de   / GrundTest2026!");
  console.log("\nApp: http://localhost:3001/de/auth/login\n");
}

main().catch((err) => { console.error("\nSeed failed:", err); process.exit(1); });
