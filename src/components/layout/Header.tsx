import { useAppDispatch } from '../../store/hooks'
import { setUser } from '../../features/auth/authSlice'
import { supabase } from '../../services/supabase'
import { useNavigate, useLocation } from 'react-router-dom'
import { cardsApi } from '../../features/cards/cardsApi'
import { formatCurrency } from '../../utils/formatters'

function Header() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { data: cards } = cardsApi.endpoints.getCards.useQueryState()

    const totalValue = cards?.reduce((sum, card) => sum + card.current_value, 0) ?? 0

    const handleLogout = async () => {
        await supabase.auth.signOut()
        dispatch(setUser(null))
        navigate('/')
    }

    const isActive = (path: string) => location.pathname === path

    return (
        <header className="header">

            <div className="header__brand">
                <img
                    className="header__logo"
                    src="/favicon.svg"
                    alt="The Card Vault"
                />
                <h1 className="header__title">The Card Vault</h1>
                {cards && (
                    <span className="header__count">{cards.length} cards</span>
                )}
            </div>

            <div className="header__right">
                <div className="header__stats">
                    <span className="header__stat-label">Collection Value</span>
                    <span className="header__stat-value">{formatCurrency(totalValue)}</span>
                </div>
                <div className="header__user">
                    <button
                        className={`header__nav-btn${isActive('/collection') ? ' header__nav-btn--active' : ''}`}
                        onClick={() => navigate('/collection')} >
                        Collection
                    </button>
                    <button
                        className={`header__nav-btn${isActive('/dashboard') ? ' header__nav-btn--active' : ''}`}
                        onClick={() => navigate('/dashboard')} >
                        Dashboard
                    </button>
                    <button
                        className="header__add-btn"
                        onClick={() => navigate('/add')}
                        aria-label="Add new card" >
                        + Add Card
                    </button>
                    <button className="header__logout" onClick={handleLogout}>
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Mobile second row — collection value + nav */}
            <div className="header__mobile-stats">
                <div className="header__mobile-stat-group">
                    <span className="header__mobile-stat-label">Collection Value</span>
                    <span className="header__mobile-stat-value">{formatCurrency(totalValue)}</span>
                </div>
                <div className="header__mobile-nav">
                    <button
                        className={`header__mobile-nav-btn${isActive('/collection') ? ' header__mobile-nav-btn--active' : ''}`}
                        onClick={() => navigate('/collection')} >
                        Collection
                    </button>
                    <button
                        className={`header__mobile-nav-btn${isActive('/dashboard') ? ' header__mobile-nav-btn--active' : ''}`}
                        onClick={() => navigate('/dashboard')} >
                        Dashboard
                    </button>
                </div>
            </div>

        </header>
    )
}

export default Header
