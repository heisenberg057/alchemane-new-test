export interface AiOptimizationScoreDistribution {
  excellent: number;
  good: number;
  fair: number;
  poor: number;
  notOptimized: number;
}

export interface AiDashboardStatistics {
  totalPosts: number;
  optimizedPosts: number;
  avgScore: number;
  scoreDistribution: AiOptimizationScoreDistribution;
}

export interface PostNeedsOptimization {
  id: number;
  title: string;
  slug: string;
  aiOptimized: boolean;
  aiOptimizationScore: number | null;
  conversationalScore: number | null;
  lastAiTest: string | null;
}

export interface AiModelStats {
  total: number;
  cited: number;
  rate: string; // Backend sends toFixed(1) which is string
}

export interface CitationStats {
  totalTests: number;
  cited: number;
  citationRate: string | number; // Backend sends toFixed(1) string, but initial 0 is number
  byModel: Record<string, AiModelStats>;
}

export interface AiDashboardData {
  statistics: AiDashboardStatistics;
  needsOptimization: PostNeedsOptimization[];
  citationStats: CitationStats;
}
