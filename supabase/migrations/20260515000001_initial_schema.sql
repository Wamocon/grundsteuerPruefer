-- ============================================================
-- Migration: Initial Schema for Grundsteuerbescheid-Pruefer
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE bundesland AS ENUM (
  'BB', 'BE', 'HB', 'HE', 'MV', 'NI', 'NW', 'RP', 'SH', 'SL', 'ST', 'TH',
  'BY', 'BW', 'HH'
);

CREATE TYPE berechnungsmodell AS ENUM (
  'bundesmodell', 'bayernmodell', 'bawuemodell', 'hamburgmodell'
);

CREATE TYPE abweichungs_stufe AS ENUM (
  'keine', 'gering', 'erheblich'
);

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================

CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  is_admin    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: owner read"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: owner update"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles: admin all"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE
    )
  );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- PRUEFFAELLE
-- ============================================================

CREATE TABLE prueffaelle (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bundesland          bundesland NOT NULL,
  berechnungsmodell   berechnungsmodell NOT NULL,
  eingabe_daten       JSONB NOT NULL DEFAULT '{}',
  bescheid_betrag     NUMERIC(10, 2) NOT NULL,
  berechneter_betrag  NUMERIC(10, 2) NOT NULL,
  abweichung_euro     NUMERIC(10, 2) NOT NULL,
  abweichung_prozent  NUMERIC(8, 4) NOT NULL,
  abweichungs_stufe   abweichungs_stufe NOT NULL,
  bescheid_datum      DATE,
  einspruch_frist     DATE,
  notizen             TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE prueffaelle ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prueffaelle: owner all"
  ON prueffaelle FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "prueffaelle: admin read"
  ON prueffaelle FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE
    )
  );

-- ============================================================
-- FRISTEN
-- ============================================================

CREATE TABLE fristen (
  id                            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prueffall_id                  UUID NOT NULL REFERENCES prueffaelle(id) ON DELETE CASCADE,
  frist_datum                   DATE NOT NULL,
  erinnerung_7_tage_gesendet    BOOLEAN NOT NULL DEFAULT FALSE,
  erinnerung_1_tag_gesendet     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE fristen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fristen: owner all"
  ON fristen FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- UPDATED_AT trigger helper
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_prueffaelle_updated_at
  BEFORE UPDATE ON prueffaelle
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
