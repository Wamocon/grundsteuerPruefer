import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data, error } = await sb.from("prueffaelle").select("id, bundesland, abweichungs_stufe, created_at").eq("user_id", "8a421d5e-d203-46af-82e4-bbe88ac76996");
  console.log("Error:", error);
  console.log("Count:", data?.length);
  console.log("Data:", JSON.stringify(data, null, 2));
}

main();
