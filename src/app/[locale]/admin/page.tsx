import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
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
  const users = usersRaw as Pick<ProfileRow, "id" | "email" | "full_name" | "is_admin" | "created_at">[] | null;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Breadcrumb
          items={[
            { label: "Startseite", href: `/${locale}` },
            { label: "Administration" },
          ]}
        />
        <h1 className="mt-6 text-2xl font-bold text-[var(--foreground)] mb-6">Administration</h1>

        <div className="rounded-xl border border-[var(--card-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--muted-bg)]">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--muted)]">E-Mail</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--muted)]">Name</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--muted)]">Admin</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--muted)]">Erstellt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--card-border)]">
              {users?.map((u) => (
                <tr key={u.id} className="hover:bg-[var(--muted-bg)]">
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2 text-[var(--muted)]">{u.full_name ?? "-"}</td>
                  <td className="px-4 py-2">
                    {u.is_admin ? (
                      <span className="text-xs font-medium text-[var(--primary)]">Admin</span>
                    ) : (
                      <span className="text-xs text-[var(--muted)]">Nutzer</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-[var(--muted)]">
                    {new Date(u.created_at).toLocaleDateString("de-DE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
