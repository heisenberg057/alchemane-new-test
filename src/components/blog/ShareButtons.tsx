'use client';

import { Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  function openPopup(href: string) {
    window.open(href, '_blank', 'width=600,height=400,noopener,noreferrer');
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: open the URL in a new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <div className="flex items-center gap-4">
      <span className="font-bold text-sm text-gray-900">Share:</span>
      <button
        aria-label="Share on Facebook"
        onClick={() => openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`)}
        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#1877F2] hover:text-white transition-colors"
      >
        <Facebook className="w-4 h-4" />
      </button>
      <button
        aria-label="Share on Twitter / X"
        onClick={() => openPopup(`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`)}
        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#1DA1F2] hover:text-white transition-colors"
      >
        <Twitter className="w-4 h-4" />
      </button>
      <button
        aria-label="Share on LinkedIn"
        onClick={() => openPopup(`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`)}
        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#0A66C2] hover:text-white transition-colors"
      >
        <Linkedin className="w-4 h-4" />
      </button>
      <button
        aria-label={copied ? 'Link copied!' : 'Copy link'}
        onClick={copyLink}
        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-800 hover:text-white transition-colors relative"
        title={copied ? 'Copied!' : 'Copy link'}
      >
        <LinkIcon className="w-4 h-4" />
        {copied && (
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
}
