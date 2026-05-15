import { useTranslations } from "next-intl";
import Link from "next/link";

export function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--card)] mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Company stamp */}
          <div className="text-xs text-[var(--muted)] space-y-1">
            <p className="font-semibold text-[var(--foreground)]">WAMOCON GmbH</p>
            <p>Mergenthalerallee 79 - 81, 65760 Eschborn</p>
            <p>Handelsregister: Eschborn HRB 123666</p>
            <p>USt-IdNr.: DE344930486</p>
            <p>Geschäftsführer: Dipl.-Ing. Waleri Moretz</p>
          </div>

          {/* Legal links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[var(--muted)]">
            <Link href="/de/impressum" className="hover:text-[var(--foreground)] transition-colors">
              {t("imprint")}
            </Link>
            <Link href="/de/datenschutz" className="hover:text-[var(--foreground)] transition-colors">
              {t("privacy")}
            </Link>
            <Link href="/de/agb" className="hover:text-[var(--foreground)] transition-colors">
              {t("terms")}
            </Link>
          </nav>
        </div>

        <div className="mt-6 border-t border-[var(--card-border)] pt-4 text-center text-xs text-[var(--muted)]">
          &copy; {currentYear} WAMOCON GmbH. {t("allRights")}
        </div>
      </div>
    </footer>
  );
}
