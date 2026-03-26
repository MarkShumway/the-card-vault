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
