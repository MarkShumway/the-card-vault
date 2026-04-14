/**
 * useAuthListener.ts
 *
 * Custom React hook that synchronizes Supabase authentication state with
 * the Redux store. Intended to be called once at the application root so
 * that auth state is available globally for the lifetime of the app.
 *
 * Behavior:
 *   1. On mount, retrieves any existing Supabase session and dispatches
 *      setUser() with the current user, or null if no session is found.
 *   2. Subscribes to Supabase auth state change events (sign-in, sign-out,
 *      token refresh) and keeps the Redux store in sync for each event.
 *   3. On unmount, unsubscribes from the auth listener to prevent memory leaks.
 *
 * Dispatches:
 *   - setUser(AuthUser)  When a valid session is present
 *   - setUser(null)      When no session exists or the user signs out
 *
 * Usage:
 *   Call once in App.tsx or a top-level layout component — do not call
 *   in multiple places, as each call creates its own Supabase subscription.
 */

import { useEffect } from 'react'
import { supabase } from '../services/supabase'
import { setUser } from '../features/auth/authSlice'
import { useAppDispatch } from '../store/hooks'
import type { AuthUser } from '../types'

function useAuthListener() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        // Check for existing session on app load
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                const user: AuthUser = {
                    id: session.user.id,
                    email: session.user.email ?? '',
                    created_at: session.user.created_at,
                }
                dispatch(setUser(user))
            } else {
                dispatch(setUser(null))
            }
        })

        // Listen for auth state changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (session?.user) {
                    const user: AuthUser = {
                        id: session.user.id,
                        email: session.user.email ?? '',
                        created_at: session.user.created_at,
                    }
                    dispatch(setUser(user))
                } else {
                    dispatch(setUser(null))
                }
            }
        )

        // Cleanup subscription on unmount
        return () => subscription.unsubscribe()
    }, [dispatch])
}

export default useAuthListener
