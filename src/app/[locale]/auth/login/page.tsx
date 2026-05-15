import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/components/auth/LoginForm";

type Props = { params: Promise<{ locale: string }> };

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("auth");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-8 shadow-sm">
        <h1 className="mb-6 text-xl font-bold text-[var(--foreground)]">{t("loginTitle")}</h1>
        <LoginForm locale={locale} />
      </div>
    </div>
  );
}
