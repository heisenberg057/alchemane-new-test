"use client";

import React, { useEffect, useRef, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
// @ts-ignore
import HeaderModule from '@editorjs/header';
// @ts-ignore
import ListModule from '@editorjs/list';
// @ts-ignore
import ImageToolModule from '@editorjs/image';
// @ts-ignore
import QuoteModule from '@editorjs/quote';
// @ts-ignore
import DelimiterModule from '@editorjs/delimiter';
// @ts-ignore
import TableModule from '@editorjs/table';
// @ts-ignore
import EmbedModule from '@editorjs/embed';
// @ts-ignore
import ChecklistModule from '@editorjs/checklist';
// @ts-ignore
import MarkerModule from '@editorjs/marker';
// @ts-ignore
import InlineCodeModule from '@editorjs/inline-code';
// @ts-ignore
import UnderlineModule from '@editorjs/underline';
// @ts-ignore
import WarningModule from '@editorjs/warning';
// @ts-ignore
import RawToolModule from '@editorjs/raw';
// @ts-ignore
import UndoModule from 'editorjs-undo';

import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    ImagePlus, 
    Table as TableIcon, 
    Youtube, 
    Twitter, 
    CheckSquare, 
    Highlighter, 
    AlertTriangle, 
    Code, 
    Type,
    HelpCircle
} from 'lucide-react';
import { MediaLibrary } from './MediaLibrary';

// Cast to any to bypass incompatible Editor.js plugin type definitions
const Header = HeaderModule as any;
const List = ListModule as any;
const ImageTool = ImageToolModule as any;
const Quote = QuoteModule as any;
const Delimiter = DelimiterModule as any;
const Table = TableModule as any;
const Embed = EmbedModule as any;
const Checklist = ChecklistModule as any;
const Marker = MarkerModule as any;
const InlineCode = InlineCodeModule as any;
const Underline = UnderlineModule as any;
const Warning = WarningModule as any;
const RawTool = RawToolModule as any;
const Undo = UndoModule as any;

interface BlockEditorProps {
    value: string; // JSON string
    onChange: (value: string) => void;
    onAutosave?: (value: string) => void;
    postId?: string;
    readOnly?: boolean;
}

export function BlockEditor({ value, onChange, onAutosave, postId, readOnly = false }: BlockEditorProps) {
    const ejInstance = useRef<EditorJS | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
    const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
    
    // Embed Dialog State
    const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);
    const [embedService, setEmbedService] = useState<'youtube' | 'twitter'>('youtube');
    const [embedUrl, setEmbedUrl] = useState('');

    useEffect(() => {
        if (!containerRef.current || ejInstance.current) {
            return;
        }

        let initialData: OutputData | undefined;
        try {
            if (value) {
                initialData = JSON.parse(value);
            }
        } catch (e) {
            console.error("Failed to parse initial blocks data:", e);
        }

        const editor = new EditorJS({
            holder: containerRef.current,
            data: initialData,
            readOnly,
            placeholder: 'Start writing your amazing post...',
            tools: {
                header: {
                    class: Header,
                    config: {
                        placeholder: 'Enter a heading',
                        levels: [2, 3, 4],
                        defaultLevel: 2,
                    }
                },
                list: {
                    class: List,
                    inlineToolbar: true,
                },
                image: {
                    class: ImageTool,
                    config: {
                        endpoints: {
                            byFile: `${process.env.NEXT_PUBLIC_API_URL || '/api'}/media/editor-upload`,
                        },
                    }
                },
                quote: {
                    class: Quote,
                    inlineToolbar: true,
                    config: {
                        quotePlaceholder: 'Enter a quote',
                        captionPlaceholder: 'Quote\'s author',
                    },
                },
                delimiter: Delimiter,
                table: {
                    class: Table,
                    inlineToolbar: true,
                    config: {
                        rows: 2,
                        cols: 3,
                    },
                },
                embed: {
                    class: Embed,
                    config: {
                        services: {
                            youtube: true,
                            twitter: true,
                            instagram: true,
                            facebook: true,
                            pinterest: true,
                        },
                    },
                    inlineToolbar: true,
                },
                paragraph: {
                    // Using default internal Paragraph tool but explicit config might help validation
                    config: {
                        placeholder: 'Start typing here...'
                    }
                },
                checklist: {
                    class: Checklist,
                    inlineToolbar: true,
                },
                marker: {
                    class: Marker,
                    shortcut: 'CMD+SHIFT+M',
                },
                inlineCode: {
                    class: InlineCode,
                    shortcut: 'CMD+SHIFT+C',
                },
                underline: Underline,
                warning: {
                    class: Warning,
                    inlineToolbar: true,
                    shortcut: 'CMD+SHIFT+W',
                    config: {
                        titlePlaceholder: 'Title',
                        messagePlaceholder: 'Message',
                    },
                },
                raw: RawTool,
            },
            onReady: () => {
                const undo = new Undo({ editor });
                // Ensure initialData is valid object or default to empty structure to prevent 'in' operator error
                undo.initialize(initialData || { blocks: [] });
            },
            onChange: async (api, event) => {
                try {
                    const content = await api.saver.save();
                    const jsonString = JSON.stringify(content);
                    onChange(jsonString);

                    if (onAutosave) {
                        onAutosave(jsonString);
                    }
                } catch (e) {
                    console.error('Saving failed: ', e);
                }
            },
        });

        ejInstance.current = editor;

        return () => {
            if (ejInstance.current && ejInstance.current.destroy) {
                try {
                    ejInstance.current.destroy();
                } catch (e) {
                    console.error("EditorJS cleanup error", e);
                }
                ejInstance.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- EditorJS must initialise exactly once; value/onChange/readOnly are read at mount only
    }, []);

    const handleMediaSelect = (media: any) => {
        if (ejInstance.current) {
            ejInstance.current.blocks.insert('image', {
                file: {
                    url: media.url,
                },
                caption: media.caption || media.originalName,
                withBorder: false,
                withBackground: false,
                stretched: false
            });
            setIsMediaLibraryOpen(false);
            toast({
                title: "Image Inserted",
                description: "The image has been added to the editor.",
            });
        }
    };

    const addTable = () => {
        if (ejInstance.current) {
            ejInstance.current.blocks.insert('table');
        }
    };

    const openEmbedDialog = (service: 'youtube' | 'twitter') => {
        setEmbedService(service);
        setEmbedUrl('');
        setIsEmbedDialogOpen(true);
    };

    const handleEmbedSubmit = () => {
        if (!ejInstance.current || !embedUrl) return;

        let embedData: any = {
            service: embedService,
            source: embedUrl,
            caption: ''
        };

        // Manually handle YouTube embed URL construction
        if (embedService === 'youtube') {
            try {
                // Extract video ID from standard YouTube URL or shortened URL
                let videoId = '';
                try {
                    const urlObj = new URL(embedUrl);
                    const host = urlObj.hostname;
                    if (host.includes('youtube.com')) {
                        // Handles watch?v=, shorts/, embed/
                        if (urlObj.searchParams.get('v')) {
                          videoId = urlObj.searchParams.get('v') || '';
                        } else if (urlObj.pathname.includes('/shorts/')) {
                          videoId = urlObj.pathname.split('/shorts/')[1]?.split('?')[0] || '';
                        } else if (urlObj.pathname.includes('/embed/')) {
                          videoId = urlObj.pathname.split('/embed/')[1]?.split('?')[0] || '';
                        }
                    } else if (host.includes('youtu.be')) {
                        videoId = urlObj.pathname.slice(1).split('?')[0]; // Strip query like ?si=...
                    }
                } catch (e) {
                     // Fallback for partial URLs if necessary
                }

                if (!videoId) {
                  toast({
                    title: "Invalid YouTube URL",
                    description: "Please paste a valid YouTube video link (e.g., https://www.youtube.com/watch?v=...).",
                    variant: "destructive"
                  });
                  return; // Do not insert invalid embed
                }

                // Important: The embed URL must be set correctly for the iframe
                embedData = {
                    service: 'youtube',
                    source: embedUrl,
                    embed: `https://www.youtube.com/embed/${videoId}?rel=0`,
                    width: 580,
                    height: 320,
                    caption: ''
                };
            } catch (e) {
                console.error("Invalid YouTube URL:", e);
                toast({
                  title: "Invalid YouTube URL",
                  description: "Please check the link and try again.",
                  variant: "destructive"
                });
                return;
            }
        } else if (embedService === 'twitter') {
             // Use twitframe to bypass X-Frame restrictions
             const framedUrl = `https://twitframe.com/show?url=${encodeURIComponent(embedUrl)}`;
             embedData = {
                service: 'twitter',
                source: embedUrl,
                embed: framedUrl,
                width: 580,
                height: 320,
                caption: ''
             };
        }

        // Use the embed tool to insert the block
        ejInstance.current.blocks.insert('embed', embedData);

        setIsEmbedDialogOpen(false);
        setEmbedUrl('');
        
        toast({
            title: "Embedded Successfully",
            description: `Your ${embedService} content has been added.`,
        });
    };

    return (
        <div className="space-y-4">
             {!readOnly && (
                <div className="flex flex-wrap items-center justify-end gap-2 border-b pb-2">
                    <div className="flex items-center gap-1 border-r pr-2">
                        <Button type="button" variant="ghost" size="sm" onClick={addTable} title="Add Table">
                            <TableIcon className="h-4 w-4" />
                        </Button>
                    </div>
                    
                    <div className="flex items-center gap-1 border-r pr-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => openEmbedDialog('youtube')} title="Add YouTube">
                            <Youtube className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={() => openEmbedDialog('twitter')} title="Add Twitter">
                            <Twitter className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-1 border-r pr-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setIsShortcutsOpen(true)} title="Shortcuts & Help">
                            <HelpCircle className="h-4 w-4" />
                        </Button>
                    </div>

                    <Dialog open={isMediaLibraryOpen} onOpenChange={setIsMediaLibraryOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="outline" size="sm">
                                <ImagePlus className="mr-2 h-4 w-4" />
                                Media Library
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl h-[80vh] flex flex-col" aria-describedby="media-library-description">
                             <DialogHeader>
                                 <DialogTitle>Select Media</DialogTitle>
                                 <DialogDescription id="media-library-description">
                                     Choose an image from your media library to insert into the post.
                                 </DialogDescription>
                             </DialogHeader>
                             <div className="flex-1 overflow-hidden">
                                <MediaLibrary onSelect={handleMediaSelect} selectionMode={true} />
                             </div>
                        </DialogContent>
                    </Dialog>

                    {/* Embed Dialog */}
                    <Dialog open={isEmbedDialogOpen} onOpenChange={setIsEmbedDialogOpen}>
                        <DialogContent className="sm:max-w-md" aria-describedby="embed-dialog-description">
                            <DialogHeader>
                                <DialogTitle className="capitalize">{embedService} Embed URL</DialogTitle>
                                <DialogDescription id="embed-dialog-description">
                                    Enter the URL for the {embedService} content you wish to embed.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 py-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="embed-url">
                                        Paste a link to the content you want to display on your site.
                                    </Label>
                                    <Input
                                        id="embed-url"
                                        placeholder={`Enter ${embedService} URL here...`}
                                        value={embedUrl}
                                        onChange={(e) => setEmbedUrl(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleEmbedSubmit()}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Example: https://www.youtube.com/watch?v=...
                                    </p>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Cancel</Button>
                                </DialogClose>
                                <Button type="button" onClick={handleEmbedSubmit}>Embed</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Shortcuts Dialog */}
                    <Dialog open={isShortcutsOpen} onOpenChange={setIsShortcutsOpen}>
                        <DialogContent className="sm:max-w-md" aria-describedby="shortcuts-description">
                            <DialogHeader>
                                <DialogTitle>Editor Shortcuts</DialogTitle>
                                <DialogDescription id="shortcuts-description">
                                    Keyboard shortcuts to help you write faster.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4 text-sm">
                                <div>
                                    <h4 className="font-semibold mb-2">Block Actions</h4>
                                    <ul className="space-y-1 text-muted-foreground">
                                        <li><span className="font-mono bg-muted px-1 rounded">TAB</span> Open Menu</li>
                                        <li><span className="font-mono bg-muted px-1 rounded">CMD+Z</span> Undo</li>
                                        <li><span className="font-mono bg-muted px-1 rounded">CMD+Y</span> Redo</li>
                                        <li><span className="font-mono bg-muted px-1 rounded">ENTER</span> New Block</li>
                                        <li><span className="font-mono bg-muted px-1 rounded">SHIFT+ENTER</span> Soft Break</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Formatting</h4>
                                    <ul className="space-y-1 text-muted-foreground">
                                        <li><span className="font-mono bg-muted px-1 rounded">CMD+B</span> Bold</li>
                                        <li><span className="font-mono bg-muted px-1 rounded">CMD+I</span> Italic</li>
                                        <li><span className="font-mono bg-muted px-1 rounded">CMD+SHIFT+M</span> Highlight</li>
                                        <li><span className="font-mono bg-muted px-1 rounded">CMD+SHIFT+C</span> Inline Code</li>
                                    </ul>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button">Close</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
            <div className="prose prose-blue max-w-none dark:prose-invert">
                <div
                    ref={containerRef}
                    className="min-h-[500px] border rounded-md p-4 bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring"
                />
            </div>
        </div>
    );
}
