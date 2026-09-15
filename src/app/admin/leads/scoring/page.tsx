"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api/endpoints";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Flame, ThermometerSun, Snowflake, ArrowUpRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";

interface LeadScore {
  id: string;
  totalScore: number;
  category: "hot" | "warm" | "cold";
  behaviorScore: number;
  intentScore: number;
  qualityScore: number;
  sourceScore: number;
  factors: any[];
}

interface FormSubmission {
  id: number;
  type: string;
  data: string; // JSON string
  status: string;
  createdAt: string;
  leadScore: number | null;
  leadCategory: string | null;
  leadScores?: LeadScore[];
}

export default function LeadScoringPage() {
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [leads, setLeads] = useState<FormSubmission[]>([]);
  const { toast } = useToast();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      // @ts-ignore - passing additional params for threshold
      const data = await api.getHotLeads(50, { threshold: 0 });
      setLeads(Array.isArray(data) ? (data as FormSubmission[]) : []);
    } catch (error) {
      console.error("Failed to fetch leads", error);
      toast({
        title: "Error",
        description: "Failed to fetch hot leads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleBulkScore = async () => {
    setScoring(true);
    try {
      await api.bulkScoreLeads();
      
      toast({
        title: "Scoring Complete",
        description: "All unscored leads have been processed.",
      });
      
      fetchLeads();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to score leads",
        variant: "destructive",
      });
    } finally {
      setScoring(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "hot":
        return <Flame className="h-4 w-4 text-orange-500" />;
      case "warm":
        return <ThermometerSun className="h-4 w-4 text-yellow-500" />;
      case "cold":
        return <Snowflake className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "hot":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">Hot Lead</Badge>;
      case "warm":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">Warm Lead</Badge>;
      case "cold":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Cold Lead</Badge>;
      default:
        return <Badge variant="outline">Unscored</Badge>;
    }
  };

  const parseFormData = (json: string) => {
    try {
      return JSON.parse(json);
    } catch (e) {
      return {};
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Scoring</h1>
          <p className="text-muted-foreground">
            AI-powered lead qualification and prioritization engine.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchLeads} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={handleBulkScore} disabled={scoring}>
            {scoring ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Flame className="mr-2 h-4 w-4" />}
            Score All Leads
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.filter(l => l.leadCategory === 'hot').length}</div>
            <p className="text-xs text-muted-foreground">Ready for immediate follow-up</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Lead Score</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.length > 0 
                ? Math.round(leads.reduce((acc, curr) => acc + (curr.leadScore || 0), 0) / leads.length)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Across top 50 leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warm Leads</CardTitle>
            <ThermometerSun className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.filter(l => l.leadCategory === 'warm').length}</div>
            <p className="text-xs text-muted-foreground">Nurture required</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Leads</CardTitle>
          <CardDescription>
            High-priority leads sorted by qualification score.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Score</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No scored leads found. Try running the scoring engine.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => {
                  const data = parseFormData(lead.data);
                  return (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-lg ${
                            (lead.leadScore || 0) >= 80 ? 'text-orange-600' : 
                            (lead.leadScore || 0) >= 50 ? 'text-yellow-600' : 'text-blue-600'
                          }`}>
                            {lead.leadScore || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{data.name || 'Unknown'}</TableCell>
                      <TableCell>{data.email || 'No email'}</TableCell>
                      <TableCell>
                        {getCategoryBadge(lead.leadCategory || 'cold')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(lead.createdAt), 'MMM d, h:mm a')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/leads?search=${data.email || ''}`}>
                            View Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
