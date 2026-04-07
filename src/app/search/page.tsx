'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  author: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || !supabase) {
      setResults([]);
      setSearched(true);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const { data, error } = await supabase
        .from('content')
        .select(`
          *,
          author:profiles!author_id(full_name, avatar_url)
        `)
        .eq('status', 'published')
        .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,body.ilike.%${searchQuery}%`)
        .order('published_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Search</h1>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Results */}
        {searched && (
          <div>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <>
                <p className="text-gray-600 mb-6">
                  Found {results.length} result{results.length !== 1 ? 's' : ''}
                </p>
                <div className="space-y-6">
                  {results.map((post) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <Link href={`/blog/${post.slug}`}>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                            {post.title}
                          </h2>
                        </Link>

                        {post.excerpt && (
                          <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                        )}

                        <div className="flex items-center gap-2">
                          {post.author?.avatar_url ? (
                            <img
                              src={post.author.avatar_url}
                              alt={post.author.full_name || 'Author'}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                              {post.author?.full_name?.charAt(0) || 'A'}
                            </div>
                          )}
                          <span className="text-sm text-gray-600">
                            {post.author?.full_name || 'Anonymous'}
                          </span>
                          <span className="text-sm text-gray-400">•</span>
                          <time className="text-sm text-gray-500">
                            {post.published_at
                              ? new Date(post.published_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : ''}
                          </time>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No results found for &quot;{query}&quot;</p>
                <p className="text-gray-500 mt-2">Try different keywords or browse our blog</p>
              </div>
            )}
          </div>
        )}

        {!searched && !initialQuery && (
          <div className="text-center py-12">
            <p className="text-gray-600">Enter a search term to find articles</p>
          </div>
        )}
      </div>
    </div>
  );
}
