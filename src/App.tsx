import { useLocation } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import useAuthListener from './hooks/useAuthListener'

function App() {
    useAuthListener()
    const location = useLocation()

    const noHeaderRoutes = ['/', '/login']
    const hasHeader = !noHeaderRoutes.includes(location.pathname)

    return (
        <div className={`app-container${hasHeader ? ' app-container--with-header' : ''}`}>
            <AppRoutes />
        </div>
    )
}

export default App
