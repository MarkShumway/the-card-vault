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
