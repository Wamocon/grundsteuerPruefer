"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface HeaderActionsProps {
  locale: string;
}

export function HeaderActions({ locale }: HeaderActionsProps) {
  const { theme, toggle } = useTheme();
  const t = useTranslations("nav");
  const otherLocale = locale === "de" ? "en" : "de";

  return (
    <div className="flex items-center gap-2">
      {/* Language switcher */}
      <Link
        href={`/${otherLocale}`}
        className="rounded-md px-2 py-1 text-xs font-medium border border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors uppercase"
        aria-label="Switch language"
      >
        {otherLocale}
      </Link>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        aria-label="Toggle dark mode"
        className="rounded-md p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition-colors"
      >
        {theme === "dark" ? (
          <SunIcon className="h-4 w-4" />
        ) : (
          <MoonIcon className="h-4 w-4" />
        )}
      </button>

      {/* Auth link */}
      <Link
        href={`/${locale}/auth/login`}
        className="rounded-md bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition-colors"
      >
        {t("login")}
      </Link>
    </div>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
