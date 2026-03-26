import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import {
    setSearch,
    setCategoryFilter,
    setConditionFilter,
    setSortField,
    setSortDirection,
    resetFilters,
} from '../collectionSlice'
import type { CardCategory, CardCondition, SortField } from '../../../types'

const CATEGORIES: Array<{ value: CardCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All Categories' },
    { value: 'baseball', label: 'Baseball' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'football', label: 'Football' },
    { value: 'golf', label: 'Golf' },
    { value: 'hockey', label: 'Hockey' },
    { value: 'magic', label: 'Magic: The Gathering' },
    { value: 'pokemon', label: 'Pokémon' },
    { value: 'soccer', label: 'Soccer' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'wrestling', label: 'Wrestling' },
    { value: 'yugioh', label: 'Yu-Gi-Oh!' },
    { value: 'other', label: 'Other' },
]

const CONDITIONS: Array<{ value: CardCondition | 'all'; label: string }> = [
    { value: 'all', label: 'All Conditions' },
    { value: 'PSA 10', label: 'PSA 10' },
    { value: 'PSA 9', label: 'PSA 9' },
    { value: 'PSA 8', label: 'PSA 8' },
    { value: 'PSA 7', label: 'PSA 7' },
    { value: 'BGS 9.5', label: 'BGS 9.5' },
    { value: 'BGS 9', label: 'BGS 9' },
    { value: 'Raw - Mint', label: 'Raw - Mint' },
    { value: 'Raw - Near Mint', label: 'Raw - Near Mint' },
    { value: 'Raw - Excellent', label: 'Raw - Excellent' },
    { value: 'Raw - Good', label: 'Raw - Good' },
]

const SORT_FIELDS: Array<{ value: SortField; label: string }> = [
    { value: 'created_at', label: 'Date Added' },
    { value: 'player_name', label: 'Name' },
    { value: 'year', label: 'Year' },
    { value: 'current_value', label: 'Current Value' },
    { value: 'purchase_price', label: 'Purchase Price' },
]

function CollectionFilters() {
    const dispatch = useAppDispatch()
    const filters = useAppSelector((state) => state.collection)

    return (
        <div className="collection-filters">
            <div className="collection-filters__search">
                <input
                    className="collection-filters__input"
                    type="text"
                    name="search-input"
                    placeholder="Search by name, brand, or series..."
                    value={filters.search}
                    onChange={(e) => dispatch(setSearch(e.target.value))}
                />
            </div>

            <div className="collection-filters__controls">
                <select
                    className="collection-filters__select"
                    value={filters.category}
                    onChange={(e) => dispatch(setCategoryFilter(e.target.value as CardCategory | 'all'))}
                >
                    {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>

                <select
                    className="collection-filters__select"
                    value={filters.condition}
                    onChange={(e) => dispatch(setConditionFilter(e.target.value as CardCondition | 'all'))}
                >
                    {CONDITIONS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>

                <select
                    className="collection-filters__select"
                    value={filters.sortField}
                    onChange={(e) => dispatch(setSortField(e.target.value as SortField))}
                >
                    {SORT_FIELDS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>

                <button
                    className={`collection-filters__sort-dir ${filters.sortDirection === 'asc' ? 'collection-filters__sort-dir--asc' : ''}`}
                    onClick={() => dispatch(setSortDirection(
                        filters.sortDirection === 'asc' ? 'desc' : 'asc'
                    ))}
                    aria-label="Toggle sort direction"
                >
                    {filters.sortDirection === 'asc' ? '↑' : '↓'}
                </button>

                <button
                    className="collection-filters__reset"
                    onClick={() => dispatch(resetFilters())}
                >
                    Reset
                </button>
            </div>
        </div>
    )
}

export default CollectionFilters
