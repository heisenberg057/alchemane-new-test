"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  className,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("files", file);

      try {
        const res = await api.post("/media/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.data.data.media && res.data.data.media.length > 0) {
          onChange(res.data.data.media[0].url);
        }
      } catch (err) {
        console.error("Upload failed", err);
        setError("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
  });

  if (value) {
    return (
      <div className={cn("relative aspect-video w-full overflow-hidden rounded-md border", className)}>
        <Image
          src={value}
          alt="Uploaded image"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/5 transition-colors hover:bg-muted/10",
        isDragActive && "border-primary/50 bg-primary/5",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground">
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm">Uploading...</p>
          </div>
        ) : (
          <>
            <div className="rounded-full bg-background p-2 shadow-sm">
              <Upload className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Drag & drop or click to upload
              </p>
              <p className="text-xs">Supports JPG, PNG, WEBP</p>
            </div>
          </>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
