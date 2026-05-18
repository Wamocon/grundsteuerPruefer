import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

type Props = { params: Promise<{ locale: string }> };

export default async function KontoLoeschenPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/auth/login`);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <Breadcrumb
          items={[
            { label: "Startseite", href: `/${locale}` },
            { label: "Profil", href: `/${locale}/profil` },
            { label: "Konto löschen" },
          ]}
        />
        <h1 className="mt-6 text-2xl font-bold text-[var(--foreground)] mb-2">Konto endgültig löschen</h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          Alle Ihre Daten (Prüffälle, Fristen, Profil) werden unwiderruflich gelöscht.
          Diese Aktion kann nicht rückgängig gemacht werden.
        </p>

        <div className="rounded-xl border border-[var(--danger)] bg-red-50 dark:bg-red-950/20 px-4 py-4 mb-6 text-sm text-[var(--danger)]">
          <strong>Achtung:</strong> Alle Prüffälle, Fristen und Profildaten werden dauerhaft gelöscht.
          Sie werden anschließend automatisch abgemeldet.
        </div>

        <form action={`/${locale}/profil/konto-loeschen/bestaetigen`} method="POST">
          <button
            type="submit"
            className="w-full rounded-lg bg-[var(--danger)] py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Ja, mein Konto und alle Daten endgültig löschen
          </button>
        </form>
        <a
          href={`/${locale}/profil`}
          className="mt-3 block text-center text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          Abbrechen
        </a>
      </div>
    </div>
  );
}
