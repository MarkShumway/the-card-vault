import { describe, it, expect } from 'vitest'
import { cardSchema } from '../utils/cardSchema'

const validCard = {
    player_name: 'Ken Griffey Jr',
    year: 1989,
    brand: 'Upper Deck',
    series: 'Base',
    card_number: '1',
    category: 'baseball' as const,
    condition: 'Raw - Near Mint' as const,
    purchase_price: 25.00,
    current_value: 100.00,
    notes: 'Rookie card',
}

describe('cardSchema', () => {

    describe('player_name', () => {
        it('Test 1: accepts a valid player name', () => {
            const result = cardSchema.safeParse(validCard)
            expect(result.success).toBe(true)
        })

        it('Test 2: rejects an empty player name', () => {
            const result = cardSchema.safeParse({ ...validCard, player_name: '' })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Player name is required')
            }
        })
    })

    describe('year', () => {
        it('Test 1: accepts a valid year', () => {
            const result = cardSchema.safeParse({ ...validCard, year: 2020 })
            expect(result.success).toBe(true)
        })

        it('Test 2: rejects a year before 1800', () => {
            const result = cardSchema.safeParse({ ...validCard, year: 1799 })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Year must be 1800 or later')
            }
        })

        it('Test 3: rejects a year in the future', () => {
            const result = cardSchema.safeParse({ ...validCard, year: new Date().getFullYear() + 2 })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Year cannot be in the future')
            }
        })

        it('Test 4: rejects a non-integer year', () => {
            const result = cardSchema.safeParse({ ...validCard, year: 1989.5 })
            expect(result.success).toBe(false)
        })
    })

    describe('brand', () => {
        it('Test 1: accepts a valid brand', () => {
            const result = cardSchema.safeParse({ ...validCard, brand: 'Topps' })
            expect(result.success).toBe(true)
        })

        it('Test 2: rejects an empty brand', () => {
            const result = cardSchema.safeParse({ ...validCard, brand: '' })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Brand is required')
            }
        })
    })

    describe('category', () => {
        it('Test 1: accepts all valid categories', () => {
            const categories = [
                'baseball', 'hockey', 'football', 'basketball',
                'soccer', 'golf', 'tennis', 'wrestling',
                'pokemon', 'magic', 'yugioh', 'other'
            ]
            categories.forEach((category) => {
                const result = cardSchema.safeParse({ ...validCard, category })
                expect(result.success).toBe(true)
            })
        })

        it('Test 2: rejects an invalid category', () => {
            const result = cardSchema.safeParse({ ...validCard, category: 'lacrosse' })
            expect(result.success).toBe(false)
        })
    })

    describe('condition', () => {
        it('Test 3: accepts all valid conditions', () => {
            const conditions = [
                'PSA 10', 'PSA 9', 'PSA 8', 'PSA 7',
                'BGS 9.5', 'BGS 9',
                'Raw - Mint', 'Raw - Near Mint', 'Raw - Excellent', 'Raw - Good',
            ]
            conditions.forEach((condition) => {
                const result = cardSchema.safeParse({ ...validCard, condition })
                expect(result.success).toBe(true)
            })
        })

        it('Test 4: rejects an invalid condition', () => {
            const result = cardSchema.safeParse({ ...validCard, condition: 'Damaged' })
            expect(result.success).toBe(false)
        })
    })

    describe('purchase_price', () => {
        it('Test 1: accepts zero as a valid price', () => {
            const result = cardSchema.safeParse({ ...validCard, purchase_price: 0 })
            expect(result.success).toBe(true)
        })

        it('Test 2: rejects a negative price', () => {
            const result = cardSchema.safeParse({ ...validCard, purchase_price: -1 })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Price cannot be negative')
            }
        })
    })

    describe('current_value', () => {
        it('Test 1: accepts zero as a valid value', () => {
            const result = cardSchema.safeParse({ ...validCard, current_value: 0 })
            expect(result.success).toBe(true)
        })

        it('Test 2: rejects a negative value', () => {
            const result = cardSchema.safeParse({ ...validCard, current_value: -1 })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Value cannot be negative')
            }
        })
    })

    describe('optional fields', () => {
        it('Test 1: accepts a card with no series', () => {
            const { series: _series, ...withoutSeries } = validCard
            const result = cardSchema.safeParse(withoutSeries)
            expect(result.success).toBe(true)
        })

        it('Test 2: accepts a card with no card number', () => {
            const { card_number: _cardNumber, ...withoutNumber } = validCard
            const result = cardSchema.safeParse(withoutNumber)
            expect(result.success).toBe(true)
        })

        it('Test 3: accepts a card with no notes', () => {
            const { notes: _notes, ...withoutNotes } = validCard
            const result = cardSchema.safeParse(withoutNotes)
            expect(result.success).toBe(true)
        })
    })
})
