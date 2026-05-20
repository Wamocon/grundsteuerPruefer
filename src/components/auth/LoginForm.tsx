"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  locale: string;
  next?: string;
}

type AuthErrorKey =
  | "errorInvalidCredentials"
  | "errorEmailNotConfirmed"
  | "errorTooManyRequests"
  | "errorGeneric";

function getAuthErrorKey(message: string): AuthErrorKey {
  const msg = message.toLowerCase();
  if (msg.includes("invalid login credentials") || msg.includes("invalid email or password")) {
    return "errorInvalidCredentials";
  }
  if (msg.includes("email not confirmed")) {
    return "errorEmailNotConfirmed";
  }
  if (msg.includes("too many requests") || msg.includes("rate limit")) {
    return "errorTooManyRequests";
  }
  return "errorGeneric";
}

export function LoginForm({ locale, next }: LoginFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(t(getAuthErrorKey(authError.message)));
      setLoading(false);
      return;
    }

    router.push(next ?? `/${locale}/dashboard`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-1">
          {t("emailLabel")}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)]">
            {t("passwordLabel")}
          </label>
          <Link href={`/${locale}/auth/passwort-reset`} className="text-xs text-[var(--primary)] hover:underline">
            {t("forgotPassword")}
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 pr-10 text-sm focus:border-[var(--primary)] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-[var(--danger)] rounded-lg border border-[var(--danger)] bg-red-50 dark:bg-red-950/20 px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="w-full rounded-lg bg-[var(--primary)] py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {loading && <SpinnerIcon />}
        {t("loginTitle")}
      </button>

      <div className="flex flex-col gap-2 text-center text-sm">
        <Link href={`/${locale}/auth/register`} className="text-[var(--primary)] hover:underline">
          {t("noAccount")} {t("registerTitle")}
        </Link>
        <Link href={`/${locale}/pruefen`} className="text-[var(--muted)] hover:text-[var(--foreground)]">
          {t("continueWithoutAccount")}
        </Link>
      </div>
    </form>
  );
}

function EyeIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
