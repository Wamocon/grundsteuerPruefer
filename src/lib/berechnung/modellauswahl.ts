/**
 * Modellauswahl: Bundesland -> Berechnungsmodell (Anforderung K-01)
 */

import type { Bundesland, Berechnungsmodell } from "@/types/database";

export const BUNDESLAENDER_MODELL_MAP: Record<Bundesland, Berechnungsmodell> = {
  // Bundesmodell (11 Laender)
  BB: "bundesmodell",
  BE: "bundesmodell",
  HB: "bundesmodell",
  HE: "bundesmodell",
  MV: "bundesmodell",
  NI: "bundesmodell",
  NW: "bundesmodell",
  RP: "bundesmodell",
  SH: "bundesmodell",
  SL: "bundesmodell",
  ST: "bundesmodell",
  TH: "bundesmodell",
  // Eigenmodelle
  BY: "bayernmodell",
  BW: "bawuemodell",
  HH: "hamburgmodell",
};

export const BUNDESLAND_NAMES: Record<Bundesland, string> = {
  BB: "Brandenburg",
  BE: "Berlin",
  HB: "Bremen",
  HE: "Hessen",
  MV: "Mecklenburg-Vorpommern",
  NI: "Niedersachsen",
  NW: "Nordrhein-Westfalen",
  RP: "Rheinland-Pfalz",
  SH: "Schleswig-Holstein",
  SL: "Saarland",
  ST: "Sachsen-Anhalt",
  TH: "Thüringen",
  BY: "Bayern",
  BW: "Baden-Württemberg",
  HH: "Hamburg",
};

export const MODELL_NAMES: Record<Berechnungsmodell, string> = {
  bundesmodell: "Bundesmodell (§§ 219–228 BewG)",
  bayernmodell: "Bayern-Modell (BayGrStG)",
  bawuemodell: "Baden-Württemberg-Modell (LGrStG BW)",
  hamburgmodell: "Hamburg-Modell (HmbGrStG)",
};

export function getModellForBundesland(bundesland: Bundesland): Berechnungsmodell {
  return BUNDESLAENDER_MODELL_MAP[bundesland];
}
