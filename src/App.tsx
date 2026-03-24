import AppRoutes from './routes/AppRoutes'
import useAuthListener from './hooks/useAuthListener'

function App() {
    useAuthListener()
    return <AppRoutes />
}

export default App
