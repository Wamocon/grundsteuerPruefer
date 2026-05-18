import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AdminUserTable } from "@/components/admin/AdminUserTable";
import type { Database } from "@/types/database";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type Props = { params: Promise<{ locale: string }> };

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/auth/login`);

  // Verify admin
  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  const profile = profileRaw as Pick<ProfileRow, "is_admin"> | null;

  if (!profile?.is_admin) redirect(`/${locale}/dashboard`);

  const adminClient = await createAdminClient();
  const { data: usersRaw } = await adminClient
    .from("profiles")
    .select("id, email, full_name, is_admin, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  const users = (usersRaw ?? []) as Pick<ProfileRow, "id" | "email" | "full_name" | "is_admin" | "created_at">[];

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Breadcrumb
          items={[
            { label: "Startseite", href: `/${locale}` },
            { label: "Administration" },
          ]}
        />
        <h1 className="mt-6 text-2xl font-bold text-[var(--foreground)] mb-2">Administration</h1>
        <p className="text-sm text-[var(--muted)] mb-6">{users.length} Nutzer registriert</p>

        <AdminUserTable users={users} currentUserId={user.id} />
      </div>
    </div>
  );
}
