-- ACM Media Platform - Supabase Setup Script
-- Run this script in your Supabase SQL Editor to set up the database

-- ===========================================
-- 1. EXTENSIONS
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================================
-- 2. TABLES
-- ===========================================

-- User profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    role TEXT DEFAULT 'author' CHECK (role IN ('admin', 'author', 'editor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Content table
CREATE TABLE IF NOT EXISTS public.content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    body TEXT NOT NULL,
    featured_image TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    view_count INTEGER DEFAULT 0
);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Tags table
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Content categories junction table
CREATE TABLE IF NOT EXISTS public.content_categories (
    content_id UUID REFERENCES public.content(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (content_id, category_id)
);

-- Content tags junction table
CREATE TABLE IF NOT EXISTS public.content_tags (
    content_id UUID REFERENCES public.content(id) ON DELETE CASCADE NOT NULL,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (content_id, tag_id)
);

-- Media table
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT CHECK (type IN ('image', 'video', 'document', 'other')),
    size INTEGER,
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ===========================================
-- 3. INDEXES
-- ===========================================

-- Improve search performance
CREATE INDEX IF NOT EXISTS idx_content_slug ON public.content(slug);
CREATE INDEX IF NOT EXISTS idx_content_status ON public.content(status);
CREATE INDEX IF NOT EXISTS idx_content_published_at ON public.content(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_author_id ON public.content(author_id);
CREATE INDEX IF NOT EXISTS idx_content_title_trgm ON public.content USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_content_body_trgm ON public.content USING gin(body gin_trgm_ops);

-- Category and tag indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON public.tags(slug);

-- ===========================================
-- 4. FUNCTIONS AND TRIGGERS
-- ===========================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.content
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Slug generation function
CREATE OR REPLACE FUNCTION public.generate_slug(text_param TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(REGEXP_REPLACE(REGEXP_REPLACE(text_param, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Content policies
CREATE POLICY "Published content is viewable by everyone"
    ON public.content FOR SELECT
    USING (status = 'published');

CREATE POLICY "Authors can view their own content"
    ON public.content FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = author_id));

CREATE POLICY "Authors can create content"
    ON public.content FOR INSERT
    WITH CHECK (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = author_id));

CREATE POLICY "Authors can update their own content"
    ON public.content FOR UPDATE
    USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = author_id));

CREATE POLICY "Authors can delete their own content"
    ON public.content FOR DELETE
    USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = author_id));

-- Categories and tags policies
CREATE POLICY "Categories are viewable by everyone"
    ON public.categories FOR SELECT
    USING (true);

CREATE POLICY "Tags are viewable by everyone"
    ON public.tags FOR SELECT
    USING (true);

-- Junction table policies
CREATE POLICY "Content categories are viewable by everyone"
    ON public.content_categories FOR SELECT
    USING (true);

CREATE POLICY "Content tags are viewable by everyone"
    ON public.content_tags FOR SELECT
    USING (true);

-- Media policies
CREATE POLICY "Media is viewable by everyone"
    ON public.media FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can upload media"
    ON public.media FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- ===========================================
-- 6. SAMPLE DATA (Optional - for testing)
-- ===========================================

-- Insert sample category
INSERT INTO public.categories (name, slug, description)
VALUES ('Technology', 'technology', 'Articles about technology and programming')
ON CONFLICT (name) DO NOTHING;

-- Insert sample tag
INSERT INTO public.tags (name, slug)
VALUES ('web-development', 'web-development')
ON CONFLICT (name) DO NOTHING;

-- ===========================================
-- 7. STORAGE BUCKETS (Manual Setup Required)
-- ===========================================

-- Note: Storage buckets must be created manually in Supabase Dashboard:
-- 1. Go to Storage -> Create a new bucket
-- 2. Create bucket named "media"
-- 3. Make it public (for images)
-- 4. Configure RLS policies for the bucket

-- ===========================================
-- 8. GRANTS
-- ===========================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- ===========================================
-- SETUP COMPLETE
-- ===========================================

-- Verify setup
SELECT
    'Setup complete!' as status,
    COUNT(DISTINCT t.table_name) as tables_created
FROM information_schema.tables t
WHERE t.table_schema = 'public'
AND t.table_name IN ('profiles', 'content', 'categories', 'tags', 'content_categories', 'content_tags', 'media');