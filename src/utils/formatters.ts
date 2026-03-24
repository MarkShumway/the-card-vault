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
