import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import AdBanner from '@/components/ads/AdBanner';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog - ACM Media Platform',
  description: 'Latest articles, news, and insights from ACM Media Platform',
  openGraph: {
    title: 'Blog - ACM Media Platform',
    description: 'Latest articles, news, and insights from ACM Media Platform',
    type: 'website',
  },
};

async function getBlogPosts() {
  if (!supabase) return [];
  const { data } = await supabase
    .from('content')
    .select(`
      *,
      author:profiles!author_id(full_name, avatar_url)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  return data || [];
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      {/* Page Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-lg text-gray-600">
            Latest articles, news, and insights from our team
          </p>
        </div>
      </div>

      {/* Top Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner slot="1234567890" size="leaderboard" className="w-full" />
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
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
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
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
            {/* Ad insertion after 6 posts */}
            {posts.length > 6 && (
              <div className="md:col-span-2 lg:col-span-3">
                <AdBanner slot="2345678901" size="leaderboard" className="w-full" />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
