import { Routes, Route, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAppSelector } from '../store/hooks'
import LoginPage from '../pages/LoginPage'
import WelcomePage from '../pages/WelcomePage'
import CollectionPage from '../pages/CollectionPage'
import AddCardPage from '../pages/AddCardPage'
import CardDetailPage from '../pages/CardDetailPage'
import SessionWarningModal from '../components/common/SessionWarningModal'

function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, isInitialized } = useAppSelector((state) => state.auth)

    if (!isInitialized) return null
    if (!user) return <Navigate to="/" replace />

    return <>{children}</>
}

function AppRoutes() {
    return (
        <>
            <SessionWarningModal />
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/collection"
                    element={
                        <ProtectedRoute>
                            <CollectionPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/add"
                    element={
                        <ProtectedRoute>
                            <AddCardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/card/:id"
                    element={
                        <ProtectedRoute>
                            <CardDetailPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    )
}

export default AppRoutes
