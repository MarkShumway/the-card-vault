import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setUser } from '../features/auth/authSlice'
import { setShowWarning } from '../features/auth/authSlice'

const TIMEOUT_DURATION = 30 * 60 * 1000      // 30 minutes
const WARNING_DURATION = 5 * 60 * 1000       // warn at 25 minutes
const ACTIVITY_EVENTS = [
    'mousedown',
    'mousemove',
    'keydown',
    'scroll',
    'touchstart',
    'click',
]

function useSessionTimeout() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { user } = useAppSelector((state) => state.auth)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const clearTimers = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        if (warningRef.current) clearTimeout(warningRef.current)
    }, [])

    const signOut = useCallback(async () => {
        clearTimers()
        await supabase.auth.signOut()
        dispatch(setUser(null))
        dispatch(setShowWarning(false))
        navigate('/')
    }, [clearTimers, dispatch, navigate])

    const resetTimer = useCallback(() => {
        if (!user) return
        clearTimers()
        dispatch(setShowWarning(false))

        // Show warning at 25 minutes
        warningRef.current = setTimeout(() => {
            dispatch(setShowWarning(true))
        }, TIMEOUT_DURATION - WARNING_DURATION)

        // Sign out at 30 minutes
        timeoutRef.current = setTimeout(() => {
            signOut()
        }, TIMEOUT_DURATION)
    }, [user, clearTimers, dispatch, signOut])

    useEffect(() => {
        if (!user) return

        resetTimer()

        ACTIVITY_EVENTS.forEach((event) =>
            window.addEventListener(event, resetTimer, { passive: true })
        )

        return () => {
            clearTimers()
            ACTIVITY_EVENTS.forEach((event) =>
                window.removeEventListener(event, resetTimer)
            )
        }
    }, [user, resetTimer, clearTimers])

    return { signOut }
}

export default useSessionTimeout
