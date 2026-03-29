-- ============================================
-- TiroVida — Esquema de Base de Datos
-- Comunidad de Hipotiroidismo
-- ============================================

-- ========================
-- PROFILES (Extensión de auth.users)
-- ========================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  alias TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'family', 'moderator', 'specialist')),
  avatar_url TEXT,
  is_verified_specialist BOOLEAN DEFAULT FALSE,
  bio TEXT,
  birth_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, alias, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'alias', 'Anónimo'),
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================
-- HEALTH CONDITIONS
-- ========================
CREATE TABLE public.health_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  condition_name TEXT NOT NULL,
  condition_type TEXT CHECK (condition_type IN ('hypothyroidism', 'hashimoto', 'pcos', 'other')),
  diagnosis_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- DAILY LOGS
-- ========================
CREATE TABLE public.daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  -- Escala Likert 1-5
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  brain_fog_level INTEGER CHECK (brain_fog_level BETWEEN 1 AND 5),
  mood_level INTEGER CHECK (mood_level BETWEEN 1 AND 5),
  joint_pain_level INTEGER CHECK (joint_pain_level BETWEEN 1 AND 5),
  -- Variables cuantitativas
  sleep_hours NUMERIC(3,1),
  weight_kg NUMERIC(5,2),
  -- Medicación
  medication_taken BOOLEAN DEFAULT FALSE,
  medication_dose_mcg NUMERIC(6,2),
  medication_name TEXT DEFAULT 'Levotiroxina',
  -- Notas
  custom_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Un solo log por día por usuario
  UNIQUE(user_id, log_date)
);

-- ========================
-- LAB RESULTS (Perfil Tiroideo)
-- ========================
CREATE TABLE public.lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  test_date DATE NOT NULL,
  -- Perfil Tiroideo completo
  tsh_level NUMERIC(8,4),
  t3_free NUMERIC(8,4),
  t4_free NUMERIC(8,4),
  t3_total NUMERIC(8,4),
  t4_total NUMERIC(8,4),
  -- Anticuerpos (clave para Hashimoto)
  anti_tpo NUMERIC(10,2),
  anti_tg NUMERIC(10,2),
  -- Metadata
  lab_name TEXT,
  notes TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- COMMUNITY: Categories
-- ========================
CREATE TABLE public.community_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  has_trigger_warning BOOLEAN DEFAULT FALSE,
  trigger_warning_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- COMMUNITY: Threads
-- ========================
CREATE TABLE public.community_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.community_categories(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  has_trigger_warning BOOLEAN DEFAULT FALSE,
  trigger_tags TEXT[],
  reply_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- COMMUNITY: Replies
-- ========================
CREATE TABLE public.community_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.community_threads(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- BUDDY SYSTEM
-- ========================
CREATE TABLE public.buddy_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  user_b UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'declined', 'ended')),
  match_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_daily_logs_user_date ON public.daily_logs(user_id, log_date DESC);
CREATE INDEX idx_lab_results_user_date ON public.lab_results(user_id, test_date DESC);
CREATE INDEX idx_health_conditions_user ON public.health_conditions(user_id);
CREATE INDEX idx_community_threads_category ON public.community_threads(category_id, created_at DESC);
CREATE INDEX idx_community_threads_author ON public.community_threads(author_id);
CREATE INDEX idx_community_replies_thread ON public.community_replies(thread_id, created_at ASC);
CREATE INDEX idx_buddy_matches_users ON public.buddy_matches(user_a, user_b);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
-- Allow viewing profiles in community context (alias only)
CREATE POLICY "Authenticated can view public profiles"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- Health Conditions: Strictly private
ALTER TABLE public.health_conditions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own conditions"
  ON public.health_conditions FOR ALL
  USING (auth.uid() = user_id);

-- Daily Logs: Strictly private
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own logs"
  ON public.daily_logs FOR ALL
  USING (auth.uid() = user_id);

-- Lab Results: Strictly private
ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own labs"
  ON public.lab_results FOR ALL
  USING (auth.uid() = user_id);

-- Community Categories: Viewable by all authenticated
ALTER TABLE public.community_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view categories"
  ON public.community_categories FOR SELECT
  USING (auth.role() = 'authenticated');

-- Community Threads
ALTER TABLE public.community_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view threads"
  ON public.community_threads FOR SELECT
  USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can create threads"
  ON public.community_threads FOR INSERT
  WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own threads"
  ON public.community_threads FOR UPDATE
  USING (auth.uid() = author_id);

-- Community Replies
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view replies"
  ON public.community_replies FOR SELECT
  USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can create replies"
  ON public.community_replies FOR INSERT
  WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own replies"
  ON public.community_replies FOR UPDATE
  USING (auth.uid() = author_id);

-- Buddy Matches
ALTER TABLE public.buddy_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own matches"
  ON public.buddy_matches FOR SELECT
  USING (auth.uid() = user_a OR auth.uid() = user_b);
CREATE POLICY "Users can create matches"
  ON public.buddy_matches FOR INSERT
  WITH CHECK (auth.uid() = user_a);
CREATE POLICY "Users can update own matches"
  ON public.buddy_matches FOR UPDATE
  USING (auth.uid() = user_a OR auth.uid() = user_b);

-- ============================================
-- SEED DATA: Community Categories
-- ============================================
INSERT INTO public.community_categories (name, slug, description, icon, sort_order, has_trigger_warning, trigger_warning_text) VALUES
  ('General', 'general', 'Conversaciones generales sobre hipotiroidismo', '💬', 1, FALSE, NULL),
  ('Síntomas y Experiencias', 'sintomas', 'Comparte cómo te sientes y qué has experimentado', '🩺', 2, FALSE, NULL),
  ('Medicación', 'medicacion', 'Discusiones sobre levotiroxina, dosis y alternativas', '💊', 3, FALSE, NULL),
  ('Laboratorios', 'laboratorios', 'Ayuda para entender tus resultados de laboratorio', '🔬', 4, FALSE, NULL),
  ('Nutrición', 'nutricion', 'Alimentación, dietas y suplementos para la tiroides', '🥗', 5, FALSE, NULL),
  ('Ejercicio y Bienestar', 'ejercicio', 'Actividad física adaptada y bienestar general', '🧘', 6, FALSE, NULL),
  ('Hashimoto', 'hashimoto', 'Específico para tiroiditis de Hashimoto y autoinmunidad', '🦋', 7, FALSE, NULL),
  ('SOP y Tiroides', 'sop', 'Relación entre Síndrome de Ovario Poliquístico y tiroides', '🌸', 8, FALSE, NULL),
  ('Embarazo y Fertilidad', 'embarazo', 'Tiroides durante embarazo, lactancia y fertilidad', '🤰', 9, TRUE, 'Este foro puede contener temas sensibles sobre pérdida gestacional y dificultades de fertilidad.'),
  ('Salud Mental', 'salud-mental', 'Ansiedad, depresión y el impacto emocional de vivir con hipotiroidismo', '🧠', 10, TRUE, 'Este foro contiene discusiones sobre salud mental. Si estás en crisis, busca ayuda profesional.'),
  ('Logros y Celebraciones', 'logros', '¡Comparte tus victorias, grandes o pequeñas!', '🎉', 11, FALSE, NULL),
  ('Recursos y Artículos', 'recursos', 'Artículos, libros, podcasts y recursos útiles', '📚', 12, FALSE, NULL);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at_daily_logs
  BEFORE UPDATE ON public.daily_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at_community_threads
  BEFORE UPDATE ON public.community_threads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at_community_replies
  BEFORE UPDATE ON public.community_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at_buddy_matches
  BEFORE UPDATE ON public.buddy_matches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
