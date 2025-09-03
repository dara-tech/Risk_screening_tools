import React from 'react'
import { Button } from '../ui/button'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const Pagination = ({
    currentPage,
    totalPages,
    onFirst,
    onPrev,
    onNext,
    onLast,
    goToPage
}) => {
    const startPage = Math.max(1, currentPage - 1)
    const endPage = Math.min(totalPages, currentPage + 1)
    const pageButtons = []
    for (let p = startPage; p <= endPage; p++) {
        pageButtons.push(p)
    }

    return (
        <div className="flex items-center justify-center sm:justify-end space-x-1 sm:space-x-2">
            <Button onClick={onPrev} disabled={currentPage === 1} variant="outline" size="sm" className="h-8 sm:h-9 px-2 sm:px-3">
                <FiChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
            </Button>
            <div className="flex items-center space-x-1">
                {pageButtons.map(p => (
                    <Button key={p} onClick={() => goToPage(p)} variant={currentPage === p ? 'default' : 'outline'} size="sm" className={`h-8 w-8 sm:h-9 sm:w-9 p-0 ${currentPage === p ? 'bg-blue-600 text-white border-blue-600' : ''}`}>
                        {p}
                    </Button>
                ))}
            </div>
            <Button onClick={onNext} disabled={currentPage >= totalPages} variant="outline" size="sm" className="h-8 sm:h-9 px-2 sm:px-3">
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
            </Button>
        </div>
    )
}

export default Pagination


