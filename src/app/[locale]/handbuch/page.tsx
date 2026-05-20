import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getHandbuchSections } from "@/lib/handbuch/sections";
import { HandbuchView } from "@/components/handbuch/HandbuchView";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Product Handbook – Grundwächter" : "Produkthandbuch – Grundwächter",
  };
}

export default async function HandbuchPage({ params }: Props) {
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

  return <HandbuchView sections={sections} locale={locale} labels={labels} />;
}
