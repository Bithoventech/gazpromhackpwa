export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      active_daily_quest: {
        Row: {
          created_at: string | null
          id: string
          quest_date: string
          scammer_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          quest_date: string
          scammer_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          quest_date?: string
          scammer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "active_daily_quest_scammer_id_fkey"
            columns: ["scammer_id"]
            isOneToOne: false
            referencedRelation: "daily_scammers"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_scammers: {
        Row: {
          age: number
          avatar_url: string | null
          biography: string
          contradictions: Json | null
          created_at: string | null
          difficulty_level: number
          id: string
          name: string
          role: string
          system_prompt: string
        }
        Insert: {
          age: number
          avatar_url?: string | null
          biography: string
          contradictions?: Json | null
          created_at?: string | null
          difficulty_level: number
          id?: string
          name: string
          role: string
          system_prompt: string
        }
        Update: {
          age?: number
          avatar_url?: string | null
          biography?: string
          contradictions?: Json | null
          created_at?: string | null
          difficulty_level?: number
          id?: string
          name?: string
          role?: string
          system_prompt?: string
        }
        Relationships: []
      }
      leaderboard: {
        Row: {
          created_at: string | null
          fastest_time: number | null
          id: string
          last_completed_date: string | null
          streak_days: number | null
          total_exposures: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          fastest_time?: number | null
          id?: string
          last_completed_date?: string | null
          streak_days?: number | null
          total_exposures?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          fastest_time?: number | null
          id?: string
          last_completed_date?: string | null
          streak_days?: number | null
          total_exposures?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          device_id: string
          id: string
          name: string
          total_coins: number | null
          total_xp: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          device_id: string
          id?: string
          name: string
          total_coins?: number | null
          total_xp?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          device_id?: string
          id?: string
          name?: string
          total_coins?: number | null
          total_xp?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      scammer_collection: {
        Row: {
          chat_log: Json | null
          exposed_at: string | null
          id: string
          post_chat_qa: Json | null
          scammer_id: string
          user_id: string
        }
        Insert: {
          chat_log?: Json | null
          exposed_at?: string | null
          id?: string
          post_chat_qa?: Json | null
          scammer_id: string
          user_id: string
        }
        Update: {
          chat_log?: Json | null
          exposed_at?: string | null
          id?: string
          post_chat_qa?: Json | null
          scammer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scammer_collection_scammer_id_fkey"
            columns: ["scammer_id"]
            isOneToOne: false
            referencedRelation: "daily_scammers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scammer_collection_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_daily_progress: {
        Row: {
          coins_earned: number | null
          completed: boolean | null
          completion_time: string | null
          created_at: string | null
          flags_found: Json | null
          id: string
          messages: Json | null
          quest_date: string
          scammer_id: string
          updated_at: string | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          coins_earned?: number | null
          completed?: boolean | null
          completion_time?: string | null
          created_at?: string | null
          flags_found?: Json | null
          id?: string
          messages?: Json | null
          quest_date: string
          scammer_id: string
          updated_at?: string | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          coins_earned?: number | null
          completed?: boolean | null
          completion_time?: string | null
          created_at?: string | null
          flags_found?: Json | null
          id?: string
          messages?: Json | null
          quest_date?: string
          scammer_id?: string
          updated_at?: string | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_daily_progress_scammer_id_fkey"
            columns: ["scammer_id"]
            isOneToOne: false
            referencedRelation: "daily_scammers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_daily_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_id_by_device: {
        Args: { device_id_param: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
