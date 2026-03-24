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
