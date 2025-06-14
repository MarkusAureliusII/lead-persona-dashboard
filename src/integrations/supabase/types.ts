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
      csv_leads: {
        Row: {
          created_at: string
          csv_upload_id: string
          error_message: string | null
          id: string
          language: string | null
          lead_data: Json
          personalized_message: string | null
          processed_at: string | null
          processing_status: string
          row_index: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          csv_upload_id: string
          error_message?: string | null
          id?: string
          language?: string | null
          lead_data: Json
          personalized_message?: string | null
          processed_at?: string | null
          processing_status?: string
          row_index: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          csv_upload_id?: string
          error_message?: string | null
          id?: string
          language?: string | null
          lead_data?: Json
          personalized_message?: string | null
          processed_at?: string | null
          processing_status?: string
          row_index?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "csv_leads_csv_upload_id_fkey"
            columns: ["csv_upload_id"]
            isOneToOne: false
            referencedRelation: "csv_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      csv_uploads: {
        Row: {
          created_at: string
          filename: string
          id: string
          row_count: number
          status: string
          updated_at: string
          upload_date: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          filename: string
          id?: string
          row_count?: number
          status?: string
          updated_at?: string
          upload_date?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          filename?: string
          id?: string
          row_count?: number
          status?: string
          updated_at?: string
          upload_date?: string
          user_id?: string | null
        }
        Relationships: []
      }
      cultural_contexts: {
        Row: {
          business_practices: Json | null
          communication_style: Json | null
          created_at: string
          cultural_notes: string | null
          id: string
          language: string
          region: string | null
          updated_at: string
        }
        Insert: {
          business_practices?: Json | null
          communication_style?: Json | null
          created_at?: string
          cultural_notes?: string | null
          id?: string
          language: string
          region?: string | null
          updated_at?: string
        }
        Update: {
          business_practices?: Json | null
          communication_style?: Json | null
          created_at?: string
          cultural_notes?: string | null
          id?: string
          language?: string
          region?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      personalization_configs: {
        Row: {
          created_at: string
          csv_upload_id: string
          id: string
          language: string
          product_service: string
          tonality: string
        }
        Insert: {
          created_at?: string
          csv_upload_id: string
          id?: string
          language?: string
          product_service: string
          tonality: string
        }
        Update: {
          created_at?: string
          csv_upload_id?: string
          id?: string
          language?: string
          product_service?: string
          tonality?: string
        }
        Relationships: [
          {
            foreignKeyName: "personalization_configs_csv_upload_id_fkey"
            columns: ["csv_upload_id"]
            isOneToOne: false
            referencedRelation: "csv_uploads"
            referencedColumns: ["id"]
          },
        ]
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
