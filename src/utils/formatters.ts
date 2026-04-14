/**
 * formatters.ts
 *
 * Shared utility functions for formatting and calculating values displayed
 * throughout the UI. All functions are pure and stateless.
 *
 * Formatting:
 *   - formatCurrency(value)          Formats a number as USD currency
 *                                    e.g. 1234.5 → '$1,234.50'
 *   - formatPercent(value)           Formats a number as a signed percentage
 *                                    e.g. 4.5 → '+4.5%', -2.1 → '-2.1%'
 *   - formatDate(dateString)         Formats an ISO date string as a readable date
 *                                    e.g. '2024-01-15T00:00:00' → 'Jan 15, 2024'
 *
 * Calculations:
 *   - calcProfit(purchasePrice, currentValue)  Computes absolute profit and percentage
 *                                              gain/loss. Returns { profit, percent }.
 *                                              Returns percent of 0 if purchasePrice is 0
 *                                              to avoid division by zero.
 */

export function formatCurrency(value: number): string {
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    })
}

export function formatPercent(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export function calcProfit(purchasePrice: number, currentValue: number) {
    const profit = currentValue - purchasePrice
    const percent = purchasePrice > 0
        ? (profit / purchasePrice) * 100
        : 0
    return { profit, percent }
}
