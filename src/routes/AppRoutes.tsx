import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import LoginPage from '../pages/LoginPage'
import WelcomePage from '../pages/WelcomePage'
import CollectionPage from '../pages/CollectionPage'
import AddCardPage from '../pages/AddCardPage'
import CardDetailPage from '../pages/CardDetailPage'
import * as React from "react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isInitialized } = useAppSelector((state) => state.auth)

    if (!isInitialized) return null
    if (!user) return <Navigate to="/" replace />

    return <>{children}</>
}

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected */}
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

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
