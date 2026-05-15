import { useTranslations } from "next-intl";
import Link from "next/link";
import { AppLogo } from "@/components/ui/AppLogo";
import { HeaderActions } from "@/components/layout/HeaderActions";

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--background)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo + App Name */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 font-semibold text-[var(--foreground)] hover:opacity-80 transition-opacity"
        >
          <AppLogo className="h-7 w-7" />
          <span className="hidden sm:inline text-sm">
            Grundwächter
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--muted)]">
          <Link href={`/${locale}/pruefen`} className="hover:text-[var(--foreground)] transition-colors">
            {t("check")}
          </Link>
          <Link href={`/${locale}/hilfe`} className="hover:text-[var(--foreground)] transition-colors">
            {t("help")}
          </Link>
        </nav>

        {/* Actions: Theme toggle, Language switcher, Auth */}
        <HeaderActions locale={locale} />
      </div>
    </header>
  );
}
