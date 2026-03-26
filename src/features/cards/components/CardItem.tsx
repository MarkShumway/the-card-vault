import { useNavigate } from 'react-router-dom'
import { useDeleteCardMutation } from '../cardsApi'
import type { CardRow } from '../../../types'
import { formatCurrency, formatPercent, calcProfit } from '../../../utils/formatters'

interface CardItemProps {
    card: CardRow
}

function CardItem({ card }: CardItemProps) {
    const navigate = useNavigate()
    const [deleteCard, { isLoading: isDeleting }] = useDeleteCardMutation()

    const { profit, percent } = calcProfit(card.purchase_price, card.current_value)
    const isProfit = profit >= 0

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (window.confirm(`Delete ${card.player_name}?`)) {
            await deleteCard(card.id)
        }
    }

    return (
        <div
            className="card-item"
            onClick={() => navigate(`/card/${card.id}`)}
        >
            <div className="card-item__image">
                {card.image_url ? (
                    <img src={card.image_url} alt={card.player_name} />
                ) : (
                    <div className="card-item__image-placeholder">
                        <span>{card.player_name.charAt(0)}</span>
                    </div>
                )}
                <span className="card-item__category">{card.category}</span>
            </div>

            <div className="card-item__body">
                <div className="card-item__header">
                    <h3 className="card-item__player">{card.player_name}</h3>
                    <span className="card-item__condition">{card.condition}</span>
                </div>

                <p className="card-item__meta">
                    {card.year} · {card.brand}
                    {card.series ? ` · ${card.series}` : ''}
                    {card.card_number ? ` #${card.card_number}` : ''}
                </p>

                <div className="card-item__values">
                    <div className="card-item__value">
                        <span className="card-item__value-label">Paid</span>
                        <span className="card-item__value-amount">
                            {formatCurrency(card.purchase_price)}
                        </span>
                    </div>
                    <div className="card-item__value">
                        <span className="card-item__value-label">Value</span>
                        <span className="card-item__value-amount card-item__value-amount--current">
                            {formatCurrency(card.current_value)}
                        </span>
                    </div>
                    <div className="card-item__value">
                        <span className="card-item__value-label">P&L</span>
                        <span className={`card-item__value-amount card-item__value-amount--${isProfit ? 'profit' : 'loss'}`}>
                            {formatCurrency(profit)} ({formatPercent(percent)})
                        </span>
                    </div>
                </div>
            </div>

            <button
                className="card-item__delete"
                onClick={handleDelete}
                disabled={isDeleting}
                aria-label="Delete card"
            >
                ✕
            </button>
        </div>
    )
}

export default CardItem
