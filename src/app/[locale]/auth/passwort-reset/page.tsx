import { getTranslations } from "next-intl/server";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";

type Props = { params: Promise<{ locale: string }> };

export default async function PasswordResetPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("auth");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-8 shadow-sm">
        <h1 className="mb-2 text-xl font-bold text-[var(--foreground)]">{t("resetPasswordTitle")}</h1>
        <p className="mb-6 text-sm text-[var(--muted)]">
          Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link zum Zurücksetzen.
        </p>
        <PasswordResetForm locale={locale} />
      </div>
    </div>
  );
}
