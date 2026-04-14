/**
 * authSlice.ts
 *
 * Redux slice for managing authentication state. Tracks the current user,
 * loading status, initialization flag, and session warning visibility.
 *
 * State shape (AuthState):
 *   - user              Current authenticated user, or null if unauthenticated
 *   - isLoading         True while an auth operation (e.g. sign-in) is in progress
 *   - isInitialized     True once auth state has been resolved on app load
 *   - showSessionWarning  True when the session expiry warning should be displayed
 *
 * Reducers:
 *   - setUser           Sets the current user and marks auth as initialized
 *   - setAuthLoading    Toggles the loading flag
 *   - setShowWarning    Toggles the session expiry warning
 */

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '../../types'

// ─── Manage the authentication state of the current user ──────────────────────────────
interface AuthState {
    user: AuthUser | null
    isLoading: boolean
    isInitialized: boolean
    showSessionWarning: boolean
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    isInitialized: false,
    showSessionWarning: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<AuthUser | null>) {
            state.user = action.payload
            state.isInitialized = true
        },
        setAuthLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload
        },
        setShowWarning(state, action: PayloadAction<boolean>) {
            state.showSessionWarning = action.payload
        },
    },
})

export const { setUser, setAuthLoading, setShowWarning } = authSlice.actions
export default authSlice.reducer
