-- ============================================================
-- USERS TABLE
-- Simple identification for demo (no auth)
-- ============================================================
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- CONVERSATIONS TABLE
-- One conversation per user. All their design ideas are grouped here.
-- ============================================================
CREATE TABLE public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'open' NOT NULL
    CHECK (status IN ('open', 'order_accepted', 'order_declined')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- ============================================================
-- MESSAGES TABLE
-- Each row is one entry in the thread. Polymorphic via message_type.
-- ============================================================
CREATE TYPE public.message_type AS ENUM (
  'design_upload',
  'review',
  'user_text',
  'admin_text'
);

CREATE TYPE public.review_verdict AS ENUM (
  'possible',
  'depends',
  'not_possible'
);

CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'admin')),
  message_type public.message_type NOT NULL,
  body TEXT,
  file_url TEXT,
  file_name TEXT,
  file_type TEXT,
  link_url TEXT,
  verdict public.review_verdict,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Body is mandatory when verdict is 'depends'
ALTER TABLE public.messages ADD CONSTRAINT review_depends_needs_body
  CHECK (
    verdict IS NULL
    OR verdict != 'depends'
    OR (verdict = 'depends' AND body IS NOT NULL AND char_length(body) > 0)
  );

-- Body max 500 chars for reviews
ALTER TABLE public.messages ADD CONSTRAINT review_body_max_length
  CHECK (
    message_type != 'review'
    OR body IS NULL
    OR char_length(body) <= 500
  );

-- Indexes
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id, created_at ASC);
CREATE INDEX idx_conversations_updated ON public.conversations(updated_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('design-uploads', 'design-uploads', true);

CREATE POLICY "Design uploads are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'design-uploads');

CREATE POLICY "Anyone can upload design files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'design-uploads');

-- ============================================================
-- RLS: Permissive for demo
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on conversations" ON public.conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
