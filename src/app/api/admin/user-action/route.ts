import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify caller is admin
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  const { data: callerProfile } = await sb
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single() as { data: { is_admin: boolean } | null; error: unknown };

  if (!callerProfile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json() as { userId: string; action: "disable" | "enable" | "delete" };
  const { userId, action } = body;

  if (!userId || !action) {
    return NextResponse.json({ error: "Missing userId or action" }, { status: 400 });
  }

  // Prevent admin from acting on themselves
  if (userId === user.id) {
    return NextResponse.json({ error: "Cannot act on own account" }, { status: 400 });
  }

  const adminClient = await createAdminClient();

  if (action === "disable") {
    const { error } = await adminClient.auth.admin.updateUserById(userId, { ban_duration: "876600h" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (action === "enable") {
    const { error } = await adminClient.auth.admin.updateUserById(userId, { ban_duration: "none" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (action === "delete") {
    const { error } = await adminClient.auth.admin.deleteUser(userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
