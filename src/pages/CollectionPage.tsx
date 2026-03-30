import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetCardsQuery } from '../features/cards/cardsApi'
import { useAppSelector } from '../store/hooks'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import CollectionFilters from '../features/collection/components/CollectionFilters'
import CardItem from '../features/cards/components/CardItem'
import Pagination from '../components/common/Pagination'
import type { CardRow } from '../types'

function CollectionPage() {
    const navigate = useNavigate()
    const { data: cards, isLoading, isError } = useGetCardsQuery()
    const filters = useAppSelector((state) => state.collection)

    const filteredCards = useMemo(() => {
        if (!cards) return []

        let result: CardRow[] = [...cards]

        if (filters.search.trim()) {
            const term = filters.search.toLowerCase()
            result = result.filter(
                (card) =>
                    card.player_name.toLowerCase().includes(term) ||
                    card.brand.toLowerCase().includes(term) ||
                    (card.series?.toLowerCase().includes(term) ?? false)
            )
        }

        if (filters.category !== 'all') {
            result = result.filter((card) => card.category === filters.category)
        }

        if (filters.condition !== 'all') {
            result = result.filter((card) => card.condition === filters.condition)
        }

        result.sort((a, b) => {
            const field = filters.sortField
            const dir = filters.sortDirection === 'asc' ? 1 : -1

            if (field === 'player_name') {
                return a.player_name.localeCompare(b.player_name) * dir
            }

            const aVal = a[field] ?? 0
            const bVal = b[field] ?? 0

            if (aVal < bVal) return -1 * dir
            if (aVal > bVal) return 1 * dir
            return 0
        })

        return result
    }, [cards, filters])

    // Paginate the filtered results
    const paginatedCards = useMemo(() => {
        const start = (filters.currentPage - 1) * filters.pageSize
        return filteredCards.slice(start, start + filters.pageSize)
    }, [filteredCards, filters.currentPage, filters.pageSize])

    return (
        <div className="collection-page">
            <Header />
            <CollectionFilters />

            <main className="collection-page__main">
                {isLoading && (
                    <div className="collection-page__state">
                        <p>Loading your collection...</p>
                    </div>
                )}

                {isError && (
                    <div className="collection-page__state collection-page__state--error">
                        <p>Something went wrong loading your cards. Please refresh.</p>
                    </div>
                )}

                {!isLoading && !isError && filteredCards.length === 0 && (
                    <div className="collection-page__state">
                        {cards?.length === 0 ? (
                            <>
                                <p className="collection-page__empty-title">No cards yet</p>
                                <p className="collection-page__empty-sub">
                                    Add your first card to get started
                                </p>
                                <button
                                    className="collection-page__add-btn"
                                    onClick={() => navigate('/add')}
                                >
                                    Add Your First Card
                                </button>
                            </>
                        ) : (
                            <p>No cards match your current filters.</p>
                        )}
                    </div>
                )}

                {!isLoading && filteredCards.length > 0 && (
                    <div className="collection-page__grid">
                        {paginatedCards.map((card) => (
                            <CardItem key={card.id} card={card} />
                        ))}
                    </div>
                )}

                {!isLoading && filteredCards.length > 0 && (
                    <Pagination totalItems={filteredCards.length} />
                )}
            </main>

            <Footer />

            <button
                className="collection-page__fab"
                onClick={() => navigate('/add')}
                aria-label="Add new card"
            >
                +
            </button>
        </div>
    )
}

export default CollectionPage
