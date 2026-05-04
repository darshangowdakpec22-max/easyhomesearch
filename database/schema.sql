-- ============================================================
--  EasyHomeSearch – PostgreSQL / PostGIS schema
--  Run once against a fresh Supabase (or any Postgres) DB
-- ============================================================

-- Enable PostGIS extension (Supabase already has it)
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT        NOT NULL,
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  role          TEXT        NOT NULL DEFAULT 'buyer'
                            CHECK (role IN ('buyer','agent','admin')),
  avatar_url    TEXT,
  phone         TEXT,
  bio           TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Listings ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listings (
  id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          TEXT        NOT NULL,
  description    TEXT,
  price          NUMERIC(14,2) NOT NULL,
  address        TEXT        NOT NULL,
  city           TEXT,
  state          TEXT,
  zip_code       TEXT,
  country        TEXT        NOT NULL DEFAULT 'US',
  bedrooms       INT,
  bathrooms      NUMERIC(4,1),
  area_sqft      NUMERIC(10,2),
  property_type  TEXT        CHECK (property_type IN
                   ('house','apartment','condo','townhouse','land','commercial')),
  location       GEOGRAPHY(Point, 4326),  -- PostGIS geo column
  images         JSONB       NOT NULL DEFAULT '[]',
  status         TEXT        NOT NULL DEFAULT 'active'
                             CHECK (status IN ('active','pending','sold','off_market')),
  agent_id       UUID        REFERENCES users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Spatial index for fast geo queries
CREATE INDEX IF NOT EXISTS listings_location_idx ON listings USING GIST (location);
CREATE INDEX IF NOT EXISTS listings_city_idx     ON listings (LOWER(city));
CREATE INDEX IF NOT EXISTS listings_price_idx    ON listings (price);
CREATE INDEX IF NOT EXISTS listings_status_idx   ON listings (status);

-- ── Saved Listings ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_listings (
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id UUID        NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  saved_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, listing_id)
);

-- ── Row-Level Security (Supabase) ─────────────────────────────
-- Enable RLS on each table (adjust policies to your auth setup)
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;

-- ── Trigger: auto-update updated_at ──────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
