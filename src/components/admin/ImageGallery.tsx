"use client";

import { useState } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaLibrary } from "./MediaLibrary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ImageGalleryProps {
  images: string[];
  featuredImage?: string;
  onChange: (images: string[]) => void;
  onFeaturedChange: (url: string) => void;
}

function SortableImage({
  url,
  id,
  isFeatured,
  onRemove,
  onSetFeatured,
}: {
  url: string;
  id: string;
  isFeatured: boolean;
  onRemove: () => void;
  onSetFeatured: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-md border bg-muted",
        isFeatured && "ring-2 ring-primary"
      )}
    >
      <Image
        src={url}
        alt="Product"
        fill
        className="object-cover"
        sizes="200px"
      />
      
      {/* Drag Handle Overlay */}
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 cursor-move opacity-0 group-hover:opacity-100"
      />

      <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="h-6 w-6"
          onClick={onSetFeatured}
          title="Set as Featured"
        >
          <Star
            className={cn("h-3 w-3", isFeatured && "fill-primary text-primary")}
          />
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="h-6 w-6"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      {isFeatured && (
        <div className="absolute bottom-0 left-0 right-0 bg-primary/80 py-0.5 text-center text-[10px] font-bold text-white">
          FEATURED
        </div>
      )}
    </div>
  );
}

export function ImageGallery({
  images,
  featuredImage,
  onChange,
  onFeaturedChange,
}: ImageGalleryProps) {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.indexOf(active.id as string);
      const newIndex = images.indexOf(over.id as string);
      onChange(arrayMove(images, oldIndex, newIndex));
    }
  };

  const addImages = (newImages: string[]) => {
    // Prevent duplicates
    const unique = newImages.filter((url) => !images.includes(url));
    const updated = [...images, ...unique];
    onChange(updated);
    
    // Auto-set featured if none exists
    if (!featuredImage && updated.length > 0) {
      onFeaturedChange(updated[0]);
    }
  };

  const removeImage = (url: string) => {
    const updated = images.filter((img) => img !== url);
    onChange(updated);
    if (featuredImage === url) {
      onFeaturedChange(updated[0] || "");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Product Images</h3>
        <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <ImageIcon className="mr-2 h-4 w-4" /> Add Images
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>Select Images</DialogTitle>
            </DialogHeader>
            <MediaLibrary
              selectionMode
              onSelect={(media) => {
                addImages([media.url]);
                setIsLibraryOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={images} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
            {images.map((url) => (
              <SortableImage
                key={url}
                id={url}
                url={url}
                isFeatured={url === featuredImage}
                onRemove={() => removeImage(url)}
                onSetFeatured={() => onFeaturedChange(url)}
              />
            ))}
            {images.length === 0 && (
              <div
                className="col-span-full flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed text-muted-foreground hover:bg-muted/50"
                onClick={() => setIsLibraryOpen(true)}
              >
                <ImageIcon className="h-8 w-8 opacity-50" />
                <p className="mt-2 text-sm">No images added</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
