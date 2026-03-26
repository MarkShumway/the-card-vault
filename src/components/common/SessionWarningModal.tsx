import { useEffect, useState } from 'react'
import { useAppSelector } from '../../store/hooks'
import useSessionTimeout from '../../hooks/useSessionTimeout'

const WARNING_SECONDS = 5 * 60

function SessionWarningModal() {
    const { showSessionWarning } = useAppSelector((state) => state.auth)
    const { signOut } = useSessionTimeout()
    const [secondsLeft, setSecondsLeft] = useState(WARNING_SECONDS)

    useEffect(() => {
        if (!showSessionWarning) return

        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => {
            clearInterval(interval)
            setSecondsLeft(WARNING_SECONDS)
        }
    }, [showSessionWarning])

    const minutes = Math.floor(secondsLeft / 60)
    const seconds = secondsLeft % 60
    const countdown = `${minutes}:${seconds.toString().padStart(2, '0')}`

    if (!showSessionWarning) return null

    return (
        <div className="session-modal__overlay">
            <div className="session-modal">
                <div className="session-modal__icon">⏱</div>
                <h2 className="session-modal__title">Session Expiring Soon</h2>
                <p className="session-modal__message">
                    Your session will expire in
                </p>
                <div className="session-modal__countdown">{countdown}</div>
                <p className="session-modal__sub">
                    Any unsaved changes will be lost. Would you like to stay logged in?
                </p>
                <div className="session-modal__actions">
                    <button
                        className="session-modal__signout"
                        onClick={signOut}
                    >
                        Sign Out
                    </button>
                    <button
                        className="session-modal__stay"
                        onClick={() => window.dispatchEvent(new MouseEvent('mousedown'))}
                    >
                        Stay Logged In
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SessionWarningModal
