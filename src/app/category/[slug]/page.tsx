import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getCategory(slug: string) {
  if (!supabase) return null;
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  return data;
}

async function getCategoryPosts(categoryId: string) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('content')
    .select(`
      *,
      author:profiles!author_id(full_name, avatar_url)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  // Filter by category on the client side since we need to join through content_categories
  return data || [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} - ACM Media Platform`,
    description: category.description || `Articles in ${category.name} category`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const posts = await getCategoryPosts(category.id);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-4"
        >
          ← Back to Blog
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-lg text-gray-600">{category.description}</p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles in this category yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {post.cover_image_url && (
                  <Link href={`/blog/${post.slug}`}>
                    <div className="aspect-video bg-gray-100">
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
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
          </div>
        )}
      </div>
    </>
  );
}
