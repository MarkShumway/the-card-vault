import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '../../types'

/*------------------------------------------------------------------------------------------------------------
 This manages the authentication state of the current user — whether someone is logged in, who they are,
 and whether auth is still loading.
*------------------------------------------------------------------------------------------------------------*/

interface AuthState {
    user: AuthUser | null
    isLoading: boolean
    isInitialized: boolean
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    isInitialized: false,
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
    },
})

export const { setUser, setAuthLoading } = authSlice.actions
export default authSlice.reducer
