import React from 'react';
import { SharedBlockRenderer, Block } from './SharedBlockRenderer';

export type { Block };

export function BlockRenderer({
  blocks,
  prose = true,
  device,
  defaultImageFit,
}: {
  blocks: Block[];
  prose?: boolean;
  device?: 'desktop' | 'tablet' | 'mobile';
  defaultImageFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}) {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <div
      className={
        prose
          ? 'builder-renderer w-full max-w-none'
          : 'builder-renderer flex w-full flex-col gap-4'
      }
    >
      <SharedBlockRenderer
        blocks={blocks}
        options={{ interactive: false, isPreviewMode: false, device, defaultImageFit }}
        allBlocks={blocks}
      />
    </div>
  );
}
