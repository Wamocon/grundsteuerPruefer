import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getHandbuchSections } from "@/lib/handbuch/sections";
import { HandbuchView } from "@/components/handbuch/HandbuchView";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Product Handbook – Grundwächter" : "Produkthandbuch – Grundwächter",
  };
}

export default async function HilfeHandbuchPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("handbuch");

  const sections = getHandbuchSections(locale);

  const labels = {
    title: t("title"),
    toc: t("toc"),
    searchPlaceholder: t("searchPlaceholder"),
    downloadPdf: t("downloadPdf"),
    generating: t("generating"),
    noResults: t("noResults"),
    tocToggle: t("tocToggle"),
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb
          items={[
            { label: locale === "en" ? "Home" : "Startseite", href: `/${locale}` },
            { label: locale === "en" ? "Help" : "Hilfe", href: `/${locale}/hilfe` },
            { label: locale === "en" ? "Handbook" : "Handbuch" },
          ]}
        />
      </div>
      <HandbuchView sections={sections} locale={locale} labels={labels} />
    </div>
  );
}
