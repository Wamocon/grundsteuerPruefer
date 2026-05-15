import { getTranslations } from "next-intl/server";
import { PruefassistentWizard } from "@/components/pruefassistent/PruefassistentWizard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

type Props = { params: Promise<{ locale: string }> };

export default async function PruefenPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("nav");

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Breadcrumb
          items={[
            { label: "Startseite", href: `/${locale}` },
            { label: t("check") },
          ]}
        />
        <div className="mt-4">
          <PruefassistentWizard />
        </div>
      </div>
    </div>
  );
}
