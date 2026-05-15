import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { verbleibendeTage } from "@/lib/berechnung/fristen";
import type { Database } from "@/types/database";

type PrueffallRow = Database["public"]["Tables"]["prueffaelle"]["Row"];
type FristRow = Database["public"]["Tables"]["fristen"]["Row"];
type PrueffallWithFristen = PrueffallRow & { fristen: FristRow[] };

type Props = { params: Promise<{ locale: string }> };

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("dashboard");
  const tCommon = await getTranslations("common");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const { data: prueffaelleRaw } = await supabase
    .from("prueffaelle")
    .select("*, fristen(*)")
    .order("created_at", { ascending: false })
    .limit(20);
  const prueffaelle = prueffaelleRaw as PrueffallWithFristen[] | null;

  const offeneFristen = prueffaelle?.flatMap((p) =>
    p.fristen?.filter((f) => verbleibendeTage(new Date(f.frist_datum)) >= 0) ?? []
  ) ?? [];

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Breadcrumb items={[{ label: "Startseite", href: `/${locale}` }, { label: t("title") }]} />

        <div className="mt-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{t("title")}</h1>
          <Link
            href={`/${locale}/pruefen`}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors"
          >
            + {t("newCheck")}
          </Link>
        </div>

        {/* Open deadlines */}
        {offeneFristen.length > 0 && (
          <section className="mt-8">
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">{t("openDeadlines")}</h2>
            <div className="space-y-2">
              {offeneFristen.map((frist) => {
                const tage = verbleibendeTage(new Date(frist.frist_datum));
                return (
                  <div
                    key={frist.id}
                    className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${
                      tage <= 7
                        ? "border-[var(--warning)] bg-amber-50 dark:bg-amber-950/20"
                        : "border-[var(--card-border)] bg-[var(--card)]"
                    }`}
                  >
                    <span>
                      Einspruchsfrist:{" "}
                      <strong>
                        {new Date(frist.frist_datum).toLocaleDateString("de-DE")}
                      </strong>
                    </span>
                    <span className={tage <= 7 ? "text-[var(--warning)] font-medium" : "text-[var(--muted)]"}>
                      {tage === 0 ? "Heute" : `${tage} ${tage === 1 ? "Tag" : "Tage"}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Saved checks */}
        <section className="mt-8">
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">{t("savedChecks")}</h2>
          {!prueffaelle || prueffaelle.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--card-border)] p-12 text-center">
              <p className="text-sm text-[var(--muted)]">{t("noChecksYet")}</p>
              <Link
                href={`/${locale}/pruefen`}
                className="mt-4 inline-block rounded-lg bg-[var(--primary)] px-6 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors"
              >
                {tCommon("startCheck")}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {prueffaelle.map((pf) => (
                <div
                  key={pf.id}
                  className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-medium text-[var(--foreground)]">
                      {pf.bundesland} - {pf.berechnungsmodell}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {new Date(pf.created_at).toLocaleDateString("de-DE")} |
                      Bescheid: {pf.bescheid_betrag} € | Abweichung:{" "}
                      <span
                        className={
                          pf.abweichungs_stufe === "erheblich"
                            ? "text-[var(--danger)]"
                            : pf.abweichungs_stufe === "gering"
                            ? "text-[var(--warning)]"
                            : "text-[var(--success)]"
                        }
                      >
                        {pf.abweichung_euro} €
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* DSGVO actions */}
        <section className="mt-12 border-t border-[var(--card-border)] pt-6">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">Datenverwaltung</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/profil/datenexport`}
              className="rounded-lg border border-[var(--card-border)] px-4 py-2 text-xs font-medium hover:bg-[var(--muted-bg)] transition-colors"
            >
              Daten exportieren (JSON)
            </Link>
            <Link
              href={`/${locale}/profil`}
              className="rounded-lg border border-[var(--card-border)] px-4 py-2 text-xs font-medium hover:bg-[var(--muted-bg)] transition-colors"
            >
              Profil & Konto
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
