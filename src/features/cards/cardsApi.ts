import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { supabase } from '../../services/supabase'
import type { CardRow, CardInsert, CardUpdate } from '../../types'

// ─── Define API endpoints ──────────────────────────────
export const cardsApi = createApi({
    reducerPath: 'cardsApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Card'],
    endpoints: (builder) => ({

        // ─── Get all cards for current user ──────────────────────────────
        getCards: builder.query<CardRow[], void>({
            async queryFn() {
                const { data, error } = await supabase
                    .from('cards')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
                return { data: data ?? [] }
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Card' as const, id })),
                        { type: 'Card', id: 'LIST' },
                    ]
                    : [{ type: 'Card', id: 'LIST' }],
        }),

        // ─── Get single card ──────────────────────────────────────────────
        getCardById: builder.query<CardRow, string>({
            async queryFn(id) {
                const { data, error } = await supabase
                    .from('cards')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
                return { data }
            },
            providesTags: (_result, _error, id) => [{ type: 'Card', id }],
        }),

        // ─── Add card ─────────────────────────────────────────────────────
        addCard: builder.mutation<CardRow, CardInsert>({
            async queryFn(card) {
                const { data, error } = await supabase
                    .from('cards')
                    .insert(card)
                    .select()
                    .single()

                if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
                return { data }
            },
            invalidatesTags: [{ type: 'Card', id: 'LIST' }],
        }),

        // ─── Update card ──────────────────────────────────────────────────
        updateCard: builder.mutation<CardRow, { id: string; updates: CardUpdate }>({
            async queryFn({ id, updates }) {
                const { data, error } = await supabase
                    .from('cards')
                    .update(updates)
                    .eq('id', id)
                    .select()
                    .single()

                if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
                return { data }
            },
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Card', id }],
        }),

        // ─── Delete card ──────────────────────────────────────────────────
        deleteCard: builder.mutation<void, string>({
            async queryFn(id) {
                const { error } = await supabase
                    .from('cards')
                    .delete()
                    .eq('id', id)

                if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
                return { data: undefined }
            },
            invalidatesTags: (_result, _error, id) => [{ type: 'Card', id }],
        }),

        // ─── Upload card image ────────────────────────────────────────────
        uploadCardImage: builder.mutation<string, { userId: string; file: File }>({
            async queryFn({ userId, file }) {
                const fileExt = file.name.split('.').pop()
                const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('card-images')
                    .upload(filePath, file)

                if (uploadError) return { error: { status: 'CUSTOM_ERROR', error: uploadError.message } }

                const { data } = supabase.storage
                    .from('card-images')
                    .getPublicUrl(filePath)

                return { data: data.publicUrl }
            },
        }),

    }),
})

export const {
    useGetCardsQuery,
    useGetCardByIdQuery,
    useAddCardMutation,
    useUpdateCardMutation,
    useDeleteCardMutation,
    useUploadCardImageMutation,
} = cardsApi
