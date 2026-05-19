import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPercent, formatDate, calcProfit } from '../utils/formatters'

describe('formatCurrency', () => {
    it('Test 1: formats a positive number as USD currency', () => {
        expect(formatCurrency(100)).toBe('$100.00')
    })

    it('Test 2: formats zero correctly', () => {
        expect(formatCurrency(0)).toBe('$0.00')
    })

    it('Test 3: formats a decimal value correctly', () => {
        expect(formatCurrency(54.99)).toBe('$54.99')
    })

    it('Test 4: formats large numbers with commas', () => {
        expect(formatCurrency(1234.56)).toBe('$1,234.56')
    })

    it('Test 5: formats negative numbers correctly', () => {
        expect(formatCurrency(-25.00)).toBe('-$25.00')
    })
})

describe('formatPercent', () => {
    it('Test 1: formats a positive percent with a + prefix', () => {
        expect(formatPercent(10.5)).toBe('+10.5%')
    })

    it('Test 2: formats zero percent', () => {
        expect(formatPercent(0)).toBe('+0.0%')
    })

    it('Test 3: formats a negative percent without + prefix', () => {
        expect(formatPercent(-15.3)).toBe('-15.3%')
    })

    it('Test 4: rounds to one decimal place', () => {
        expect(formatPercent(10.567)).toBe('+10.6%')
    })
})

describe('formatDate', () => {
    it('Test 1: formats an ISO date string into a readable date', () => {
        const result = formatDate('2026-03-20T00:00:00.000Z')
        expect(result).toMatch(/Mar/)
        expect(result).toMatch(/2026/)
    })

    it('Test 2: returns a non-empty string for a valid date', () => {
        const result = formatDate('2024-01-15T00:00:00.000Z')
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
    })
})

describe('calcProfit', () => {
    it('Test 1: calculates profit correctly when value exceeds purchase price', () => {
        const { profit, percent } = calcProfit(50, 100)
        expect(profit).toBe(50)
        expect(percent).toBe(100)
    })

    it('Test 2: calculates a loss correctly', () => {
        const { profit, percent } = calcProfit(100, 50)
        expect(profit).toBe(-50)
        expect(percent).toBe(-50)
    })

    it('Test 3: returns zero profit when prices are equal', () => {
        const { profit, percent } = calcProfit(100, 100)
        expect(profit).toBe(0)
        expect(percent).toBe(0)
    })

    it('Test 4: handles zero purchase price without dividing by zero', () => {
        const { profit, percent } = calcProfit(0, 50)
        expect(profit).toBe(50)
        expect(percent).toBe(0)
    })
})
