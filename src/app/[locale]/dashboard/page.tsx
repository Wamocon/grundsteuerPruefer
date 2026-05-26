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

  const { data: prueffaelleRaw, error: queryError } = await supabase
    .from("prueffaelle")
    .select("*, fristen(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (queryError) {
    console.error("Dashboard query error:", queryError.message);
  }

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
                // F-08: Entire row is clickable - links to re-run check
                <div
                  key={pf.id}
                  className="group rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 flex items-center justify-between text-sm hover:border-[var(--primary)] hover:shadow-sm transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--foreground)]">
                      {pf.bundesland} - {pf.berechnungsmodell}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      {new Date(pf.created_at).toLocaleDateString("de-DE")} |{" "}
                      Bescheid: {pf.bescheid_betrag} \u20ac | Abweichung:{" "}
                      <span
                        className={
                          pf.abweichungs_stufe === "erheblich"
                            ? "text-[var(--danger)]"
                            : pf.abweichungs_stufe === "gering"
                            ? "text-[var(--warning)]"
                            : "text-[var(--success)]"
                        }
                      >
                        {pf.abweichung_euro} \u20ac
                      </span>
                    </p>
                  </div>
                  {/* F-08: Repeat check link */}
                  <Link
                    href={`/${locale}/pruefen`}
                    className="ml-4 shrink-0 rounded-md border border-[var(--card-border)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] group-hover:border-[var(--primary)] group-hover:text-[var(--primary)] transition-colors"
                    aria-label={`Pr\u00fcffall f\u00fcr ${pf.bundesland} wiederholen`}
                  >
                    {t("repeatCheck")}
                  </Link>
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
