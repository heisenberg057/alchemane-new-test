"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Media, useDeleteMedia, useUpdateMedia } from "@/lib/hooks/useMedia";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Added Textarea
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Copy, Download, Trash, Loader2, File, Video } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

interface MediaDetailsPanelProps {
  media: Media | null;
  isOpen: boolean;
  onClose: () => void;
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function MediaDetailsPanel({ media, isOpen, onClose }: MediaDetailsPanelProps) {
  const { toast } = useToast();
  const updateMediaMutation = useUpdateMedia();
  const deleteMediaMutation = useDeleteMedia();

  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState(""); // Added state
  const [description, setDescription] = useState(""); // Added state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (media) {
      setAltText(media.altText || "");
      setCaption(media.caption || "");
      setTitle(media.title || ""); // Initialize
      setDescription(media.description || ""); // Initialize
    }
  }, [media]);

  const handleUpdate = async () => {
    if (!media) return;
    try {
      await updateMediaMutation.mutateAsync({
        id: media.id,
        altText,
        caption,
        title, // Include in update
        description, // Include in update
      });
      toast({
        title: "Success",
        description: "Media details updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update media details",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!media) return;
    try {
      await deleteMediaMutation.mutateAsync(media.id);
      toast({
        title: "Success",
        description: "Media deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete media",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    if (media?.url) {
      navigator.clipboard.writeText(media.url);
      toast({
        title: "Copied",
        description: "URL copied to clipboard",
      });
    }
  };

  if (!media) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Media Details</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] pr-4 mt-6">
          <div className="space-y-6">
            <div className="aspect-video w-full overflow-hidden rounded-md border bg-muted flex items-center justify-center">
              {(media.fileType && media.fileType.startsWith("image/")) || (media.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i)) ? (
                <div className="relative h-full w-full">
                  <Image
                    src={media.url}
                    alt={media.altText || media.originalName}
                    fill
                    sizes="(max-width: 640px) 100vw, 448px"
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <div className="h-16 w-16 rounded-full bg-background p-4 shadow-sm flex items-center justify-center">
                    {media.fileType?.startsWith("video/") ? (
                      <Video className="h-8 w-8" />
                    ) : (
                      <File className="h-8 w-8" />
                    )}
                  </div>
                  <p className="text-sm">No preview available</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Uploaded</p>
                  <p>{format(new Date(media.createdAt), "PPP")}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Size</p>
                  <p>{media.fileSize ? (media.fileSize / 1024).toFixed(2) : "0"} KB</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Dimensions</p>
                  <p>
                    {media.width || 0} x {media.height || 0}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Type</p>
                  <p>{media.fileType || "Unknown"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Media title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="altText">Alt Text</Label>
                <Input
                  id="altText"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe the image for accessibility"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty if the image is purely decorative.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Input
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Image caption"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the media"
                  className="h-20"
                />
              </div>

              <Button
                onClick={handleUpdate}
                disabled={updateMediaMutation.isPending}
                className="w-full"
              >
                {updateMediaMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={copyToClipboard}
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy URL
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a href={media.url} download target="_blank" rel="noreferrer">
                    <Download className="mr-2 h-4 w-4" /> Download
                  </a>
                </Button>
              </div>

              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full"
                    disabled={deleteMediaMutation.isPending}
                  >
                    <Trash className="mr-2 h-4 w-4" /> Delete File
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the file
                      and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
