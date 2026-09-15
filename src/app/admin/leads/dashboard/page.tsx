'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api/endpoints';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Users, MousePointerClick, Calculator, MailWarning, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

export default function OptimizationDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getOptimizationDashboard(30);
        setData(response);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  const triggers = asArray<{
    triggerType: string;
    actionType: string;
    conversionRate: number;
  }>(data.triggers);

  const abandonmentPoints = asArray(data.abandonment?.abandonmentPoints);
  const exitByPopup = asArray(data.exitIntent?.byPopupType);

  const conversion = data.conversion ?? {};
  const abandonment = data.abandonment ?? {};
  const exitIntent = data.exitIntent ?? {};
  const calculator = data.calculator ?? {};

  const formSubmitted = conversion.formSubmitted ?? conversion.totalEvents ?? 0;
  const formViewed = conversion.formViewed ?? 0;
  const conversionRatePct =
    conversion.conversionRate != null
      ? Number(conversion.conversionRate)
      : formViewed > 0
        ? (Number(formSubmitted) / Number(formViewed)) * 100
        : 0;

  const abandonmentRecoveryRate =
    abandonment.recoveryRate != null
      ? Number(abandonment.recoveryRate)
      : abandonment.emailsSent
        ? ((Number(abandonment.recovered) || 0) /
            Number(abandonment.emailsSent)) *
          100
        : 0;

  const exitConversionRate =
    exitIntent.conversionRate != null
      ? Number(exitIntent.conversionRate)
      : exitIntent.total
        ? ((Number(exitIntent.converted) || 0) / Number(exitIntent.total)) * 100
        : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Optimization Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of lead optimization performance for the last 30 days.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number.isFinite(conversionRatePct)
                ? conversionRatePct.toFixed(1)
                : "0"}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              {formSubmitted} submissions from {formViewed} views
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abandonment Recovery</CardTitle>
            <MailWarning className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number.isFinite(abandonmentRecoveryRate)
                ? abandonmentRecoveryRate.toFixed(1)
                : "0"}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              {abandonment.recovered ?? 0} recovered from{" "}
              {abandonment.emailsSent ?? 0} emails
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exit Intent Saved</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number.isFinite(exitConversionRate)
                ? exitConversionRate.toFixed(1)
                : "0"}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              {exitIntent.converted ?? 0} saved / {exitIntent.total ?? 0} shown
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.hotLeads ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              High priority for follow-up
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="abandonment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="abandonment">Form Abandonment</TabsTrigger>
          <TabsTrigger value="exit-intent">Exit Intent</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="triggers">Behavioral Triggers</TabsTrigger>
        </TabsList>

        <TabsContent value="abandonment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Abandonment Statistics</CardTitle>
              <CardDescription>
                Analysis of where users drop off and recovery effectiveness.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                   <div className="text-sm font-medium text-muted-foreground">Total Abandoned</div>
                   <div className="text-2xl font-bold">{abandonment.total ?? 0}</div>
                </div>
                <div className="p-4 border rounded-lg">
                   <div className="text-sm font-medium text-muted-foreground">Emails Sent</div>
                   <div className="text-2xl font-bold">{abandonment.emailsSent ?? 0}</div>
                </div>
                <div className="p-4 border rounded-lg bg-green-50 border-green-100">
                   <div className="text-sm font-medium text-green-700">Recovered</div>
                   <div className="text-2xl font-bold text-green-800">
                    {abandonment.recovered ?? 0}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Top Drop-off Points</h4>
                <div className="space-y-2">
                  {abandonmentPoints.map((point: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm font-medium">{point.label}</span>
                      <span className="font-bold">{point._count} drop-offs</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exit-intent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exit Intent Performance</CardTitle>
              <CardDescription>
                Effectiveness of exit intent popups by type.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {exitByPopup.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <div className="font-medium capitalize">{item.popupType}</div>
                        <div className="text-xs text-muted-foreground">Popup Variant</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item._count}</div>
                        <div className="text-xs text-muted-foreground">Impressions</div>
                      </div>
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
           <Card>
             <CardHeader>
               <CardTitle>Calculator Usage</CardTitle>
               <CardDescription>
                 Engagement with cost and graft calculators.
               </CardDescription>
             </CardHeader>
             <CardContent>
               <div className="grid gap-4 md:grid-cols-3">
                 <div className="p-4 border rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Total Usage</div>
                    <div className="text-2xl font-bold">{calculator.total ?? 0}</div>
                 </div>
                 <div className="p-4 border rounded-lg bg-green-50 border-green-100">
                    <div className="text-sm font-medium text-green-700">Converted to Lead</div>
                    <div className="text-2xl font-bold text-green-800">
                      {calculator.converted ?? 0}
                    </div>
                 </div>
                 <div className="p-4 border rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Conversion Rate</div>
                    <div className="text-2xl font-bold">
                      {calculator.conversionRate ?? 0}%
                    </div>
                 </div>
               </div>
             </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="triggers" className="space-y-4">
           <Card>
             <CardHeader>
               <CardTitle>Behavioral Triggers</CardTitle>
               <CardDescription>
                 Impact of automated behavioral interventions.
               </CardDescription>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                  {triggers.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium capitalize flex items-center gap-2">
                           <Zap className="w-4 h-4 text-yellow-500" />
                           {String(item.triggerType ?? "unknown").replace(/_/g, ' ')}
                        </div>
                        <div className="text-xs text-muted-foreground">Action: {item.actionType ?? "—"}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{item.conversionRate ?? 0}%</div>
                        <div className="text-xs text-muted-foreground">Conversion Rate</div>
                      </div>
                    </div>
                  ))}
                  {triggers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No trigger data available yet.
                    </div>
                  )}
               </div>
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
