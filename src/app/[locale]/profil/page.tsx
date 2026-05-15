import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Database } from "@/types/database";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type Props = { params: Promise<{ locale: string }> };

export default async function ProfilPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/auth/login`);

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  const profile = profileRaw as ProfileRow | null;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <Breadcrumb
          items={[
            { label: "Startseite", href: `/${locale}` },
            { label: "Dashboard", href: `/${locale}/dashboard` },
            { label: "Profil" },
          ]}
        />
        <h1 className="mt-6 text-2xl font-bold text-[var(--foreground)] mb-6">Mein Profil</h1>

        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] divide-y divide-[var(--card-border)]">
          <div className="px-4 py-3 flex justify-between text-sm">
            <span className="text-[var(--muted)]">E-Mail</span>
            <span className="font-medium">{user.email}</span>
          </div>
          {profile?.full_name && (
            <div className="px-4 py-3 flex justify-between text-sm">
              <span className="text-[var(--muted)]">Name</span>
              <span className="font-medium">{profile.full_name}</span>
            </div>
          )}
          <div className="px-4 py-3 flex justify-between text-sm">
            <span className="text-[var(--muted)]">Konto erstellt</span>
            <span className="font-medium">
              {new Date(user.created_at).toLocaleDateString("de-DE")}
            </span>
          </div>
        </div>

        {/* DSGVO actions */}
        <div className="mt-8 space-y-3">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">DSGVO-Rechte</h2>
          <form action={`/api/dsgvo/export`} method="GET">
            <button
              type="submit"
              className="w-full rounded-lg border border-[var(--card-border)] py-2.5 text-sm font-medium hover:bg-[var(--muted-bg)] transition-colors text-left px-4"
            >
              Alle meine Daten exportieren (JSON)
            </button>
          </form>
          <form action={`/${locale}/profil/konto-loeschen`}>
            <button
              type="submit"
              className="w-full rounded-lg border border-[var(--danger)] py-2.5 text-sm font-medium text-[var(--danger)] hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left px-4"
            >
              Konto und alle Daten löschen
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
