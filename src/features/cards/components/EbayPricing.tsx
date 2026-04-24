import { useState } from 'react'
import { useGetEbayPricingMutation } from '../cardsApi'
import { formatCurrency } from '../../../utils/formatters'
import type { CardRow } from '../../../types'

interface EbayPricingProps {
    card: CardRow
}

function EbayPricing({ card }: EbayPricingProps) {
    const [getEbayPricing, { isLoading }] = useGetEbayPricingMutation()
    const [results, setResults] = useState<{
        average: number
        low: number
        high: number
        count: number
        listings: { title: string; price: number; url: string }[]
    } | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleFetch = async () => {
        setError(null)
        try {
            const data = await getEbayPricing({
                player_name: card.player_name,
                year: card.year,
                brand: card.brand,
                category: card.category,
            }).unwrap()

            if (data.count === 0) {
                setError('No listings found for this card on eBay.')
                setResults(null)
            } else {
                setResults(data)
            }
        } catch {
            setError('Failed to fetch eBay pricing. Please try again.')
        }
    }

    return (
        <div className="ebay-pricing">
            <div className="ebay-pricing__header">
                <h3 className="ebay-pricing__title">eBay Market Pricing</h3>
                <button
                    className="ebay-pricing__fetch-btn"
                    onClick={handleFetch}
                    disabled={isLoading}
                >
                    {isLoading ? 'Searching eBay...' : results ? 'Refresh Prices' : 'Get Current Prices'}
                </button>
            </div>

            {error && (
                <p className="ebay-pricing__error">{error}</p>
            )}

            {results && (
                <>
                    <div className="ebay-pricing__stats">
                        <div className="ebay-pricing__stat">
                            <span className="ebay-pricing__stat-label">Average</span>
                            <span className="ebay-pricing__stat-value">
                                {formatCurrency(results.average)}
                            </span>
                        </div>
                        <div className="ebay-pricing__stat">
                            <span className="ebay-pricing__stat-label">Low</span>
                            <span className="ebay-pricing__stat-value ebay-pricing__stat-value--low">
                                {formatCurrency(results.low)}
                            </span>
                        </div>
                        <div className="ebay-pricing__stat">
                            <span className="ebay-pricing__stat-label">High</span>
                            <span className="ebay-pricing__stat-value ebay-pricing__stat-value--high">
                                {formatCurrency(results.high)}
                            </span>
                        </div>
                    </div>

                    <p className="ebay-pricing__count">
                        Based on {results.count} active eBay listing{results.count !== 1 ? 's' : ''}
                    </p>

                    {results.listings.length > 0 && (
                        <div className="ebay-pricing__listings">
                            <span className="ebay-pricing__listings-title">
                                Recent Listings
                            </span>
                            {results.listings.map((listing, index) => (
                                <div key={index} className="ebay-pricing__listing">
                                    <span className="ebay-pricing__listing-title">
                                        {listing.title}
                                    </span>
                                    <span className="ebay-pricing__listing-price">
                                        {formatCurrency(listing.price)}
                                    </span>

                                    <a className="ebay-pricing__listing-link"
                                        href={listing.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View →
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default EbayPricing
