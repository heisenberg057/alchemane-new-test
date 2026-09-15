"use client";

import { useState } from "react";
import { useGetCampaignPerformance, useGetCampaignList } from "@/lib/hooks/useTracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download, Loader2, TrendingUp, MousePointerClick, Target, DollarSign } from "lucide-react";
import { addDays, format, subDays } from "date-fns";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function CampaignAnalyticsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");

  const { data: performanceData, isLoading } = useGetCampaignPerformance(dateRange, {
    campaignName: selectedCampaign === "all" ? undefined : selectedCampaign,
  });

  const { data: campaignList } = useGetCampaignList();

  // Aggregate Overview Data
  const totalClicks = performanceData?.reduce((acc: number, curr: any) => acc + curr.clicks, 0) || 0;
  const totalConversions = performanceData?.reduce((acc: number, curr: any) => acc + curr.conversions, 0) || 0;
  const totalRevenue = performanceData?.reduce((acc: number, curr: any) => acc + (curr.revenue || 0), 0) || 0;
  const overallConversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : "0";

  // Chart Data Preparation
  const chartData = performanceData?.map((item: any) => ({
    name: item.adName || item.campaignName,
    clicks: item.clicks,
    conversions: item.conversions,
  })) || [];

  const handleExport = () => {
    if (!performanceData) return;
    
    const headers = ["Campaign", "Ad Set", "Ad", "Clicks", "Conversions", "Rate", "Revenue"];
    const csvContent = [
      headers.join(","),
      ...performanceData.map((row: any) => 
        [row.campaignName, row.adSetName, row.adName, row.clicks, row.conversions, row.conversionRate, row.revenue].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campaign-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Analytics</h1>
          <p className="text-muted-foreground">
            Track performance across Facebook and other channels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker date={dateRange} setDate={setDateRange} />
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across selected campaigns
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Form submissions tracked
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallConversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Click-to-lead efficiency
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600/80">
              Based on lead valuation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select Campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            {campaignList?.map((c: any) => (
              <SelectItem key={c.name} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="clicks" fill="#8884d8" name="Clicks" />
                <Bar yAxisId="right" dataKey="conversions" fill="#82ca9d" name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Conversions by Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => `${props.name} ${((props.percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="conversions"
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Ad Set</TableHead>
                <TableHead>Ad Name</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Est. Rev</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceData?.map((row: any, i: number) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{row.campaignName}</TableCell>
                  <TableCell>{row.adSetName || '-'}</TableCell>
                  <TableCell>{row.adName || '-'}</TableCell>
                  <TableCell className="text-right">{row.clicks}</TableCell>
                  <TableCell className="text-right">{row.conversions}</TableCell>
                  <TableCell className="text-right">{row.conversionRate}</TableCell>
                  <TableCell className="text-right">₹{(row.revenue || 0).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {performanceData?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No data found for the selected period
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
