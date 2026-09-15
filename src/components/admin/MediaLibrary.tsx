"use client";

import { useState } from "react";
import { useGetMedia, useUploadMedia, Media } from "@/lib/hooks/useMedia";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Search, Image as ImageIcon, File, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { MediaDetailsPanel } from "./MediaDetailsPanel";
import Image from "next/image";

interface MediaLibraryProps {
  onSelect?: (media: Media) => void;
  selectionMode?: boolean;
}

export function MediaLibrary({ onSelect, selectionMode = false }: MediaLibraryProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("ALL");
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data, isLoading } = useGetMedia({
    search,
    type: type === "ALL" ? undefined : type,
    limit: 50,
  });

  const uploadMediaMutation = useUploadMedia();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      await uploadMediaMutation.mutateAsync(acceptedFiles);
    },
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".svg"],
      "video/*": [".mp4", ".webm"],
      "application/pdf": [".pdf"],
    },
  });

  const handleMediaClick = (media: Media) => {
    if (selectionMode && onSelect) {
      onSelect(media);
    } else {
      setSelectedMedia(media);
      setIsDetailsOpen(true);
    }
  };

  const mediaItems = data?.media || [];

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Button disabled={uploadMediaMutation.isPending}>
            {uploadMediaMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 rounded-md border">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon className="h-8 w-8 opacity-50" />
            <p>No media found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {mediaItems.map((media: any) => (
              <div
                key={media.id}
                className={cn(
                  "group relative aspect-square cursor-pointer overflow-hidden rounded-md border bg-muted transition-all hover:ring-2 hover:ring-primary",
                  selectedMedia?.id === media.id && "ring-2 ring-primary"
                )}
                onClick={() => handleMediaClick(media)}
              >
                {(media.fileType && media.fileType.startsWith("image/")) || (media.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i)) ? (
                  <Image
                    src={media.url}
                    alt={media.altText || media.originalName}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 20vw, 16vw"
                    className="object-cover transition-transform group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <File className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate">{media.originalName}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <MediaDetailsPanel
        media={selectedMedia}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      {isDragActive && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-lg border bg-background p-8 shadow-lg">
            <Upload className="h-12 w-12 text-primary" />
            <p className="text-lg font-medium">Drop files to upload</p>
          </div>
        </div>
      )}
    </div>
  );
}
