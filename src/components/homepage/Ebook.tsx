'use client';

import { useState } from 'react';
import { EbookSection } from '@/components/shared/EbookSection';
import { EbookModal } from '@/components/shared/EbookModal';
import { DEFAULT_EBOOK_ASSETS } from '@/components/shared/ebookAssets';

interface EbookProps {
  imageSrc?: string;
  mobileImageSrc?: string;
  className?: string;
}

export const Ebook = ({ 
  imageSrc = DEFAULT_EBOOK_ASSETS.desktopImageSrc,
  mobileImageSrc = DEFAULT_EBOOK_ASSETS.mobileImageSrc,
  className = "bg-[#F5F6F7]"
}: EbookProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <EbookSection 
        imageSrc={imageSrc}
        mobileImageSrc={mobileImageSrc}
        className={className}
        onClick={() => setIsModalOpen(true)}
      />

      <EbookModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        imageSrc={imageSrc}
        mobileImageSrc={mobileImageSrc}
      />
    </>
  );
};
