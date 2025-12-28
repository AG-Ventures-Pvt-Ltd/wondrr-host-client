'use client';

import React from 'react';
import Modal from '@/common/components/composites/Modal';
import { Share2, Copy, Mail, MessageCircle, Facebook, Twitter, Linkedin } from 'lucide-react';
import Button from '@/common/components/atoms/Button';
import { notify } from '@/common/utils/notify';
import {logError} from '@/common/utils/logError';

interface ShareTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
  tripSlug: string;
}

type SharePlatform = 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'email';

const ShareTripModal: React.FC<ShareTripModalProps> = ({ isOpen, onClose, tripTitle, tripSlug }) => {

    const tripLink = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/trip/${tripSlug}`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(tripLink);
      notify.success('Link copied to clipboard!');
    } catch (err) {
        logError({ error: err, location : "src/app/dashboard/trips/[id]/components/ShareTripModal.jsx", when : "copying trip link" });
      notify.error('Failed to copy link');
    }
  };

  const handleShare = (platform: SharePlatform) => {
    const utmParams = `?utm_source=${platform}`;
    const fullLink = `${tripLink}${utmParams}`;
    const encodedLink = encodeURIComponent(fullLink);
    const encodedTitle = encodeURIComponent(tripTitle);
    
    const shareLinks: Record<SharePlatform, string> = {
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedLink}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
      twitter: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedLink}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`,
      email: `mailto:?subject=${encodedTitle}&body=Check out this amazing trip: ${encodedLink}`
    };

    if (shareLinks[platform]) {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title=""
      description=""
      showButtons={false}
    >
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 mt-0.5">
              <Share2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-neutral-950 leading-5">
                Share {tripTitle}
              </h2>
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-5">
            Share this link with your audience on social media or copy it to your clipboard
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-700 leading-5">Link</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-10 bg-neutral-50 rounded-2xl border border-neutral-200 px-4 flex items-center overflow-hidden">
              <span className="text-sm text-neutral-700 truncate">{tripLink}</span>
            </div>
            <Button
              onClick={handleCopyLink}
              className="h-10 px-4 bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-sm flex items-center gap-2"
            >
              <Copy className="w-4 h-4 text-white" />
              <span className="text-sm text-white">Copy</span>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-sm text-neutral-700 leading-5">Share via</label>
          <div className="flex gap-[14.8px]">
            <Button
              onClick={() => handleShare('whatsapp')}
              className="w-20 h-20 py-4 bg-green-500! hover:bg-green-600! rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 transition-colors"
              variant="text"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span className="text-xs text-white leading-4">WhatsApp</span>
            </Button>
            <Button
              onClick={() => handleShare('facebook')}
              className="w-20 h-20 py-4 bg-blue-600! hover:bg-blue-700! rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 transition-colors"
              variant="text"
            >
              <Facebook className="w-5 h-5 text-white" />
              <span className="text-xs text-white leading-4">Facebook</span>
            </Button>
            <Button
              onClick={() => handleShare('twitter')}
              className="w-20 h-20 py-4 bg-black! hover:bg-gray-800! rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 transition-colors"
              variant="text"
            >
              <Twitter className="w-4 h-4 text-white" />
              <span className="text-xs text-white leading-4">X</span>
            </Button>
            <Button
              onClick={() => handleShare('linkedin')}
              className="w-20 h-20 py-4 bg-sky-600! hover:bg-sky-700! rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 transition-colors"
              variant="text"
            >
              <Linkedin className="w-5 h-5 text-white" />
              <span className="text-xs text-white leading-4">LinkedIn</span>
            </Button>
            <Button
              onClick={() => handleShare('email')}
              className="w-20 h-20 py-4 bg-neutral-600! hover:bg-neutral-700! rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 transition-colors"
              variant="text"
            >
              <Mail className="w-5 h-5 text-white" />
              <span className="text-xs text-white leading-4">Email</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareTripModal;
