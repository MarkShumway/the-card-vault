import { useLocation } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import useAuthListener from './hooks/useAuthListener'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

function App() {
    useAuthListener()
    const location = useLocation()

    const noHeaderRoutes = ['/', '/login']
    const hasHeader = !noHeaderRoutes.includes(location.pathname)

    return (
        <div className="app-wrapper">
            {hasHeader && <Header />}
            <div className={`app-container${hasHeader ? ' app-container--with-header' : ''}`}>
                <AppRoutes />
            </div>
            {hasHeader && <Footer />}
        </div>
    )
}

export default App
