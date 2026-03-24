import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setUser } from '../../features/auth/authSlice'
import { supabase } from '../../services/supabase'
import { useNavigate } from 'react-router-dom'
import { cardsApi } from '../../features/cards/cardsApi'
import { formatCurrency } from '../../utils/formatters'

function Header() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { user } = useAppSelector((state) => state.auth)
    const { data: cards } = cardsApi.endpoints.getCards.useQueryState()

    const totalValue = cards?.reduce((sum, card) => sum + card.current_value, 0) ?? 0

    const handleLogout = async () => {
        await supabase.auth.signOut()
        dispatch(setUser(null))
        navigate('/login')
    }

    return (
        <header className="header">

            {/* Brand */}
            <div className="header__brand">
                <h1 className="header__title">Card Vault</h1>
                {cards && (
                    <span className="header__count">{cards.length} cards</span>
                )}
            </div>

            {/* Right side — desktop */}
            <div className="header__right">
                <div className="header__stats">
                    <span className="header__stat-label">Collection Value</span>
                    <span className="header__stat-value">{formatCurrency(totalValue)}</span>
                </div>
                <div className="header__user">
                    <span className="header__email">{user?.email}</span>
                    <button className="header__logout" onClick={handleLogout}>
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Mobile second row — collection value */}
            <div className="header__mobile-stats">
                <span className="header__mobile-stat-label">Collection Value</span>
                <span className="header__mobile-stat-value">{formatCurrency(totalValue)}</span>
            </div>

        </header>
    )
}

export default Header
