export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          business_name: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          business_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          business_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          invoice_number: string
          client_name: string
          client_email: string
          amount: number
          tax: number
          total: number
          due_date: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          invoice_number: string
          client_name: string
          client_email: string
          amount: number
          tax: number
          total: number
          due_date: string
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          invoice_number?: string
          client_name?: string
          client_email?: string
          amount?: number
          tax?: number
          total?: number
          due_date?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      receipts: {
        Row: {
          id: string
          user_id: string
          transaction_id: string
          amount: number
          payment_method: string
          category: string
          description: string
          receipt_image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          transaction_id: string
          amount: number
          payment_method: string
          category: string
          description: string
          receipt_image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          transaction_id?: string
          amount?: number
          payment_method?: string
          category?: string
          description?: string
          receipt_image_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "receipts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          client_name: string
          client_email: string
          rating: number
          review: string
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_name: string
          client_email: string
          rating: number
          review: string
          is_public?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_name?: string
          client_email?: string
          rating?: number
          review?: string
          is_public?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      credit_scores: {
        Row: {
          id: string
          user_id: string
          score: number
          factors: Json
          last_calculated: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score: number
          factors: Json
          last_calculated: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          score?: number
          factors?: Json
          last_calculated?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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

// Type aliases for easier use
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Invoice = Database['public']['Tables']['invoices']['Row']
export type InvoiceInsert = Database['public']['Tables']['invoices']['Insert']
export type InvoiceUpdate = Database['public']['Tables']['invoices']['Update']

export type Receipt = Database['public']['Tables']['receipts']['Row']
export type ReceiptInsert = Database['public']['Tables']['receipts']['Insert']
export type ReceiptUpdate = Database['public']['Tables']['receipts']['Update']

export type Feedback = Database['public']['Tables']['feedback']['Row']
export type FeedbackInsert = Database['public']['Tables']['feedback']['Insert']
export type FeedbackUpdate = Database['public']['Tables']['feedback']['Update']

export type CreditScore = Database['public']['Tables']['credit_scores']['Row']
export type CreditScoreInsert = Database['public']['Tables']['credit_scores']['Insert']
export type CreditScoreUpdate = Database['public']['Tables']['credit_scores']['Update']

// Additional TypeScript interfaces for the application
export interface CreditScoreFactors {
  paymentHistory: number
  creditUtilization: number
  lengthOfCreditHistory: number
  newCredit: number
  creditMix: number
  [key: string]: number
}

export interface InvoiceWithStatus extends Invoice {
  isPaid: boolean
  isOverdue: boolean
  daysUntilDue: number
}

export interface UserProfile extends User {
  totalInvoices?: number
  totalRevenue?: number
  averageRating?: number
  creditScore?: number
} 