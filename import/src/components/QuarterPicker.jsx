import React, { useState } from 'react'
import { Button } from './ui/button'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const QuarterPicker = ({ selectedYear, selectedQuarter, onYearChange, onQuarterSelect, onClose, isQuarterAvailable, getAvailableQuartersForYear }) => {
    const [currentYear, setCurrentYear] = useState(selectedYear || new Date().getFullYear())

    const handleYearChange = (direction) => {
        const newYear = direction === 'prev' ? currentYear - 1 : currentYear + 1
        setCurrentYear(newYear)
        onYearChange(newYear)
    }

    const handleQuarterSelect = (quarter) => {
        onQuarterSelect(quarter)
        onClose()
    }

    return (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[280px]">
            {/* Year Navigation */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleYearChange('prev')}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                    <FiChevronLeft className="w-4 h-4" />
                    <FiChevronLeft className="w-4 h-4 -ml-2" />
                </Button>
                <span className="text-sm font-medium text-gray-900">{currentYear}</span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleYearChange('next')}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                    <FiChevronRight className="w-4 h-4" />
                    <FiChevronRight className="w-4 h-4 -ml-2" />
                </Button>
            </div>

            {/* Quarter Buttons */}
            <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((quarter) => {
                        const isAvailable = getAvailableQuartersForYear ? getAvailableQuartersForYear(currentYear).includes(quarter) : true
                        return (
                            <Button
                                key={quarter}
                                variant={selectedQuarter === quarter ? "default" : "outline"}
                                onClick={() => isAvailable && handleQuarterSelect(quarter)}
                                disabled={!isAvailable}
                                className={`h-12 ${
                                    selectedQuarter === quarter 
                                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                        : 'border-gray-300 hover:bg-gray-50'
                                } ${!isAvailable ? 'opacity-30 cursor-not-allowed' : ''}`}
                            >
                                Q{quarter}
                            </Button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default QuarterPicker
