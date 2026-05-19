import { describe, it, expect } from 'vitest'
import collectionReducer, {
    setSearch,
    setCategoryFilter,
    setConditionFilter,
    setSortField,
    setSortDirection,
    setCurrentPage,
    setPageSize,
    resetFilters,
} from '../features/collection/collectionSlice'
import type { CollectionFilters } from '../types'

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

describe('collectionSlice', () => {

    describe('initial state', () => {
        it('Test 1: returns the correct initial state', () => {
            const state = collectionReducer(undefined, { type: '@@INIT' })
            expect(state).toEqual(initialState)
        })
    })

    describe('setSearch', () => {
        it('Test 1: updates the search term', () => {
            const state = collectionReducer(initialState, setSearch('Mike Trout'))
            expect(state.search).toBe('Mike Trout')
        })

        it('Test 2: resets currentPage to 1 when search changes', () => {
            const stateOnPage3 = { ...initialState, currentPage: 3 }
            const state = collectionReducer(stateOnPage3, setSearch('Griffey'))
            expect(state.currentPage).toBe(1)
        })
    })

    describe('setCategoryFilter', () => {
        it('Test 1: updates the category filter', () => {
            const state = collectionReducer(initialState, setCategoryFilter('baseball'))
            expect(state.category).toBe('baseball')
        })

        it('Test 2: resets currentPage to 1 when category changes', () => {
            const stateOnPage3 = { ...initialState, currentPage: 3 }
            const state = collectionReducer(stateOnPage3, setCategoryFilter('hockey'))
            expect(state.currentPage).toBe(1)
        })

        it('Test 3: accepts all as a valid category filter', () => {
            const state = collectionReducer(initialState, setCategoryFilter('all'))
            expect(state.category).toBe('all')
        })
    })

    describe('setConditionFilter', () => {
        it('Test 1: updates the condition filter', () => {
            const state = collectionReducer(initialState, setConditionFilter('PSA 10'))
            expect(state.condition).toBe('PSA 10')
        })

        it('Test 2: resets currentPage to 1 when condition changes', () => {
            const stateOnPage3 = { ...initialState, currentPage: 3 }
            const state = collectionReducer(stateOnPage3, setConditionFilter('PSA 9'))
            expect(state.currentPage).toBe(1)
        })
    })

    describe('setSortField', () => {
        it('Test 1: updates the sort field', () => {
            const state = collectionReducer(initialState, setSortField('player_name'))
            expect(state.sortField).toBe('player_name')
        })

        it('Test 2: resets currentPage to 1 when sort field changes', () => {
            const stateOnPage3 = { ...initialState, currentPage: 3 }
            const state = collectionReducer(stateOnPage3, setSortField('current_value'))
            expect(state.currentPage).toBe(1)
        })
    })

    describe('setSortDirection', () => {
        it('Test 1: updates sort direction to asc', () => {
            const state = collectionReducer(initialState, setSortDirection('asc'))
            expect(state.sortDirection).toBe('asc')
        })

        it('Test 2: updates sort direction to desc', () => {
            const stateAsc = { ...initialState, sortDirection: 'asc' as const }
            const state = collectionReducer(stateAsc, setSortDirection('desc'))
            expect(state.sortDirection).toBe('desc')
        })

        it('Test 3: does not reset currentPage when sort direction changes', () => {
            const stateOnPage3 = { ...initialState, currentPage: 3 }
            const state = collectionReducer(stateOnPage3, setSortDirection('asc'))
            expect(state.currentPage).toBe(3)
        })
    })

    describe('setCurrentPage', () => {
        it('Test 1: updates the current page', () => {
            const state = collectionReducer(initialState, setCurrentPage(4))
            expect(state.currentPage).toBe(4)
        })

        it('Test 2: can set page to 1', () => {
            const stateOnPage5 = { ...initialState, currentPage: 5 }
            const state = collectionReducer(stateOnPage5, setCurrentPage(1))
            expect(state.currentPage).toBe(1)
        })
    })

    describe('setPageSize', () => {
        it('Test 1: updates the page size', () => {
            const state = collectionReducer(initialState, setPageSize(24))
            expect(state.pageSize).toBe(24)
        })

        it('Test 2: resets currentPage to 1 when page size changes', () => {
            const stateOnPage3 = { ...initialState, currentPage: 3 }
            const state = collectionReducer(stateOnPage3, setPageSize(48))
            expect(state.currentPage).toBe(1)
        })
    })

    describe('resetFilters', () => {
        it('Test 1: resets all filters to initial state', () => {
            const modifiedState: CollectionState = {
                search: 'Griffey',
                category: 'baseball',
                condition: 'PSA 10',
                sortField: 'player_name',
                sortDirection: 'asc',
                currentPage: 5,
                pageSize: 24,
            }
            const state = collectionReducer(modifiedState, resetFilters())
            expect(state.search).toBe('')
            expect(state.category).toBe('all')
            expect(state.condition).toBe('all')
            expect(state.sortField).toBe('created_at')
            expect(state.sortDirection).toBe('desc')
            expect(state.currentPage).toBe(1)
        })

        it('Test 2: preserves the current page size when resetting filters', () => {
            const modifiedState: CollectionState = {
                ...initialState,
                pageSize: 48,
                search: 'Griffey',
            }
            const state = collectionReducer(modifiedState, resetFilters())
            expect(state.pageSize).toBe(48)
        })
    })
})
