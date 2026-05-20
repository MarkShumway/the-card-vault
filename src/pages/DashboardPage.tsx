import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Tooltip, ResponsiveContainer,
         BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useGetCardsQuery } from '../features/cards/cardsApi'
import { formatCurrency, formatPercent, calcProfit } from '../utils/formatters'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import type { CardCategory } from '../types'

// ─── Chart colors ─────────────────────────────────────────────────────────────
const CHART_COLORS = [
    '#00C9A7', '#D4A853', '#4A9ECC', '#EF4444',
    '#8B5CF6', '#F59E0B', '#10B981', '#EC4899',
    '#6366F1', '#14B8A6', '#F97316', '#84CC16',
]

const CATEGORIES: Array<{ value: CardCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All Categories' },
    { value: 'baseball', label: 'Baseball' },
    { value: 'hockey', label: 'Hockey' },
    { value: 'football', label: 'Football' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'soccer', label: 'Soccer' },
    { value: 'golf', label: 'Golf' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'wrestling', label: 'Wrestling' },
    { value: 'pokemon', label: 'Pokémon' },
    { value: 'magic', label: 'Magic: The Gathering' },
    { value: 'yugioh', label: 'Yu-Gi-Oh!' },
    { value: 'other', label: 'Other' },
]

// ─── Custom tooltip ───────────────────────────────────────────────────────────
interface TooltipProps {
    active?: boolean
    payload?: Array<{ name: string; value: number; payload: { name: string } }>
}

function CountTooltip({ active, payload }: TooltipProps) {
    if (!active || !payload?.length) return null
    return (
        <div style={{
            background: '#161D2E',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: '0.875rem',
            color: '#F0F0F0',
        }}>
            <p>{payload[0].payload.name}</p>
            <p style={{ color: '#00C9A7', fontWeight: 600 }}>
                {payload[0].value} card{payload[0].value !== 1 ? 's' : ''}
            </p>
        </div>
    )
}

function PieTooltip({ active, payload }: TooltipProps) {
    if (!active || !payload?.length) return null
    return (
        <div style={{
            background: '#161D2E',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: '0.875rem',
            color: '#F0F0F0' }}>
            <p>{payload[0].payload.name}</p>
            <p style={{ color: '#00C9A7', fontWeight: 600 }}>
                {payload[0].value} card{payload[0].value !== 1 ? 's' : ''}
            </p>
        </div>
    )
}

// ─── Component ────────────────────────────────────────────────────────────────
function DashboardPage() {
    const navigate = useNavigate()
    const { data: cards, isLoading } = useGetCardsQuery()
    const [selectedCategory, setSelectedCategory] = useState<CardCategory | 'all'>('all')

    // ── Filter cards by selected category ──────────────────────────────
    const filteredCards = useMemo(() => {
        if (!cards) return []
        if (selectedCategory === 'all') return cards
        return cards.filter((card) => card.category === selectedCategory)
    }, [cards, selectedCategory])

    // ── Financial summary ───────────────────────────────────────────────
    const summary = useMemo(() => {
        if (!filteredCards.length) return null

        const totalInvested = filteredCards.reduce((sum, c) => sum + c.purchase_price, 0)
        const totalValue = filteredCards.reduce((sum, c) => sum + c.current_value, 0)
        const totalProfit = totalValue - totalInvested
        const totalPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0

        const bestCard = [...filteredCards].sort((a, b) => {
            const aPercent = a.purchase_price > 0
                ? ((a.current_value - a.purchase_price) / a.purchase_price) * 100
                : 0
            const bPercent = b.purchase_price > 0
                ? ((b.current_value - b.purchase_price) / b.purchase_price) * 100
                : 0
            return bPercent - aPercent
        })[0]

        return { totalInvested, totalValue, totalProfit, totalPercent, bestCard }
    }, [filteredCards])

    // ── Category breakdown for pie chart ───────────────────────────────
    const categoryData = useMemo(() => {
        if (!filteredCards.length) return []
        const counts: Record<string, number> = {}
        filteredCards.forEach((card) => {
            counts[card.category] = (counts[card.category] ?? 0) + 1
        })
        return Object.entries(counts)
            .map(([name, value], index) => ({
                name,
                value,
                fill: CHART_COLORS[index % CHART_COLORS.length],
            }))
            .sort((a, b) => b.value - a.value)
    }, [filteredCards])

    // ── Condition breakdown for bar chart ──────────────────────────────
    const conditionData = useMemo(() => {
        if (!filteredCards.length) return []
        const counts: Record<string, number> = {}
        filteredCards.forEach((card) => {
            counts[card.condition] = (counts[card.condition] ?? 0) + 1
        })
        return Object.entries(counts)
            .map(([name, value], index) => ({
                name,
                value,
                fill: CHART_COLORS[index % CHART_COLORS.length],
            }))
            .sort((a, b) => b.value - a.value)
    }, [filteredCards])

    // ── Top 5 cards by current value ───────────────────────────────────
    const topCards = useMemo(() => {
        return [...filteredCards]
            .sort((a, b) => b.current_value - a.current_value)
            .slice(0, 5)
    }, [filteredCards])

    if (isLoading) {
        return (
            <div className="dashboard">
                <Header />
                <main className="dashboard__main">
                    <div className="dashboard__empty">
                        <p>Loading dashboard...</p>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!cards?.length) {
        return (
            <div className="dashboard">
                <Header />
                <main className="dashboard__main">
                    <div className="dashboard__empty">
                        <p className="dashboard__empty-title">No cards yet</p>
                        <p>Add some cards to your collection to see your dashboard.</p>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="dashboard">
            <Header />
            <main className="dashboard__main">
                {/* ── Heading + filter ── */}
                <div className="dashboard__heading-row">
                    <h2 className="dashboard__heading">Dashboard</h2>
                    <div className="dashboard__filter">
                        <span className="dashboard__filter-label">Filter by</span>
                        <select onChange={(e) => setSelectedCategory(e.target.value as CardCategory | 'all')}
                                className="dashboard__filter-select"
                                name="filter_by"
                                value={selectedCategory} >
                            {CATEGORIES.map((c) => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ── Summary cards ── */}
                {summary && (
                    <div className="dashboard__summary">
                        <div className="dashboard__stat-card">
                            <span className="dashboard__stat-label">Total Invested</span>
                            <span className="dashboard__stat-value">
                                {formatCurrency(summary.totalInvested)}
                            </span>
                            <span className="dashboard__stat-sub">
                                {filteredCards.length} card{filteredCards.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="dashboard__stat-card">
                            <span className="dashboard__stat-label">Current Value</span>
                            <span className="dashboard__stat-value dashboard__stat-value--mint">
                                {formatCurrency(summary.totalValue)}
                            </span>
                            <span className="dashboard__stat-sub">market value</span>
                        </div>

                        <div className="dashboard__stat-card">
                            <span className="dashboard__stat-label">Total P&L</span>
                            <span className={`dashboard__stat-value dashboard__stat-value--${summary.totalProfit >= 0 ? 'profit' : 'loss'}`}>
                                {formatCurrency(summary.totalProfit)}
                            </span>
                            <span className="dashboard__stat-sub">
                                {formatPercent(summary.totalPercent)} overall
                            </span>
                        </div>

                        <div className="dashboard__stat-card">
                            <span className="dashboard__stat-label">Best Performer</span>
                            <span className="dashboard__stat-value dashboard__stat-value--mint">
                                {summary.bestCard
                                    ? formatPercent(
                                        summary.bestCard.purchase_price > 0
                                    ? ((summary.bestCard.current_value - summary.bestCard.purchase_price) / summary.bestCard.purchase_price) * 100
                                        : 0
                                    )
                                    : '—'
                                }
                            </span>
                            <span className="dashboard__stat-sub">
                                {summary.bestCard?.player_name ?? '—'}
                            </span>
                        </div>
                    </div>
                )}

                {filteredCards.length === 0 ? (
                    <div className="dashboard__empty">
                        <p className="dashboard__empty-title">No cards in this category</p>
                        <p>Try selecting a different category filter.</p>
                    </div>
                ) : (
                    <>
                        {/* ── Charts ── */}
                        <div className="dashboard__charts">

                            {/* Category breakdown */}
                            {selectedCategory === 'all' && categoryData.length > 0 && (
                                <div className="dashboard__chart-card">
                                    <h3 className="dashboard__chart-title">Collection by Category</h3>
                                    <div className="dashboard__chart-container">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={categoryData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={70}
                                                    outerRadius={110}
                                                    paddingAngle={3}
                                                    dataKey="value"
                                                />
                                                <Tooltip content={<PieTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}

                            {/* Condition breakdown */}
                            {conditionData.length > 0 && (
                                <div className="dashboard__chart-card">
                                    <h3 className="dashboard__chart-title">Collection by Condition</h3>
                                    <div className="dashboard__chart-container">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={conditionData}
                                                margin={{ top: 8, right: 8, left: -16, bottom: 60 }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="rgba(255,255,255,0.06)"
                                                />
                                                <XAxis
                                                    dataKey="name"
                                                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                                    angle={-35}
                                                    textAnchor="end"
                                                    interval={0}
                                                />
                                                <YAxis
                                                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                                    allowDecimals={false}
                                                />
                                                <Tooltip
                                                    content={<CountTooltip />}
                                                    cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
                                                />
                                                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Top 5 cards ── */}
                        {topCards.length > 0 && (
                            <div className="dashboard__top-cards">
                                <h3 className="dashboard__chart-title">Top 5 by Current Value</h3>
                                {topCards.map((card, index) => {
                                    const { profit } = calcProfit(card.purchase_price, card.current_value)
                                    const isProfit = profit >= 0
                                    return (
                                        <div
                                            key={card.id}
                                            className="dashboard__top-card-item"
                                            onClick={() => navigate(`/card/${card.id}`)} >
                                            <span className="dashboard__top-card-rank">#{index + 1}</span>
                                            <div className="dashboard__top-card-info">
                                                <span className="dashboard__top-card-name">{card.player_name}</span>
                                                <span className="dashboard__top-card-meta">
                                                    {card.year} · {card.brand} · {card.condition}
                                                </span>
                                            </div>
                                            <span className="dashboard__top-card-value"
                                                  style={{ color: isProfit ? '#00C9A7' : '#EF4444' }}>
                                                {formatCurrency(card.current_value)}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </div>
    )
}

export default DashboardPage
