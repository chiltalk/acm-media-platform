import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import InArticleAd from '@/components/ads/InArticleAd';

export const dynamic = 'force-dynamic';

async function getBlogPost(slug: string) {
  if (!supabase) return null;
  const { data } = await supabase
    .from('content')
    .select(`
      *,
      author:profiles!author_id(full_name, avatar_url, bio)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.published_at || undefined,
      authors: [post.author?.full_name || 'Anonymous'],
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-6"
          >
            ← Back to Blog
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

          <div className="flex items-center gap-4">
            {post.author?.avatar_url ? (
              <img
                src={post.author.avatar_url}
                alt={post.author.full_name || 'Author'}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {post.author?.full_name?.charAt(0) || 'A'}
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">
                {post.author?.full_name || 'Anonymous'}
              </p>
              <p className="text-sm text-gray-600">
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : ''}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-sm p-8 lg:p-12">
          {post.cover_image_url && (
            <div className="mb-8 -mx-8 lg:-mx-12">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {post.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed mb-8">{post.excerpt}</p>
          )}

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.body}
            </ReactMarkdown>
          </div>

          {/* In-article ad */}
          <InArticleAd slot="3456789012" />
        </article>

        {/* Author bio */}
        {post.author?.bio && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About the Author</h3>
            <p className="text-gray-600">{post.author.bio}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            ← Back to all articles
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} ACM Media Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
