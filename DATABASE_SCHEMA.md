# Database Schema

## Overview
This document defines the database schema for the ACM Media Platform using Supabase (PostgreSQL).

## Tables

### `profiles`
User profile information linked to Supabase Auth.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'author', -- 'admin', 'author', 'editor'
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
```

### `content`
Blog posts, articles, and other content.

```sql
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  body TEXT NOT NULL, -- Markdown/MDX content
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'scheduled'
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}' -- SEO tags, social sharing, etc.
);

-- Enable RLS
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_author ON content(author_id);
CREATE INDEX idx_content_published ON content(published_at DESC);

-- Policies
CREATE POLICY "Anyone can view published content"
  ON content FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can manage their own content"
  ON content FOR ALL USING (auth.uid() = author_id);
```

### `categories`
Content categorization.

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT USING (true);
```

### `tags`
Content tagging system.

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tags"
  ON tags FOR SELECT USING (true);
```

### `content_tags`
Many-to-many relationship between content and tags.

```sql
CREATE TABLE content_tags (
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, tag_id)
);

-- Enable RLS
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view content tags"
  ON content_tags FOR SELECT USING (true);
```

### `content_categories`
Many-to-many relationship between content and categories.

```sql
CREATE TABLE content_categories (
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, category_id)
);

-- Enable RLS
ALTER TABLE content_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view content categories"
  ON content_categories FOR SELECT USING (true);
```

### `media`
Image uploads and media management.

```sql
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_size BIGINT,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view media"
  ON media FOR SELECT USING (true);

CREATE POLICY "Users can upload media"
  ON media FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
```

## Functions & Triggers

### Updated At Trigger
Automatically update `updated_at` timestamp.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Migration Steps

1. Create Supabase project
2. Run the SQL above in Supabase SQL Editor
3. Set up storage buckets for images
4. Configure RLS policies
5. Test with sample data

## Next Steps

Once the GitHub repository is created:
1. Push the code
2. Set up Supabase project
3. Run these migration scripts
4. Test the database connections
5. Move to CMS development ([ACM-4](/ACM/issues/ACM-4))
