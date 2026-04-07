'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Content } from '@/lib/database.types';

export default function ContentEditor() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<Partial<Content>>({
    title: '',
    slug: '',
    body: '',
    excerpt: '',
    cover_image_url: '',
    status: 'draft',
    published_at: null,
    scheduled_at: null,
  });

  const fetchContent = useCallback(async () => {
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
      alert('Failed to load content');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isNew) {
      fetchContent();
    }
  }, [isNew, fetchContent]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setContent((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!content.title || !content.body) {
      alert('Please fill in the required fields');
      return;
    }

    try {
      if (!supabase) {
        alert('Database not configured');
        return;
      }
      setSaving(true);

      const payload = {
        ...content,
        status,
        author_id: user?.id,
        published_at: status === 'published' && !content.published_at ? new Date().toISOString() : content.published_at,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (isNew) {
        const { error: insertError } = await supabase.from('content').insert(payload);
        error = insertError;
      } else {
        const { error: updateError } = await supabase
          .from('content')
          .update(payload)
          .eq('id', id);
        error = updateError;
      }

      if (error) throw error;
      router.push('/admin/content');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isNew ? 'New Content' : 'Edit Content'}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit('draft')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => handleSubmit('published')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={saving}
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={content.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter title..."
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="slug"
            value={content.slug}
            onChange={(e) => setContent({ ...content, slug: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            placeholder="url-friendly-slug"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            value={content.excerpt || ''}
            onChange={(e) => setContent({ ...content, excerpt: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description..."
          />
        </div>

        {/* Cover Image URL */}
        <div>
          <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image URL
          </label>
          <input
            type="text"
            id="cover"
            value={content.cover_image_url || ''}
            onChange={(e) => setContent({ ...content, cover_image_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            placeholder="https://..."
          />
        </div>

        {/* Body */}
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="body"
            value={content.body}
            onChange={(e) => setContent({ ...content, body: e.target.value })}
            rows={20}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="# Start writing your content..."
          />
          <p className="mt-2 text-sm text-gray-500">
            Supports Markdown. Preview will be available on the published page.
          </p>
        </div>
      </div>
    </div>
  );
}
