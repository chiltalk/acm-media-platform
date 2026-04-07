'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Stats {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  totalMedia: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalContent: 0,
    publishedContent: 0,
    draftContent: 0,
    totalMedia: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const [contentCount, publishedCount, draftCount, mediaCount] = await Promise.all([
        supabase.from('content').select('*', { count: 'exact', head: true }),
        supabase.from('content').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('content').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('media').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalContent: contentCount.count || 0,
        publishedContent: publishedCount.count || 0,
        draftContent: draftCount.count || 0,
        totalMedia: mediaCount.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { name: 'Total Content', value: stats.totalContent, color: 'bg-blue-500' },
    { name: 'Published', value: stats.publishedContent, color: 'bg-green-500' },
    { name: 'Drafts', value: stats.draftContent, color: 'bg-yellow-500' },
    { name: 'Media Files', value: stats.totalMedia, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-600 mt-1">
          Here&apos;s what&apos;s happening with your content today.
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                  📊
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/content/new"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">➕</span>
            <div>
              <p className="font-medium text-gray-900">Create New Content</p>
              <p className="text-sm text-gray-600">Start writing a new article</p>
            </div>
          </Link>
          <Link
            href="/admin/media"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">📤</span>
            <div>
              <p className="font-medium text-gray-900">Upload Media</p>
              <p className="text-sm text-gray-600">Add images or files</p>
            </div>
          </Link>
          <Link
            href="/admin/content"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">📝</span>
            <div>
              <p className="font-medium text-gray-900">Manage Content</p>
              <p className="text-sm text-gray-600">View and edit all content</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Content</h2>
          <Link
            href="/admin/content"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View all →
          </Link>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>Recent content will appear here once you start creating content.</p>
        </div>
      </div>
    </div>
  );
}
