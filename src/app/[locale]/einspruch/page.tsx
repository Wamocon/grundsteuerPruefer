import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EinspruchGenerator } from "@/components/einspruch/EinspruchGenerator";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    bescheidBetrag?: string;
    berechneterBetrag?: string;
    abweichung?: string;
    frist?: string;
  }>;
};

export default async function EinspruchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Breadcrumb
          items={[
            { label: "Startseite", href: `/${locale}` },
            { label: "Prüfen", href: `/${locale}/pruefen` },
            { label: "Einspruchsentwurf" },
          ]}
        />
        <div className="mt-6">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            Einspruchsentwurf erstellen
          </h1>
          <p className="text-sm text-[var(--muted)] mb-6">
            Füllen Sie die Felder aus und laden Sie den personalisierten Einspruchsentwurf als PDF herunter.
          </p>
          <EinspruchGenerator
            bescheidBetrag={sp.bescheidBetrag ? parseFloat(sp.bescheidBetrag) : 0}
            berechneterBetrag={sp.berechneterBetrag ? parseFloat(sp.berechneterBetrag) : 0}
            abweichungEuro={sp.abweichung ? parseFloat(sp.abweichung) : 0}
            einspruchFrist={sp.frist ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
