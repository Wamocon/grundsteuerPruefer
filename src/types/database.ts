export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Bundesland =
  | "BB" | "BE" | "HB" | "HE" | "MV" | "NI" | "NW" | "RP" | "SH" | "SL" | "ST" | "TH" // Bundesmodell
  | "BY"  // Bayern-Modell
  | "BW"  // Baden-Wuerttemberg-Modell
  | "HH"; // Hamburg-Modell

export type Berechnungsmodell = "bundesmodell" | "bayernmodell" | "bawuemodell" | "hamburgmodell";

export type NutzungsartBundesmodell = "wohnen" | "gewerbe" | "landwirtschaft" | "gemischt";

export type WohnlagHamburg = "normal" | "gut";

export type AbweichungsStufe = "keine" | "gering" | "erheblich";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          is_admin?: boolean;
          updated_at?: string;
        };
      };
      prueffaelle: {
        Row: {
          id: string;
          user_id: string;
          bundesland: Bundesland;
          berechnungsmodell: Berechnungsmodell;
          eingabe_daten: Json;
          bescheid_betrag: number;
          berechneter_betrag: number;
          abweichung_euro: number;
          abweichung_prozent: number;
          abweichungs_stufe: AbweichungsStufe;
          bescheid_datum: string | null;
          einspruch_frist: string | null;
          notizen: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bundesland: Bundesland;
          berechnungsmodell: Berechnungsmodell;
          eingabe_daten: Json;
          bescheid_betrag: number;
          berechneter_betrag: number;
          abweichung_euro: number;
          abweichung_prozent: number;
          abweichungs_stufe: AbweichungsStufe;
          bescheid_datum?: string | null;
          einspruch_frist?: string | null;
          notizen?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          bundesland?: Bundesland;
          berechnungsmodell?: Berechnungsmodell;
          eingabe_daten?: Json;
          bescheid_betrag?: number;
          berechneter_betrag?: number;
          abweichung_euro?: number;
          abweichung_prozent?: number;
          abweichungs_stufe?: AbweichungsStufe;
          bescheid_datum?: string | null;
          einspruch_frist?: string | null;
          notizen?: string | null;
          updated_at?: string;
        };
      };
      fristen: {
        Row: {
          id: string;
          user_id: string;
          prueffall_id: string;
          frist_datum: string;
          erinnerung_7_tage_gesendet: boolean;
          erinnerung_1_tag_gesendet: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          prueffall_id: string;
          frist_datum: string;
          erinnerung_7_tage_gesendet?: boolean;
          erinnerung_1_tag_gesendet?: boolean;
          created_at?: string;
        };
        Update: {
          frist_datum?: string;
          erinnerung_7_tage_gesendet?: boolean;
          erinnerung_1_tag_gesendet?: boolean;
        };
      };
    };
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: {
      bundesland: Bundesland;
      berechnungsmodell: Berechnungsmodell;
      abweichungs_stufe: AbweichungsStufe;
    };
  };
}
