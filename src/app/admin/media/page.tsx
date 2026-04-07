'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Media } from '@/lib/database.types';

export default function MediaManagement() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      if (!supabase) {
        alert('Database not configured');
        return;
      }
      setUploading(true);

      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Create media record
      const { data: newMedia, error: dbError } = await supabase
        .from('media')
        .insert({
          name: selectedFile.name,
          file_path: filePath,
          file_size: selectedFile.size,
          mime_type: selectedFile.type,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setMedia([newMedia, ...media]);
      setSelectedFile(null);
      alert('Media uploaded successfully!');
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
      if (!supabase) return;
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      setMedia(media.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Failed to delete media');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
        <p className="text-gray-600 mt-1">Manage your images and files</p>
      </div>

      {/* Upload */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Media</h2>
        <div className="flex items-center gap-4">
          <input
            type="file"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            accept="image/*"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
          </p>
        )}
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading media...</div>
        ) : media.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No media files yet. Upload your first image to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {media.map((item) => {
              if (!supabase) return null;
              const { data: { publicUrl } } = supabase.storage
                .from('media')
                .getPublicUrl(item.file_path);

              return (
                <div key={item.id} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={publicUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <button
                      onClick={() => copyToClipboard(publicUrl)}
                      className="px-3 py-1 bg-white text-gray-900 rounded text-sm font-medium hover:bg-gray-100"
                    >
                      Copy URL
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.file_path)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(item.file_size)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
