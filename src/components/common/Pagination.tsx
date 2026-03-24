import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setCurrentPage, setPageSize } from '../../features/collection/collectionSlice'

interface PaginationProps {
    totalItems: number
}

const PAGE_SIZE_OPTIONS = [12, 24, 48]

function Pagination({ totalItems }: PaginationProps) {
    const dispatch = useAppDispatch()
    const { currentPage, pageSize } = useAppSelector((state) => state.collection)

    const totalPages = Math.ceil(totalItems / pageSize)
    const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
    const to = Math.min(currentPage * pageSize, totalItems)

    // Build page number array with ellipsis
    const getPageNumbers = (): (number | 'ellipsis')[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        const pages: (number | 'ellipsis')[] = [1]

        if (currentPage > 3) pages.push('ellipsis')

        const start = Math.max(2, currentPage - 1)
        const end = Math.min(totalPages - 1, currentPage + 1)

        for (let i = start; i <= end; i++) pages.push(i)

        if (currentPage < totalPages - 2) pages.push('ellipsis')

        pages.push(totalPages)

        return pages
    }

    if (totalPages <= 1 && totalItems <= pageSize) return null

    return (
        <div className="pagination">
            <div className="pagination__info">
                Showing <strong>{from}–{to}</strong> of <strong>{totalItems}</strong> cards
            </div>

            <div className="pagination__controls">
                {/* Previous */}
                <button
                    className="pagination__btn"
                    onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                >
                    ←
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((page, index) =>
                        page === 'ellipsis' ? (
                            <span key={`ellipsis-${index}`} className="pagination__ellipsis">
                                …
                            </span>
                        ) : (
                            <button
                                key={page}
                                className={`pagination__btn ${currentPage === page ? 'pagination__btn--active' : ''}`}
                                onClick={() => dispatch(setCurrentPage(page))}
                                aria-label={`Page ${page}`}
                                aria-current={currentPage === page ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        )
                )}

                {/* Next */}
                <button
                    className="pagination__btn"
                    onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                >
                    →
                </button>
            </div>

            {/* Page size selector */}
            <div className="pagination__size">
                <span className="pagination__size-label">Per page</span>
                <select
                    className="pagination__size-select"
                    value={pageSize}
                    onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
                >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default Pagination
