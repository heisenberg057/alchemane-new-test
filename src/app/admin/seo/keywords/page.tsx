"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Search, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/endpoints";

interface Keyword {
  id: number;
  keyword: string;
  url: string;
  position: number;
  searchVolume: number;
  difficulty: number;
  lastChecked: string;
  positionHistory: { position: number; date: string }[];
}

export default function KeywordTracker() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newKeyword, setNewKeyword] = useState({ keyword: "", url: "" });
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const data = await api.getTrackedKeywords();
      setKeywords(data);
    } catch (error) {
      console.error("Failed to fetch keywords:", error);
      toast({
        title: "Error",
        description: "Failed to fetch keywords",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTrack = async () => {
    if (!newKeyword.keyword || !newKeyword.url) {
      toast({ title: "Validation Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.trackKeyword(newKeyword);
      toast({ title: "Success", description: "Keyword added to tracker" });
      setIsDialogOpen(false);
      setNewKeyword({ keyword: "", url: "" });
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to track keyword", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTrendIcon = (history: { position: number }[]) => {
    if (!history || history.length < 2) return <Minus className="h-4 w-4 text-muted-foreground" />;
    
    const current = history[history.length - 1].position;
    const previous = history[history.length - 2].position;
    
    if (current < previous) return <TrendingUp className="h-4 w-4 text-green-500" />; // Lower rank is better
    if (current > previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  if (loading) {
    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Keyword Log</h1>
          <p className="text-muted-foreground">Manually log keywords and their observed positions.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Log Keyword
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logged Keywords</CardTitle>
          <CardDescription>
            Manually logged positions. Connect a rank tracking API for automated updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Logged Position</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead className="text-right">Last Checked</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="font-medium">{k.keyword}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground text-xs">
                    {k.url}
                  </TableCell>
                  <TableCell>
                    <Badge variant={k.position <= 10 ? "default" : "secondary"}>
                      {k.position || "-"}
                    </Badge>
                  </TableCell>
                  <TableCell>{k.searchVolume || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${k.difficulty > 70 ? 'bg-red-500' : k.difficulty > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${k.difficulty || 0}%` }} 
                        />
                      </div>
                      <span className="text-xs">{k.difficulty}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getTrendIcon(k.positionHistory)}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {k.lastChecked ? new Date(k.lastChecked).toLocaleDateString() : 'Pending'}
                  </TableCell>
                </TableRow>
              ))}
              {keywords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No keywords tracked yet. Add one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Keyword Position</DialogTitle>
            <DialogDescription>
              Record a keyword and its current observed position manually.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="keyword">Keyword</Label>
              <Input
                id="keyword"
                value={newKeyword.keyword}
                onChange={(e) => setNewKeyword({ ...newKeyword, keyword: e.target.value })}
                placeholder="e.g. hair transplant cost"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">Target URL</Label>
              <Input
                id="url"
                value={newKeyword.url}
                onChange={(e) => setNewKeyword({ ...newKeyword, url: e.target.value })}
                placeholder="https://americanhairline.com/..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleTrack} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Entry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
