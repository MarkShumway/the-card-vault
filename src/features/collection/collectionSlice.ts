/**
 * collectionSlice.ts
 *
 * Redux slice for managing the card collection browser UI state. Tracks
 * filter, sort, and pagination state used to query and display the collection.
 *
 * State shape (CollectionState extends CollectionFilters):
 *   - search          Text search string applied against card names/details
 *   - category        Active category filter ('all' or a specific CardCategory)
 *   - condition       Active condition filter ('all' or a specific card condition)
 *   - sortField       Field currently used to sort results (default: 'created_at')
 *   - sortDirection   Sort order, 'asc' or 'desc' (default: 'desc')
 *   - currentPage     Current pagination page (1-based, default: 1)
 *   - pageSize        Number of cards displayed per page (default: 12)
 *
 * Reducers:
 *   - setSearch           Updates the search string and resets to page 1
 *   - setCategoryFilter   Sets the category filter and resets to page 1
 *   - setConditionFilter  Sets the condition filter and resets to page 1
 *   - setSortField        Updates the sort field and resets to page 1
 *   - setSortDirection    Updates the sort direction (page is not reset)
 *   - setCurrentPage      Navigates to a specific page
 *   - setPageSize         Updates the page size and resets to page 1
 *   - resetFilters        Restores all filter/sort/page defaults while preserving pageSize
 */

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CollectionFilters, CardCategory, SortField, SortDirection } from '../../types'

interface CollectionState extends CollectionFilters {
    currentPage: number
    pageSize: number
}

const initialState: CollectionState = {
    search: '',
    category: 'all',
    condition: 'all',
    sortField: 'created_at',
    sortDirection: 'desc',
    currentPage: 1,
    pageSize: 12,
}

const collectionSlice = createSlice({
    name: 'collection',
    initialState,
    reducers: {
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload
            state.currentPage = 1
        },
        setCategoryFilter(state, action: PayloadAction<CardCategory | 'all'>) {
            state.category = action.payload
            state.currentPage = 1
        },
        setConditionFilter(state, action: PayloadAction<CollectionFilters['condition']>) {
            state.condition = action.payload
            state.currentPage = 1
        },
        setSortField(state, action: PayloadAction<SortField>) {
            state.sortField = action.payload
            state.currentPage = 1
        },
        setSortDirection(state, action: PayloadAction<SortDirection>) {
            state.sortDirection = action.payload
        },
        setCurrentPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload
        },
        setPageSize(state, action: PayloadAction<number>) {
            state.pageSize = action.payload
            state.currentPage = 1
        },
        resetFilters(state) {
            return { ...initialState, pageSize: state.pageSize }
        },
    },
})

export const {
    setSearch,
    setCategoryFilter,
    setConditionFilter,
    setSortField,
    setSortDirection,
    setCurrentPage,
    setPageSize,
    resetFilters,
} = collectionSlice.actions

export default collectionSlice.reducer
