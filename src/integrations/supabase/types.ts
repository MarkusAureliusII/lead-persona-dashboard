export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          actor_run_id: string | null
          analysis_text_company_linkedin: string | null
          analysis_text_personal_linkedin: string | null
          analysis_text_website: string | null
          city: string | null
          company_linkedin_url: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          email: string | null
          email_verification_status: string | null
          enriched_data: Json | null
          facebook_url: string | null
          first_name: string | null
          id: string
          is_company_linkedin_analyzed: boolean | null
          is_custom_field_1_analyzed: boolean | null
          is_email_verification_processed: boolean | null
          is_email_verified: boolean | null
          is_personal_linkedin_analyzed: boolean | null
          is_website_analyzed: boolean | null
          keywords: string[] | null
          last_name: string | null
          person_linkedin_url: string | null
          phone: string | null
          phone_number: string | null
          raw_scraped_data: Json | null
          scrape_job_id: string | null
          source_id: string | null
          state: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          actor_run_id?: string | null
          analysis_text_company_linkedin?: string | null
          analysis_text_personal_linkedin?: string | null
          analysis_text_website?: string | null
          city?: string | null
          company_linkedin_url?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          email_verification_status?: string | null
          enriched_data?: Json | null
          facebook_url?: string | null
          first_name?: string | null
          id?: string
          is_company_linkedin_analyzed?: boolean | null
          is_custom_field_1_analyzed?: boolean | null
          is_email_verification_processed?: boolean | null
          is_email_verified?: boolean | null
          is_personal_linkedin_analyzed?: boolean | null
          is_website_analyzed?: boolean | null
          keywords?: string[] | null
          last_name?: string | null
          person_linkedin_url?: string | null
          phone?: string | null
          phone_number?: string | null
          raw_scraped_data?: Json | null
          scrape_job_id?: string | null
          source_id?: string | null
          state?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          actor_run_id?: string | null
          analysis_text_company_linkedin?: string | null
          analysis_text_personal_linkedin?: string | null
          analysis_text_website?: string | null
          city?: string | null
          company_linkedin_url?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          email_verification_status?: string | null
          enriched_data?: Json | null
          facebook_url?: string | null
          first_name?: string | null
          id?: string
          is_company_linkedin_analyzed?: boolean | null
          is_custom_field_1_analyzed?: boolean | null
          is_email_verification_processed?: boolean | null
          is_email_verified?: boolean | null
          is_personal_linkedin_analyzed?: boolean | null
          is_website_analyzed?: boolean | null
          keywords?: string[] | null
          last_name?: string | null
          person_linkedin_url?: string | null
          phone?: string | null
          phone_number?: string | null
          raw_scraped_data?: Json | null
          scrape_job_id?: string | null
          source_id?: string | null
          state?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      scrape_jobs: {
        Row: {
          apify_run_id: string | null
          finished_at: string | null
          id: string
          job_name: string | null
          lead_count: number | null
          started_at: string | null
          user_id: string | null
        }
        Insert: {
          apify_run_id?: string | null
          finished_at?: string | null
          id?: string
          job_name?: string | null
          lead_count?: number | null
          started_at?: string | null
          user_id?: string | null
        }
        Update: {
          apify_run_id?: string | null
          finished_at?: string | null
          id?: string
          job_name?: string | null
          lead_count?: number | null
          started_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      webhook_settings: {
        Row: {
          ai_chat_webhook: string | null
          created_at: string | null
          email_verification_webhook: string | null
          global_webhook_url: string | null
          id: string
          lead_processing_webhook: string | null
          lead_scraping_webhook: string | null
          linkedin_analysis_webhook: string | null
          updated_at: string | null
          user_id: string
          website_analysis_webhook: string | null
        }
        Insert: {
          ai_chat_webhook?: string | null
          created_at?: string | null
          email_verification_webhook?: string | null
          global_webhook_url?: string | null
          id?: string
          lead_processing_webhook?: string | null
          lead_scraping_webhook?: string | null
          linkedin_analysis_webhook?: string | null
          updated_at?: string | null
          user_id: string
          website_analysis_webhook?: string | null
        }
        Update: {
          ai_chat_webhook?: string | null
          created_at?: string | null
          email_verification_webhook?: string | null
          global_webhook_url?: string | null
          id?: string
          lead_processing_webhook?: string | null
          lead_scraping_webhook?: string | null
          linkedin_analysis_webhook?: string | null
          updated_at?: string | null
          user_id?: string
          website_analysis_webhook?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
