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
      admin_credentials: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          username?: string
        }
        Relationships: []
      }
      artworks: {
        Row: {
          collection: string
          created_at: string
          description: string | null
          dimensions: string | null
          id: string
          image_url: string
          subtitle: string
          technique: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          year: string | null
        }
        Insert: {
          collection: string
          created_at?: string
          description?: string | null
          dimensions?: string | null
          id?: string
          image_url: string
          subtitle: string
          technique?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          year?: string | null
        }
        Update: {
          collection?: string
          created_at?: string
          description?: string | null
          dimensions?: string | null
          id?: string
          image_url?: string
          subtitle?: string
          technique?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      visitor_stats_countries: {
        Row: {
          country: string
          created_at: string
          id: string
          updated_at: string
          visits: number
        }
        Insert: {
          country: string
          created_at?: string
          id?: string
          updated_at?: string
          visits?: number
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          updated_at?: string
          visits?: number
        }
        Relationships: []
      }
      visitor_stats_monthly: {
        Row: {
          created_at: string
          id: string
          month: string
          updated_at: string
          visits: number
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          month: string
          updated_at?: string
          visits?: number
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          month?: string
          updated_at?: string
          visits?: number
          year?: number
        }
        Relationships: []
      }
      visitors: {
        Row: {
          browser: string | null
          country: string
          created_at: string
          device: string | null
          id: string
          path: string
        }
        Insert: {
          browser?: string | null
          country: string
          created_at?: string
          device?: string | null
          id?: string
          path: string
        }
        Update: {
          browser?: string | null
          country?: string
          created_at?: string
          device?: string | null
          id?: string
          path?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      verify_admin_credentials: {
        Args: {
          username_input: string
          password_input: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
