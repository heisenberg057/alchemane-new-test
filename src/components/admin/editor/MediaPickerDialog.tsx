"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon } from 'lucide-react';
import { MediaLibrary } from '@/components/admin/MediaLibrary';
import type { Media } from '@/lib/hooks/useMedia';

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: Media) => void;
  triggerLabel?: string;
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  triggerLabel = 'Choose from Media Library',
}: MediaPickerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="w-full bg-[#131415] border-[#1d1f21] text-xs hover:bg-[#1d1f21] text-white"
        >
          <ImageIcon className="mr-1.5 h-3.5 w-3.5" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[80vh] max-w-5xl">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>
        <MediaLibrary
          selectionMode
          onSelect={(media) => {
            onSelect(media);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
