import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import AdBanner from '@/components/ads/AdBanner';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ACM Media Platform - Latest Articles & Insights',
  description: 'Your source for latest articles, news, and insights',
  openGraph: {
    title: 'ACM Media Platform',
    description: 'Your source for latest articles, news, and insights',
    type: 'website',
  },
};

async function getLatestPosts() {
  if (!supabase) return [];
  const { data } = await supabase
    .from('content')
    .select(`
      *,
      author:profiles!author_id(full_name, avatar_url)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(12);

  return data || [];
}

async function getFeaturedPosts() {
  if (!supabase) return [];
  const { data } = await supabase
    .from('content')
    .select(`
      *,
      author:profiles!author_id(full_name, avatar_url)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3);

  return data || [];
}

async function getCategories() {
  if (!supabase) return [];
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  return data || [];
}

export default async function Home() {
  const [latestPosts, featuredPosts, categories] = await Promise.all([
    getLatestPosts(),
    getFeaturedPosts(),
    getCategories(),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to ACM Media Platform
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl">
            Your source for latest articles, news, and insights from our team of
            expert writers.
          </p>
          <Link
            href="/blog"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Explore Articles
          </Link>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner slot="1234567890" size="leaderboard" className="w-full my-8" />
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {post.cover_image_url && (
                  <Link href={`/blog/${post.slug}`} className="block aspect-video relative">
                    <Image
                      src={post.cover_image_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </Link>
                )}

                <div className="p-6">
                  <Link href={`/blog/${post.slug}`} className="group">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                  </Link>

                  {post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {post.author?.avatar_url ? (
                        <img
                          src={post.author.avatar_url}
                          alt={post.author.full_name || 'Author'}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                          {post.author?.full_name?.charAt(0) || 'A'}
                        </div>
                      )}
                      <span className="text-sm text-gray-600">
                        {post.author?.full_name || 'Anonymous'}
                      </span>
                    </div>

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
        </section>
      )}

      {/* Latest Posts */}
      {latestPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
            <Link
              href="/blog"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all →
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {post.cover_image_url && (
                  <Link href={`/blog/${post.slug}`} className="block aspect-video relative">
                    <Image
                      src={post.cover_image_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </Link>
                )}

                <div className="p-6">
                  <Link href={`/blog/${post.slug}`} className="group">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                  </Link>

                  {post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {post.author?.avatar_url ? (
                        <img
                          src={post.author.avatar_url}
                          alt={post.author.full_name || 'Author'}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                          {post.author?.full_name?.charAt(0) || 'A'}
                        </div>
                      )}
                      <span className="text-sm text-gray-600">
                        {post.author?.full_name || 'Anonymous'}
                      </span>
                    </div>

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
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Categories</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated with Our Latest Content
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Subscribe to our newsletter and never miss an article
          </p>
          <Link
            href="/blog"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Browse All Articles
          </Link>
        </div>
      </section>
    </>
  );
}
