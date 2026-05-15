"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

export function CookieBanner() {
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-[var(--foreground)] flex-1">
          Diese Website verwendet ausschließlich technisch notwendige Cookies für
          Session-Management und Authentifizierung - keine Tracking-Cookies.{" "}
          <Link
            href={`/${locale}/datenschutz`}
            className="underline text-[var(--primary)]"
          >
            Datenschutzerklärung
          </Link>
        </p>
        <button
          onClick={accept}
          className="shrink-0 rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors"
        >
          Verstanden
        </button>
      </div>
    </div>
  );
}
