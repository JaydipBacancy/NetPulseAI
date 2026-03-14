export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      analysis_reports: {
        Row: {
          created_at: string;
          generated_at: string;
          id: string;
          likely_causes: string[];
          network_slice: string;
          node_id: string;
          recommendations: string[];
          risk_level: Database["public"]["Enums"]["risk_level_enum"];
          source_alert_ids: string[];
          summary: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          generated_at: string;
          id?: string;
          likely_causes?: string[];
          network_slice: string;
          node_id: string;
          recommendations?: string[];
          risk_level: Database["public"]["Enums"]["risk_level_enum"];
          source_alert_ids?: string[];
          summary: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          generated_at?: string;
          id?: string;
          likely_causes?: string[];
          network_slice?: string;
          node_id?: string;
          recommendations?: string[];
          risk_level?: Database["public"]["Enums"]["risk_level_enum"];
          source_alert_ids?: string[];
          summary?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      network_alerts: {
        Row: {
          created_at: string;
          current_value: number;
          id: string;
          metric_id: string;
          metric_type: Database["public"]["Enums"]["metric_type_enum"];
          network_slice: string;
          node_id: string;
          resolved_at: string | null;
          severity: Database["public"]["Enums"]["alert_severity_enum"];
          status: Database["public"]["Enums"]["alert_status_enum"];
          summary: string;
          threshold_value: number;
          title: string;
          triggered_at: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          current_value: number;
          id?: string;
          metric_id: string;
          metric_type: Database["public"]["Enums"]["metric_type_enum"];
          network_slice: string;
          node_id: string;
          resolved_at?: string | null;
          severity: Database["public"]["Enums"]["alert_severity_enum"];
          status: Database["public"]["Enums"]["alert_status_enum"];
          summary: string;
          threshold_value: number;
          title: string;
          triggered_at: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          current_value?: number;
          id?: string;
          metric_id?: string;
          metric_type?: Database["public"]["Enums"]["metric_type_enum"];
          network_slice?: string;
          node_id?: string;
          resolved_at?: string | null;
          severity?: Database["public"]["Enums"]["alert_severity_enum"];
          status?: Database["public"]["Enums"]["alert_status_enum"];
          summary?: string;
          threshold_value?: number;
          title?: string;
          triggered_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      network_metrics: {
        Row: {
          created_at: string;
          id: string;
          metric_type: Database["public"]["Enums"]["metric_type_enum"];
          metric_value: number;
          node_id: string;
          recorded_at: string;
          sample_window: string;
          threshold_value: number | null;
          unit: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          metric_type: Database["public"]["Enums"]["metric_type_enum"];
          metric_value: number;
          node_id: string;
          recorded_at: string;
          sample_window?: string;
          threshold_value?: number | null;
          unit: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          metric_type?: Database["public"]["Enums"]["metric_type_enum"];
          metric_value?: number;
          node_id?: string;
          recorded_at?: string;
          sample_window?: string;
          threshold_value?: number | null;
          unit?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      network_nodes: {
        Row: {
          availability_pct: number;
          created_at: string;
          id: string;
          name: string;
          network_slice: string;
          node_type: string;
          region: string;
          site_code: string;
          software_version: string;
          status: Database["public"]["Enums"]["node_status_enum"];
          updated_at: string;
          vendor: string;
        };
        Insert: {
          availability_pct: number;
          created_at?: string;
          id?: string;
          name: string;
          network_slice: string;
          node_type: string;
          region: string;
          site_code: string;
          software_version: string;
          status?: Database["public"]["Enums"]["node_status_enum"];
          updated_at?: string;
          vendor: string;
        };
        Update: {
          availability_pct?: number;
          created_at?: string;
          id?: string;
          name?: string;
          network_slice?: string;
          node_type?: string;
          region?: string;
          site_code?: string;
          software_version?: string;
          status?: Database["public"]["Enums"]["node_status_enum"];
          updated_at?: string;
          vendor?: string;
        };
        Relationships: [];
      };
      test_cases: {
        Row: {
          category: string;
          created_at: string;
          description: string;
          estimated_duration_seconds: number;
          id: string;
          is_active: boolean;
          name: string;
          pass_condition: Database["public"]["Enums"]["test_operator_enum"];
          pass_threshold: number;
          slug: string;
          target_metric: Database["public"]["Enums"]["metric_type_enum"];
          updated_at: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          description: string;
          estimated_duration_seconds: number;
          id?: string;
          is_active?: boolean;
          name: string;
          pass_condition: Database["public"]["Enums"]["test_operator_enum"];
          pass_threshold: number;
          slug: string;
          target_metric: Database["public"]["Enums"]["metric_type_enum"];
          updated_at?: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          description?: string;
          estimated_duration_seconds?: number;
          id?: string;
          is_active?: boolean;
          name?: string;
          pass_condition?: Database["public"]["Enums"]["test_operator_enum"];
          pass_threshold?: number;
          slug?: string;
          target_metric?: Database["public"]["Enums"]["metric_type_enum"];
          updated_at?: string;
        };
        Relationships: [];
      };
      test_results: {
        Row: {
          created_at: string;
          details: Json;
          executed_at: string;
          id: string;
          node_id: string;
          observed_value: number;
          status: Database["public"]["Enums"]["test_result_status_enum"];
          summary: string;
          test_case_id: string;
          threshold_value: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          details?: Json;
          executed_at: string;
          id?: string;
          node_id: string;
          observed_value: number;
          status: Database["public"]["Enums"]["test_result_status_enum"];
          summary: string;
          test_case_id: string;
          threshold_value: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          details?: Json;
          executed_at?: string;
          id?: string;
          node_id?: string;
          observed_value?: number;
          status?: Database["public"]["Enums"]["test_result_status_enum"];
          summary?: string;
          test_case_id?: string;
          threshold_value?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      alert_severity_enum: "critical" | "warning" | "info";
      alert_status_enum: "open" | "resolved";
      metric_type_enum:
        | "latency_ms"
        | "throughput_mbps"
        | "packet_loss_pct"
        | "jitter_ms";
      node_status_enum: "online" | "degraded" | "offline" | "maintenance";
      risk_level_enum: "low" | "medium" | "high" | "critical";
      test_operator_enum: "lte" | "gte";
      test_result_status_enum: "pass" | "fail";
    };
    CompositeTypes: Record<string, never>;
  };
};
