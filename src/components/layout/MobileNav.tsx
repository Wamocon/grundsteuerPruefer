"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface MobileNavProps {
  locale: string;
  user: User | null;
}

export function MobileNav({ locale, user }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const router = useRouter();

  async function handleLogout() {
    setOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}`);
    router.refresh();
  }

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("closeMenu") : t("openMenu")}
        aria-expanded={open}
        className="rounded-md p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition-colors"
      >
        {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-40 border-b border-[var(--card-border)] bg-[var(--background)]/95 backdrop-blur shadow-lg">
          <nav className="mx-auto max-w-7xl flex flex-col px-4 py-2 gap-0.5">
            <Link
              href={`/${locale}/pruefen`}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition-colors"
            >
              {t("check")}
            </Link>
            {user && (
              <Link
                href={`/${locale}/dashboard`}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition-colors"
              >
                {t("myChecks")}
              </Link>
            )}
            <Link
              href={`/${locale}/handbuch`}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition-colors"
            >
              {t("handbook")}
            </Link>
            <Link
              href={`/${locale}/hilfe`}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition-colors"
            >
              {t("help")}
            </Link>
            <div className="border-t border-[var(--card-border)] my-1" />
            {user ? (
              <>
                <span className="px-3 py-1.5 text-xs text-[var(--muted)] truncate">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-left text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition-colors"
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <Link
                href={`/${locale}/auth/login`}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-[var(--primary)] hover:bg-[var(--muted-bg)] transition-colors"
              >
                {t("login")}
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
