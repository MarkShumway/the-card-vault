/**
 * index.ts
 *
 * Central type definitions for The Card Vault. This is the primary types
 * entry point — all application code should import shared types from here
 * rather than directly from database.ts or other feature files.
 *
 * Domain types:
 *   - CardCategory      Union of supported card sport/game categories
 *   - CardCondition     Union of graded (PSA, BGS) and raw condition values
 *   - Card              Full card entity as stored and retrieved from the database
 *   - CardFormValues    Shape of the add/edit card form (no id, user_id, timestamps,
 *                       or nullable fields — all values are plain strings/numbers)
 *
 * Auth types:
 *   - AuthUser          Subset of the Supabase user object stored in Redux auth state
 *
 * Collection UI types:
 *   - SortField         Union of fields available for sorting the collection browser
 *   - SortDirection     'asc' | 'desc'
 *   - CollectionFilters Full filter and sort state shape used by collectionSlice
 *
 * API types:
 *   - ApiError          Normalized error shape for failed data operations
 *
 * Supabase type helpers (derived from database.ts):
 *   - CardRow           Resolved Row shape for the cards table
 *   - CardInsert        Resolved Insert shape for the cards table
 *   - CardUpdate        Resolved Update shape for the cards table (all fields optional)
 */

// ─── Card Category ────────────────────────────────────────────────────────────
export type CardCategory =
    | 'baseball'
    | 'hockey'
    | 'football'
    | 'basketball'
    | 'soccer'
    | 'golf'
    | 'tennis'
    | 'wrestling'
    | 'pokemon'
    | 'magic'
    | 'yugioh'
    | 'other'

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
    series: string | null
    card_number: string | null
    category: CardCategory
    condition: CardCondition
    purchase_price: number
    current_value: number
    image_url: string | null
    notes: string | null
    created_at: string
    updated_at: string
}

// ─── Card Form Values ─────────────────────────────────────────────────────────
export interface CardFormValues {
    player_name: string
    year: number
    brand: string
    series: string
    card_number: string
    category: CardCategory
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

// ─── Collection Filters ───────────────────────────────────────────────────────
export type SortField = 'player_name' | 'year' | 'current_value' | 'purchase_price' | 'created_at'
export type SortDirection = 'asc' | 'desc'

export interface CollectionFilters {
    search: string
    category: CardCategory | 'all'
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
