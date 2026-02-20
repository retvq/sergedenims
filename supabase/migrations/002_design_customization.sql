-- ============================================
-- Serge De Nimes: AI Design Customization
-- Migration 002: Replace conversation system
-- ============================================

-- Drop old tables
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop old types
DROP TYPE IF EXISTS message_type CASCADE;
DROP TYPE IF EXISTS review_verdict CASCADE;

-- ============================================
-- New tables for design customization flow
-- ============================================

CREATE TABLE design_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clothing_image_url TEXT NOT NULL,
  detected_category TEXT CHECK (detected_category IN ('jacket', 'shirt', 'vest', 'crop_top', 'dress', 'hoodie')),
  clothing_description TEXT,
  path_type TEXT CHECK (path_type IN ('sample', 'custom')),
  selected_sample_key TEXT,
  custom_instructions TEXT,
  custom_reference_url TEXT,
  current_design_url TEXT,
  generation_count INTEGER DEFAULT 0 CHECK (generation_count >= 0 AND generation_count <= 5),
  is_locked BOOLEAN DEFAULT false,
  pricing_category TEXT,
  status TEXT DEFAULT 'uploading' CHECK (status IN ('uploading', 'detecting', 'browsing', 'generating', 'locked', 'priced')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES design_sessions(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL CHECK (attempt_number >= 1 AND attempt_number <= 5),
  prompt_used TEXT NOT NULL,
  result_image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_generations_session ON generations(session_id, attempt_number);
CREATE INDEX idx_sessions_status ON design_sessions(status);
CREATE INDEX idx_sessions_created ON design_sessions(created_at DESC);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER design_sessions_updated_at
  BEFORE UPDATE ON design_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Storage bucket for design assets
-- ============================================

-- Create bucket (ignore if exists from previous migration)
INSERT INTO storage.buckets (id, name, public)
VALUES ('design-assets', 'design-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Allow public read on design-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'design-assets');

CREATE POLICY "Allow public upload to design-assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'design-assets');

-- ============================================
-- RLS (permissive for demo)
-- ============================================

ALTER TABLE design_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on design_sessions" ON design_sessions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all on generations" ON generations
  FOR ALL USING (true) WITH CHECK (true);
