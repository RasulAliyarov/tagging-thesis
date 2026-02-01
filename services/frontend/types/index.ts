export interface AnalysisResult {
  _id: string;
  id: string;
  text: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  priority: 'Low' | 'Medium' | 'High';
  confidence: number;
  timestamp: string;
  tags: string[];
}

export interface SummaryStats {
  total_processed: number;
  avg_sentiment_score: number;
  high_priority_count: number;
  weekly_change: {
    processed: number;
    sentiment: number;
  };
}

export interface ChartData {
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  priority_levels: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface BatchProcessingLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface UserSettings {
  api_endpoint: string;
  api_key: string;
  auto_detect_language: boolean;
  real_time_analysis: boolean;
  save_history: boolean;
  notifications: {
    high_priority_alerts: boolean;
    batch_complete: boolean;
  };
}