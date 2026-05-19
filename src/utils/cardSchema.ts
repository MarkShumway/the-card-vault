import { z } from 'zod'

export const cardSchema = z.object({
    player_name: z.string().min(1, 'Player name is required'),
    year: z
        .number({ error: 'Year is required' })
        .int()
        .min(1800, 'Year must be 1800 or later')
        .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
    brand: z.string().min(1, 'Brand is required'),
    series: z.string().optional(),
    card_number: z.string().optional(),
    category: z.enum([
        'baseball', 'hockey', 'football', 'basketball',
        'soccer', 'golf', 'tennis', 'wrestling',
        'pokemon', 'magic', 'yugioh', 'other'
    ]),
    condition: z.enum([
        'PSA 10', 'PSA 9', 'PSA 8', 'PSA 7',
        'BGS 9.5', 'BGS 9',
        'Raw - Mint', 'Raw - Near Mint', 'Raw - Excellent', 'Raw - Good',
    ]),
    purchase_price: z
        .number({ error: 'Purchase price is required' })
        .min(0, 'Price cannot be negative'),
    current_value: z
        .number({ error: 'Current value is required' })
        .min(0, 'Value cannot be negative'),
    notes: z.string().optional(),
})

export type CardFormValues = z.infer<typeof cardSchema>
