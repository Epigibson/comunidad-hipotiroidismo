-- Habilitar RLS en todas las tablas clave para TiroVida
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buddy_matches ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- PERFILES (profiles)
-- ==========================================
-- Leer: Todos los usuarios autenticados pueden ver perfiles de otros (necesario para la comunidad)
CREATE POLICY "Public profiles are viewable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated USING (true);

-- Insertar/Actualizar: Los usuarios solo pueden modificar su propio perfil
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated USING (auth.uid() = id);

-- ==========================================
-- SALUD Y SEGUIMIENTO (health_conditions, daily_logs, lab_results)
-- ==========================================
-- Leer/Escribir/Modificar/Eliminar: EXCLUSIVO del propietario de la fila (user_id)

-- health_conditions
CREATE POLICY "Users can only view their own health conditions" ON public.health_conditions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own health conditions" ON public.health_conditions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own health conditions" ON public.health_conditions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own health conditions" ON public.health_conditions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- daily_logs
CREATE POLICY "Users can only view their own logs" ON public.daily_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own logs" ON public.daily_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own logs" ON public.daily_logs FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own logs" ON public.daily_logs FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- lab_results
CREATE POLICY "Users can only view their own lab results" ON public.lab_results FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own lab results" ON public.lab_results FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own lab results" ON public.lab_results FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own lab results" ON public.lab_results FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ==========================================
-- COMUNIDAD (community_categories, community_threads, community_replies)
-- ==========================================
-- CATEGORÍAS (community_categories)
-- Leer: Todos pueden leer las categorías
CREATE POLICY "Categories are viewable by everyone" ON public.community_categories FOR SELECT TO authenticated USING (true);
-- Nota: La insercion/edición de categorias está bloqueada para todos excepto para superadmins del backend (roles que omitiremos por defecto en frontend)

-- HILOS (community_threads)
-- Leer: Todos los usuarios autenticados
CREATE POLICY "Threads are viewable by authenticated users" ON public.community_threads FOR SELECT TO authenticated USING (true);
-- Insertar: Cualquier usuario autenticado, pero debe ser el autor real
CREATE POLICY "Users can only insert threads as themselves" ON public.community_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
-- Actualizar/Borrar: Solo si es el autor original o si el usuario revisando es un 'moderator'
CREATE POLICY "Users can update their own threads"
ON public.community_threads FOR UPDATE
TO authenticated USING (
  auth.uid() = author_id OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'moderator'
);

CREATE POLICY "Users can delete their own threads"
ON public.community_threads FOR DELETE
TO authenticated USING (
  auth.uid() = author_id OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'moderator'
);

-- RESPUESTAS (community_replies)
-- Leer: Todos los autenticados
CREATE POLICY "Replies are viewable by authenticated users" ON public.community_replies FOR SELECT TO authenticated USING (true);
-- Insertar: Cualquier usuario autenticado, pero debe ser el autor real
CREATE POLICY "Users can only insert replies as themselves" ON public.community_replies FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
-- Borrar/Actualizar: Solo autor o moderador
CREATE POLICY "Users can update their own replies"
ON public.community_replies FOR UPDATE
TO authenticated USING (
  auth.uid() = author_id OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'moderator'
);

CREATE POLICY "Users can delete their own replies"
ON public.community_replies FOR DELETE
TO authenticated USING (
  auth.uid() = author_id OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'moderator'
);

-- ==========================================
-- BUSCADOR DE COMPAÑEROS (buddy_matches)
-- ==========================================
-- Leer/Modificar: Unicamente los involucrados (user_a o user_b)
CREATE POLICY "Users can view matches they are involved in"
ON public.buddy_matches FOR SELECT
TO authenticated USING (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "Users can insert matches if they are user_a"
ON public.buddy_matches FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_a);

CREATE POLICY "Users can update matches they are involved in"
ON public.buddy_matches FOR UPDATE
TO authenticated USING (auth.uid() = user_a OR auth.uid() = user_b);
