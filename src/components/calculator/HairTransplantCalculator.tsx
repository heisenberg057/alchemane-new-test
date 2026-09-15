'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Calculator as CalcIcon, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api/endpoints';
import { useLeadOptimization } from '@/hooks/useLeadOptimization';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const calculatorSchema = z.object({
  technique: z.enum(['FUE', 'FUT']),
  location: z.string(),
  graftsNeeded: z.number().min(500).max(6000),
});

type CalculatorValues = z.infer<typeof calculatorSchema>;

export const HairTransplantCalculator = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [aiEstimate, setAiEstimate] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [description, setDescription] = useState('');
  
  const { sessionId } = useLeadOptimization();

  const form = useForm<CalculatorValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      technique: 'FUE',
      location: 'US',
      graftsNeeded: 2000,
    },
  });

  const onSubmit = async (data: CalculatorValues) => {
    setLoading(true);
    try {
      const response = await api.calculateCost({
        ...data,
        sessionId
      });
      setResult(response);
      
      // Save result to local storage for form linking
      localStorage.setItem('ah_calculator_data', JSON.stringify(response));
    } catch (error) {
      console.error('Calculation failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAiEstimate = async () => {
    if (!description) return;
    setAiLoading(true);
    try {
      const response = await api.estimateGraftsWithAi(description);
      setAiEstimate(response);
      form.setValue('graftsNeeded', response.estimatedGrafts);
    } catch (error) {
      console.error('AI Estimation failed', error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Calculator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalcIcon className="w-5 h-5" />
            Cost Calculator
          </CardTitle>
          <CardDescription>
            Estimate your hair transplant cost instantly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Technique</Label>
              <Select 
                onValueChange={(val) => form.setValue('technique', val as 'FUE' | 'FUT')}
                defaultValue={form.getValues('technique')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Technique" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FUE">FUE (Follicular Unit Extraction)</SelectItem>
                  <SelectItem value="FUT">FUT (Follicular Unit Transplantation)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Select 
                onValueChange={(val) => form.setValue('location', val)}
                defaultValue={form.getValues('location')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="Turkey">Turkey</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="Mexico">Mexico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Grafts Needed: {form.watch('graftsNeeded')}</Label>
              </div>
              <Slider 
                defaultValue={[2000]} 
                min={500} 
                max={6000} 
                step={100}
                onValueChange={(vals) => form.setValue('graftsNeeded', vals[0])}
                value={[form.watch('graftsNeeded')]}
              />
              <p className="text-xs text-muted-foreground">
                Don't know how many grafts? Use our AI estimator below.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Calculate Cost'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results & AI */}
      <div className="space-y-8">
        {/* Results */}
        {result && (
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Estimated Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary mb-2">
                ${result.estimatedCost.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Range: ${result.range.min.toLocaleString()} - ${result.range.max.toLocaleString()}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Cost:</span>
                  <span>${result.breakdown.baseCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location Adjustment:</span>
                  <span>${result.breakdown.locationAdjustment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Cost Per Graft:</span>
                  <span>${result.costPerGraft}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" onClick={() => window.location.href = '/contact-us'}>
                Get Official Quote
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* AI Estimator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Graft Estimator</CardTitle>
            <CardDescription>
              Describe your hair loss pattern (e.g., "Receding hairline at temples, thinning crown").
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Describe your hair loss..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button 
              variant="secondary" 
              className="w-full" 
              onClick={handleAiEstimate}
              disabled={aiLoading || !description}
            >
              {aiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Estimate Grafts with AI
            </Button>

            {aiEstimate && (
              <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                <div className="font-semibold text-primary">
                  AI Estimate: {aiEstimate.estimatedGrafts} grafts
                </div>
                <div className="text-xs text-muted-foreground">
                  Confidence: {(aiEstimate.confidence * 100).toFixed(0)}%
                </div>
                <p>{aiEstimate.recommendation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
