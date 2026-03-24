// ─── Sport ───────────────────────────────────────────────────────────────────
export type Sport = 'baseball' | 'hockey' | 'football' | 'basketball'

// ─── Card Condition ───────────────────────────────────────────────────────────
export type CardCondition =
    | 'PSA 10'
    | 'PSA 9'
    | 'PSA 8'
    | 'PSA 7'
    | 'BGS 9.5'
    | 'BGS 9'
    | 'Raw - Mint'
    | 'Raw - Near Mint'
    | 'Raw - Excellent'
    | 'Raw - Good'

// ─── Card ─────────────────────────────────────────────────────────────────────
export interface Card {
    id: string
    user_id: string
    player_name: string
    year: number
    brand: string
    series: string | null        // e.g. "Topps Chrome", "Upper Deck Young Guns"
    card_number: string | null
    sport: Sport
    condition: CardCondition
    purchase_price: number
    current_value: number
    image_url: string | null
    notes: string | null
    created_at: string
    updated_at: string
}

// ─── Card Form Values (for React Hook Form) ───────────────────────────────────
export interface CardFormValues {
    player_name: string
    year: number
    brand: string
    series: string
    card_number: string
    sport: Sport
    condition: CardCondition
    purchase_price: number
    current_value: number
    notes: string
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
    id: string
    email: string
    created_at: string
}

// ─── Collection Filters (Redux UI state) ──────────────────────────────────────
export type SortField = 'player_name' | 'year' | 'current_value' | 'purchase_price' | 'created_at'
export type SortDirection = 'asc' | 'desc'

export interface CollectionFilters {
    search: string
    sport: Sport | 'all'
    condition: CardCondition | 'all'
    sortField: SortField
    sortDirection: SortDirection
}

// ─── API Response wrapper ─────────────────────────────────────────────────────
export interface ApiError {
    message: string
    status?: number
}

// ─── Supabase generated type helpers ─────────────────────────────────────────
import type { Tables, TablesInsert, TablesUpdate } from './database'

export type CardRow = Tables<'cards'>
export type CardInsert = TablesInsert<'cards'>
export type CardUpdate = TablesUpdate<'cards'>
