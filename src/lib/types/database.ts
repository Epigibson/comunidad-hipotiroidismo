// NOTE: This file will be auto-generated with `npx supabase gen types typescript`
// once the database schema is created. For now, we define the types manually.

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
      profiles: {
        Row: {
          id: string;
          alias: string | null;
          full_name: string | null;
          role: "patient" | "family" | "moderator" | "specialist";
          avatar_url: string | null;
          is_verified_specialist: boolean;
          bio: string | null;
          birth_year: number | null;
          date_of_birth: string | null;
          gender: string | null;
          onboarding_completed: boolean | null;
          default_medication_name: string | null;
          default_medication_dose: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          alias?: string | null;
          full_name?: string | null;
          role?: "patient" | "family" | "moderator" | "specialist";
          avatar_url?: string | null;
          is_verified_specialist?: boolean;
          bio?: string | null;
          birth_year?: number | null;
          date_of_birth?: string | null;
          gender?: string | null;
          onboarding_completed?: boolean | null;
          default_medication_name?: string | null;
          default_medication_dose?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          alias?: string | null;
          full_name?: string | null;
          role?: "patient" | "family" | "moderator" | "specialist";
          avatar_url?: string | null;
          is_verified_specialist?: boolean;
          bio?: string | null;
          birth_year?: number | null;
          date_of_birth?: string | null;
          gender?: string | null;
          onboarding_completed?: boolean | null;
          default_medication_name?: string | null;
          default_medication_dose?: number | null;
          updated_at?: string;
        };
      };
      health_conditions: {
        Row: {
          id: string;
          user_id: string;
          condition_name: string;
          condition_type: "hypothyroidism" | "hashimoto" | "pcos" | "other";
          diagnosis_date: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          condition_name: string;
          condition_type: "hypothyroidism" | "hashimoto" | "pcos" | "other";
          diagnosis_date?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          condition_name?: string;
          condition_type?: "hypothyroidism" | "hashimoto" | "pcos" | "other";
          diagnosis_date?: string | null;
          notes?: string | null;
        };
      };
      daily_logs: {
        Row: {
          id: string;
          user_id: string;
          log_date: string;
          energy_level: number | null;
          brain_fog_level: number | null;
          mood_level: number | null;
          joint_pain_level: number | null;
          sleep_hours: number | null;
          weight_kg: number | null;
          medication_taken: boolean;
          medication_dose_mcg: number | null;
          medication_name: string;
          custom_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          log_date?: string;
          energy_level?: number | null;
          brain_fog_level?: number | null;
          mood_level?: number | null;
          joint_pain_level?: number | null;
          sleep_hours?: number | null;
          weight_kg?: number | null;
          medication_taken?: boolean;
          medication_dose_mcg?: number | null;
          medication_name?: string;
          custom_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          log_date?: string;
          energy_level?: number | null;
          brain_fog_level?: number | null;
          mood_level?: number | null;
          joint_pain_level?: number | null;
          sleep_hours?: number | null;
          weight_kg?: number | null;
          medication_taken?: boolean;
          medication_dose_mcg?: number | null;
          medication_name?: string;
          custom_notes?: string | null;
          updated_at?: string;
        };
      };
      lab_results: {
        Row: {
          id: string;
          user_id: string;
          test_date: string;
          tsh_level: number | null;
          t3_free: number | null;
          t4_free: number | null;
          t3_total: number | null;
          t4_total: number | null;
          anti_tpo: number | null;
          anti_tg: number | null;
          lab_name: string | null;
          notes: string | null;
          file_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          test_date: string;
          tsh_level?: number | null;
          t3_free?: number | null;
          t4_free?: number | null;
          t3_total?: number | null;
          t4_total?: number | null;
          anti_tpo?: number | null;
          anti_tg?: number | null;
          lab_name?: string | null;
          notes?: string | null;
          file_url?: string | null;
          created_at?: string;
        };
        Update: {
          test_date?: string;
          tsh_level?: number | null;
          t3_free?: number | null;
          t4_free?: number | null;
          t3_total?: number | null;
          t4_total?: number | null;
          anti_tpo?: number | null;
          anti_tg?: number | null;
          lab_name?: string | null;
          notes?: string | null;
          file_url?: string | null;
        };
      };
      community_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          has_trigger_warning: boolean;
          trigger_warning_text: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          has_trigger_warning?: boolean;
          trigger_warning_text?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          has_trigger_warning?: boolean;
          trigger_warning_text?: string | null;
          sort_order?: number;
        };
      };
      community_threads: {
        Row: {
          id: string;
          author_id: string | null;
          category_id: string;
          title: string;
          content: string;
          is_anonymous: boolean;
          is_pinned: boolean;
          is_locked: boolean;
          has_trigger_warning: boolean;
          trigger_tags: string[];
          reply_count: number;
          like_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id?: string | null;
          category_id: string;
          title: string;
          content: string;
          is_anonymous?: boolean;
          is_pinned?: boolean;
          is_locked?: boolean;
          has_trigger_warning?: boolean;
          trigger_tags?: string[];
          reply_count?: number;
          like_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          is_anonymous?: boolean;
          is_pinned?: boolean;
          is_locked?: boolean;
          has_trigger_warning?: boolean;
          trigger_tags?: string[];
          reply_count?: number;
          like_count?: number;
          updated_at?: string;
        };
      };
      community_replies: {
        Row: {
          id: string;
          thread_id: string;
          author_id: string | null;
          content: string;
          is_anonymous: boolean;
          like_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          author_id?: string | null;
          content: string;
          is_anonymous?: boolean;
          like_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          is_anonymous?: boolean;
          like_count?: number;
          updated_at?: string;
        };
      };
      buddy_matches: {
        Row: {
          id: string;
          user_a: string;
          user_b: string;
          status: "pending" | "active" | "declined" | "ended";
          match_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_a: string;
          user_b: string;
          status?: "pending" | "active" | "declined" | "ended";
          match_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: "pending" | "active" | "declined" | "ended";
          match_reason?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      [_ in never]: never
    };
    Enums: {
      [_ in never]: never
    };
  };
};

// Convenience type aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type DailyLog = Database["public"]["Tables"]["daily_logs"]["Row"];
export type LabResult = Database["public"]["Tables"]["lab_results"]["Row"];
export type HealthCondition = Database["public"]["Tables"]["health_conditions"]["Row"];
export type CommunityCategory = Database["public"]["Tables"]["community_categories"]["Row"];
export type CommunityThread = Database["public"]["Tables"]["community_threads"]["Row"];
export type CommunityReply = Database["public"]["Tables"]["community_replies"]["Row"];
export type BuddyMatch = Database["public"]["Tables"]["buddy_matches"]["Row"];
