import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const { origin } = new URL(request.url);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/${locale}/auth/login`);
  }

  // Delete the user from Supabase Auth (cascade deletes profiles + prueffaelle + fristen via FK)
  const adminClient = await createAdminClient();
  const { error } = await adminClient.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.redirect(`${origin}/${locale}/profil?error=loeschen_fehlgeschlagen`);
  }

  // Sign out the current session
  await supabase.auth.signOut();

  return NextResponse.redirect(`${origin}/${locale}?deleted=1`);
}
