import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import InArticleAd from '@/components/ads/InArticleAd';
import SocialShare from '@/components/social/SocialShare';

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

async function getRelatedPosts(currentPostId: string, limit = 4) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('content')
    .select(`
      *,
      author:profiles!author_id(full_name, avatar_url)
    `)
    .eq('status', 'published')
    .neq('id', currentPostId)
    .order('published_at', { ascending: false })
    .limit(limit);

  return data || [];
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

  const relatedPosts = await getRelatedPosts(post.id);

  return (
    <>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-6"
        >
          ← Back to Blog
        </Link>

        {/* Article header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 mb-6">
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
        </header>

        {/* Social Share */}
        <div className="mb-8">
          <SocialShare
            title={post.title}
            url={`/blog/${post.slug}`}
            description={post.excerpt || undefined}
          />
        </div>

        {/* Cover image */}
        {post.cover_image_url && (
          <div className="mb-8 relative h-64 md:h-96 w-full">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-gray-600 leading-relaxed mb-8">{post.excerpt}</p>
        )}

        {/* Article content */}
        <div className="bg-white rounded-lg shadow-sm p-8 lg:p-12">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.body}
            </ReactMarkdown>
          </div>

          {/* In-article ad */}
          <InArticleAd slot="3456789012" />
        </div>

        {/* Author bio */}
        {post.author?.bio && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About the Author</h3>
            <p className="text-gray-600">{post.author.bio}</p>
          </div>
        )}

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {relatedPost.cover_image_url && (
                    <div className="aspect-video bg-gray-100">
                      <img
                        src={relatedPost.cover_image_url}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {relatedPost.title}
                    </h3>

                    {relatedPost.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{relatedPost.excerpt}</p>
                    )}

                    <div className="flex items-center gap-2">
                      {relatedPost.author?.avatar_url ? (
                        <img
                          src={relatedPost.author.avatar_url}
                          alt={relatedPost.author.full_name || 'Author'}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                          {relatedPost.author?.full_name?.charAt(0) || 'A'}
                        </div>
                      )}
                      <span className="text-sm text-gray-600">
                        {relatedPost.author?.full_name || 'Anonymous'}
                      </span>
                      <span className="text-sm text-gray-400">•</span>
                      <time className="text-sm text-gray-500">
                        {relatedPost.published_at
                          ? new Date(relatedPost.published_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })
                          : ''}
                      </time>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
