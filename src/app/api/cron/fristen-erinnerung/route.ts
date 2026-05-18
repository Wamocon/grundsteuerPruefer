import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * E-06: Fristenerinnerungen per E-Mail.
 * Schickt Erinnerungen 7 Tage und 1 Tag vor Fristablauf via Resend.
 *
 * Wird via Cron-Job aufgerufen (z.B. täglich 08:00 Uhr via Vercel Cron oder externem Dienst).
 * Absicherung: CRON_SECRET Header muss gesetzt sein.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  const adminClient = await createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = adminClient as any;
  const heute = new Date();
  const heute_str = heute.toISOString().split("T")[0];

  const in7Tagen = new Date(heute);
  in7Tagen.setDate(in7Tagen.getDate() + 7);
  const in7_str = in7Tagen.toISOString().split("T")[0];

  const in1Tag = new Date(heute);
  in1Tag.setDate(in1Tag.getDate() + 1);
  const in1_str = in1Tag.toISOString().split("T")[0];

  // Fetch fristen that are due for reminders
  const { data: fristen7 } = await sb
    .from("fristen")
    .select("id, user_id, frist_datum, prueffall_id")
    .eq("frist_datum", in7_str)
    .eq("erinnerung_7_tage_gesendet", false) as { data: Array<{ id: string; user_id: string; frist_datum: string; prueffall_id: string }> | null };

  const { data: fristen1 } = await sb
    .from("fristen")
    .select("id, user_id, frist_datum, prueffall_id")
    .eq("frist_datum", in1_str)
    .eq("erinnerung_1_tag_gesendet", false) as { data: Array<{ id: string; user_id: string; frist_datum: string; prueffall_id: string }> | null };

  let sent = 0;

  // Helper to send one reminder email
  async function sendReminder(
    userId: string,
    fristId: string,
    fristDatum: string,
    tage: 7 | 1
  ) {
    // Get user email from profiles
    const { data: profile } = await sb
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single() as { data: { email: string } | null; error: unknown };

    if (!profile?.email) return;

    const fristFormatiert = new Date(fristDatum).toLocaleDateString("de-DE", {
      day: "2-digit", month: "long", year: "numeric",
    });

    const subject =
      tage === 7
        ? `Erinnerung: Ihre Einspruchsfrist läuft in 7 Tagen ab`
        : `Letzte Erinnerung: Ihre Einspruchsfrist läuft morgen ab!`;

    const html = `
      <p>Sehr geehrte/r Nutzer/in,</p>
      <p>dies ist eine Erinnerung: Ihre Einspruchsfrist gegen den Grundsteuerbescheid läuft
      am <strong>${fristFormatiert}</strong> ab – das sind noch ${tage === 7 ? "7 Tage" : "1 Tag"}.</p>
      <p>Melden Sie sich in Ihrem Grundwächter-Dashboard an, um den Einspruchsentwurf
      herunterzuladen und ggf. einzureichen:</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://grundwaechter.de"}/de/dashboard">
        Zum Dashboard
      </a></p>
      <p><strong>Wichtiger Hinweis:</strong> Der generierte Einspruchsentwurf stellt keine
      Rechtsberatung dar. Lassen Sie das Schreiben vor der Einreichung durch einen
      Rechtsanwalt oder Steuerberater prüfen.</p>
      <p>Mit freundlichen Grüßen<br/>Ihr Grundwächter-Team (WAMOCON GmbH)</p>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Grundwächter <noreply@grundwaechter.de>",
        to: [profile.email],
        subject,
        html,
      }),
    });

    if (!response.ok) return;

    // Mark as sent
    const updateField = tage === 7 ? "erinnerung_7_tage_gesendet" : "erinnerung_1_tag_gesendet";
    await sb.from("fristen").update({ [updateField]: true }).eq("id", fristId);
    sent++;
  }

  // Send 7-day reminders
  for (const frist of fristen7 ?? []) {
    await sendReminder(frist.user_id, frist.id, frist.frist_datum, 7);
  }

  // Send 1-day reminders
  for (const frist of fristen1 ?? []) {
    await sendReminder(frist.user_id, frist.id, frist.frist_datum, 1);
  }

  return NextResponse.json({ ok: true, sent, date: heute_str });
}
