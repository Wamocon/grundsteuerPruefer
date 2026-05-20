"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import type { HandbuchSection, Block } from "@/lib/handbuch/sections";
import { HandbuchPdfDocument } from "./HandbuchPdfDocument";

interface HandbuchViewProps {
  sections: HandbuchSection[];
  locale: string;
  labels: {
    title: string;
    toc: string;
    searchPlaceholder: string;
    downloadPdf: string;
    generating: string;
    noResults: string;
    tocToggle: string;
  };
}

export function HandbuchView({ sections, locale, labels }: HandbuchViewProps) {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Filter sections by search query
  const filtered = query.trim()
    ? sections.filter((s) => {
        const q = query.toLowerCase();
        if (s.title.toLowerCase().includes(q)) return true;
        return s.blocks.some((b) => {
          if (b.text?.toLowerCase().includes(q)) return true;
          if (b.items?.some((i) => i.toLowerCase().includes(q))) return true;
          if (b.rows?.some((r) => r.some((c) => c.toLowerCase().includes(q)))) return true;
          return false;
        });
      })
    : sections;

  // IntersectionObserver – highlight active TOC entry on scroll
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setTocOpen(false);
  }, []);

  async function downloadPdf() {
    setPdfLoading(true);
    try {
      const blob = await pdf(<HandbuchPdfDocument sections={sections} locale={locale} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Grundwaechter_Handbuch_${locale.toUpperCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{labels.title}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {locale === "de"
              ? "Vollständige Anleitung zur Nutzung von Grundwächter"
              : "Complete guide to using Grundwächter"}
          </p>
        </div>
        <button
          onClick={downloadPdf}
          disabled={pdfLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors disabled:opacity-50"
        >
          {pdfLoading ? (
            <>
              <SpinnerIcon />
              {labels.generating}
            </>
          ) : (
            <>
              <DownloadIcon />
              {labels.downloadPdf}
            </>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] pl-9 pr-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none transition-colors"
        />
      </div>

      {/* Mobile TOC toggle */}
      <button
        onClick={() => setTocOpen((v) => !v)}
        className="lg:hidden mb-4 flex items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] w-full"
      >
        <MenuIcon className="h-4 w-4 text-[var(--muted)]" />
        {labels.tocToggle}
        <ChevronIcon className={`ml-auto h-4 w-4 text-[var(--muted)] transition-transform ${tocOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Mobile TOC drawer */}
      {tocOpen && (
        <nav className="lg:hidden mb-6 rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-3">
          <TocList
            sections={sections}
            filtered={filtered}
            activeId={activeId}
            onSelect={scrollTo}
            query={query}
          />
        </nav>
      )}

      <div className="flex gap-8">
        {/* Desktop TOC sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-24 rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              {labels.toc}
            </p>
            <nav>
              <TocList
                sections={sections}
                filtered={filtered}
                activeId={activeId}
                onSelect={scrollTo}
                query={query}
              />
            </nav>
          </div>
        </aside>

        {/* Content area */}
        <main ref={contentRef} className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <p className="text-sm text-[var(--muted)] py-12 text-center">{labels.noResults}</p>
          ) : (
            <div className="space-y-12">
              {filtered.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <h2 className="text-xl font-bold text-[var(--foreground)] mb-4 pb-2 border-b border-[var(--card-border)]">
                    {highlightText(section.title, query)}
                  </h2>
                  <div className="space-y-4">
                    {section.blocks.map((block, i) => (
                      <BlockRenderer key={i} block={block} query={query} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TOC list (reused in sidebar + mobile drawer)
// ---------------------------------------------------------------------------

function TocList({
  sections,
  filtered,
  activeId,
  onSelect,
  query,
}: {
  sections: HandbuchSection[];
  filtered: HandbuchSection[];
  activeId: string;
  onSelect: (id: string) => void;
  query: string;
}) {
  const filteredIds = new Set(filtered.map((s) => s.id));

  return (
    <ul className="space-y-0.5">
      {sections.map((s) => {
        const isActive = s.id === activeId;
        const isFiltered = !query.trim() || filteredIds.has(s.id);
        return (
          <li key={s.id}>
            <button
              onClick={() => onSelect(s.id)}
              disabled={!isFiltered}
              className={[
                "w-full text-left rounded-md px-2 py-1.5 text-sm transition-colors",
                isActive && isFiltered
                  ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                  : isFiltered
                  ? "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)]"
                  : "text-[var(--muted)]/40 cursor-default",
              ].join(" ")}
            >
              {s.title}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Block renderer
// ---------------------------------------------------------------------------

function BlockRenderer({ block, query }: { block: Block; query: string }) {
  switch (block.type) {
    case "p":
      return (
        <p className="text-sm leading-7 text-[var(--foreground)]">
          {highlightText(block.text ?? "", query)}
        </p>
      );

    case "h2":
      return (
        <h3 className="text-base font-semibold text-[var(--foreground)] mt-6 mb-1">
          {highlightText(block.text ?? "", query)}
        </h3>
      );

    case "ul":
      return (
        <ul className="space-y-1.5 pl-4">
          {(block.items ?? []).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
              <span className="leading-7">{highlightText(item, query)}</span>
            </li>
          ))}
        </ul>
      );

    case "note":
      return (
        <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-200">
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="leading-6">{highlightText(block.text ?? "", query)}</p>
        </div>
      );

    case "warn":
      return (
        <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200">
          <WarnIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="leading-6">{highlightText(block.text ?? "", query)}</p>
        </div>
      );

    case "table":
      return (
        <div className="overflow-x-auto rounded-lg border border-[var(--card-border)]">
          <table className="w-full text-sm">
            {block.headers && (
              <thead>
                <tr className="border-b border-[var(--card-border)] bg-[var(--muted-bg)]">
                  {block.headers.map((h, i) => (
                    <th key={i} className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {(block.rows ?? []).map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "bg-[var(--background)]" : "bg-[var(--card)]"}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-[var(--foreground)] leading-6">
                      {highlightText(cell, query)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Highlight matching text
// ---------------------------------------------------------------------------

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-700 rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function DownloadIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
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

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function WarnIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
