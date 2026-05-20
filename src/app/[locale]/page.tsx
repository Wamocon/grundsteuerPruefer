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
            {t("freeBadge")}
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
              icon={<BuildingIcon />}
              title={t("benefit1Title")}
              text={t("benefit1Text")}
            />
            <BenefitCard
              icon={<SearchIcon />}
              title={t("benefit2Title")}
              text={t("benefit2Text")}
            />
            <BenefitCard
              icon={<DocumentIcon />}
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
          <strong>{t("legalNoticeTitle")}</strong>{" "}{t("legalNoticeText")}
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
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6">
      <div className="mb-3 h-8 w-8 text-[var(--primary)]">{icon}</div>
      <h3 className="text-base font-semibold text-[var(--foreground)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-6">{text}</p>
    </div>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
      <path d="M3 21h18" />
      <path d="M3 7l9-4 9 4" />
      <path d="M3 21V7" />
      <path d="M21 21V7" />
      <rect x="9" y="11" width="6" height="10" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
