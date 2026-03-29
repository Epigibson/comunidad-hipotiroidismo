-- ==========================================
-- SPRINT NOTIFICACIONES EN TIEMPO REAL
-- ==========================================

-- 1. Crear Tabla
CREATE TABLE public.notifications (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('community', 'system', 'reminder', 'lab')),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    icon TEXT,
    is_read BOOLEAN DEFAULT false,
    link TEXT, -- Opcional, para llevar al paciente al hilo correcto
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 2. Políticas RLS
-- Leer: Cada paciente solo ve sus propias notificaciones
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
TO authenticated USING (auth.uid() = user_id);

-- Actualizar: El paciente puede marcar "is_read = true"
CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
TO authenticated USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Insertar: Solo por triggers (o el sistema), cerramos la puerta por seguridad desde el frontend.
CREATE POLICY "Users cannot insert notifications directly"
ON public.notifications FOR INSERT
TO authenticated WITH CHECK (false);

-- Eliminar: Si alguien desea limpiar su bandeja
CREATE POLICY "Users can delete their own notifications"
ON public.notifications FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ==========================================
-- 3. TRIGGER: Comunidad (Alerta de Respuestas)
-- ==========================================
-- Cuando alguien conteste en un hilo tuyo, la BD te avisará (A menos que seas tú mismo)

CREATE OR REPLACE FUNCTION public.handle_new_community_reply()
RETURNS TRIGGER AS $$
DECLARE
    thread_author_id UUID;
    thread_title TEXT;
    replier_alias TEXT;
BEGIN
    -- Obtenemos el dueño original del Hilo
    SELECT author_id, title INTO thread_author_id, thread_title
    FROM public.community_threads
    WHERE id = NEW.thread_id;

    -- Obtenemos el Alias del que responde (si no es anónimo)
    IF NEW.is_anonymous = true THEN
        replier_alias := 'Un Anónimo';
    ELSE
        SELECT alias INTO replier_alias FROM public.profiles WHERE id = NEW.author_id;
        IF replier_alias IS NULL THEN
            replier_alias := 'Un Usuario';
        END IF;
    END IF;

    -- Si alguien contestó tu hilo y no fuiste tú mismo (Auto-reply), te crea la campanita
    IF thread_author_id IS NOT NULL AND thread_author_id != NEW.author_id THEN
        INSERT INTO public.notifications (user_id, type, title, body, icon, link)
        VALUES (
            thread_author_id,
            'community',
            'Nueva respuesta en tu hilo',
            replier_alias || ' ha respondido a: "' || substring(thread_title from 1 for 40) || '..."',
            '💬',
            '/community/' -- Para que el frontend sepa a donde llevarte
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atar Función a la tabla `community_replies`
CREATE TRIGGER on_reply_created
    AFTER INSERT ON public.community_replies
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_community_reply();
