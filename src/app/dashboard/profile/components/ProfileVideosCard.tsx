'use client';

import React, { useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Film, Plus, X } from 'lucide-react';
import Card from '@/common/components/composites/Card';
import useS3Upload from '@/common/hooks/useS3Upload';
import { notify } from '@/common/utils/notify';
import { useUpdateMedia } from '../hooks/useProfileUpdate';

interface ProfileVideosCardProps {
  videos: string[];
}

const MAX_VIDEOS = 10;
const MAX_SIZE_MB = 100;

const toDisplayUrl = (url: string) =>
  url.startsWith('/') ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}${url}` : url;

export const ProfileVideosCard: React.FC<ProfileVideosCardProps> = ({ videos }) => {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImages, isUploading, progress } = useS3Upload();
  const { updateMedia, isPending } = useUpdateMedia();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (files.length === 0) return;

    if (videos.length + files.length > MAX_VIDEOS) {
      notify.error(`You can have at most ${MAX_VIDEOS} videos`);
      return;
    }
    if (files.some((f) => !f.type.startsWith('video/'))) {
      notify.error('Please select video files only');
      return;
    }
    if (files.some((f) => f.size > MAX_SIZE_MB * 1024 * 1024)) {
      notify.error(`Each video must be under ${MAX_SIZE_MB}MB`);
      return;
    }

    const userId = session?.user?.id;
    const key = userId ? `${userId}/profile-videos` : 'profile-videos';
    const results = await uploadImages(files.map((file) => ({ file, key })));

    const uploaded = results.filter((r) => r.success).map((r) => r.url);
    if (uploaded.length > 0) {
      updateMedia({ profileVideos: [...videos, ...uploaded] });
    }
  };

  const handleRemove = (url: string) => {
    updateMedia({ profileVideos: videos.filter((v) => v !== url) });
  };

  const isBusy = isUploading || isPending;

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base text-neutral-900">Profile Videos</h2>
          <p className="mt-1 text-xs text-neutral-500">Shown as reels on your public profile</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isBusy || videos.length >= MAX_VIDEOS}
          className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} />
          {isUploading ? `Uploading ${Math.round(progress)}%` : 'Add Video'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-400">
          <Film size={28} />
          No videos yet — add up to {MAX_VIDEOS}, {MAX_SIZE_MB}MB each
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {videos.map((url) => (
            <div key={url} className="group relative aspect-[9/16] overflow-hidden rounded-md bg-neutral-100">
              <video src={toDisplayUrl(url)} className="h-full w-full object-cover" muted playsInline controls />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                disabled={isBusy}
                className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white opacity-0 shadow-md transition-opacity hover:bg-red-50 group-hover:opacity-100 disabled:opacity-50"
              >
                <X className="h-4 w-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
