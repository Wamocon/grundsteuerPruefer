import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [{ data: prueffaelle }, { data: fristen }, { data: profile }] =
    await Promise.all([
      supabase.from("prueffaelle").select("*").eq("user_id", user.id),
      supabase.from("fristen").select("*").eq("user_id", user.id),
      supabase.from("profiles").select("*").eq("id", user.id).single(),
    ]);

  const exportData = {
    exportDatum: new Date().toISOString(),
    nutzer: {
      id: user.id,
      email: user.email,
      erstelltAm: user.created_at,
      profil: profile,
    },
    prueffaelle: prueffaelle ?? [],
    fristen: fristen ?? [],
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="grundwaechter-daten-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}
