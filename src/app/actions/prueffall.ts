"use server";

import { createClient } from "@/lib/supabase/server";
import type { AbweichungsErgebnis } from "@/lib/berechnung";
import type { PruefassistentState } from "@/components/pruefassistent/types";
import { BUNDESLAENDER_MODELL_MAP } from "@/lib/berechnung/modellauswahl";
import type { Bundesland, Database } from "@/types/database";

type PrueffallRow = Database["public"]["Tables"]["prueffaelle"]["Row"];

export interface SavePrueffallResult {
  prueffallId: string | null;
  error: string | null;
}

export async function savePrueffall(
  state: PruefassistentState,
  abweichung: AbweichungsErgebnis,
  einspruchsFrist: string | null
): Promise<SavePrueffallResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { prueffallId: null, error: null }; // not logged in - silent skip
  }

  const bundesland = state.bundesland as Bundesland;
  const berechnungsmodell = BUNDESLAENDER_MODELL_MAP[bundesland];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;

  const { data, error } = await sb
    .from("prueffaelle")
    .insert({
      user_id: user.id,
      bundesland,
      berechnungsmodell,
      eingabe_daten: state as unknown as Record<string, unknown>,
      bescheid_betrag: abweichung.bescheidBetrag,
      berechneter_betrag: abweichung.berechneterBetrag,
      abweichung_euro: abweichung.abweichungEuro,
      abweichung_prozent: abweichung.abweichungProzent,
      abweichungs_stufe: abweichung.stufe,
      bescheid_datum: state.bescheidDatum || null,
      einspruch_frist: einspruchsFrist,
    })
    .select("id")
    .single() as { data: PrueffallRow | null; error: { message: string } | null };

  if (error) {
    return { prueffallId: null, error: error.message };
  }

  // Save Frist entry if available
  if (einspruchsFrist && data?.id) {
    await sb.from("fristen").insert({
      user_id: user.id,
      prueffall_id: data.id,
      frist_datum: einspruchsFrist,
    });
  }

  return { prueffallId: data?.id ?? null, error: null };
}
