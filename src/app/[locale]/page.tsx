import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { DeadlineCalculator } from "@/components/home/DeadlineCalculator";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--muted-bg)] to-[var(--background)] px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-medium text-white mb-4">
            Kostenlos in Version 1
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 text-lg leading-8 text-[var(--muted)] max-w-2xl mx-auto">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/pruefen`}
              className="rounded-lg bg-[var(--primary)] px-8 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
            >
              {tCommon("startCheck")}
            </Link>
            <Link
              href={`/${locale}/hilfe`}
              className="rounded-lg border border-[var(--card-border)] px-8 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition-colors"
            >
              {tCommon("learnMore")}
            </Link>
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">{t("freeNotice")}</p>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 sm:grid-cols-3">
            <BenefitCard
              icon="🏛"
              title={t("benefit1Title")}
              text={t("benefit1Text")}
            />
            <BenefitCard
              icon="🔍"
              title={t("benefit2Title")}
              text={t("benefit2Text")}
            />
            <BenefitCard
              icon="📄"
              title={t("benefit3Title")}
              text={t("benefit3Text")}
            />
          </div>
        </div>
      </section>

      {/* Deadline Calculator */}
      <section className="bg-[var(--card)] border-y border-[var(--card-border)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {t("deadlineTitle")}
          </h2>
          <p className="text-sm text-[var(--muted)] mb-8">{t("deadlineText")}</p>
          <DeadlineCalculator />
        </div>
      </section>

      {/* Legal disclaimer */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4 text-xs text-[var(--muted)]">
          <strong>Rechtlicher Hinweis:</strong> Grundwächter ist ein
          informatorisches Prüftool und stellt keine Rechtsberatung dar. Generierte
          Einspruchsentwürfe ersetzen nicht die Beratung durch einen Rechtsanwalt oder
          Steuerberater. Die App arbeitet auf Basis Ihrer Eingaben – überprüfen Sie alle
          Angaben anhand Ihres Originalbescheids.
        </div>
      </section>
    </div>
  );
}

function BenefitCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-[var(--foreground)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-6">{text}</p>
    </div>
  );
}
