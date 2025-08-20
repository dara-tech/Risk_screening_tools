import React, { useState } from 'react'
import { Button } from './ui/button'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const YearPicker = ({ selectedYear, onYearSelect, onClose, isYearAvailable }) => {
    const [currentDecade, setCurrentDecade] = useState(Math.floor((selectedYear || new Date().getFullYear()) / 10) * 10)

    const handleDecadeChange = (direction) => {
        const newDecade = direction === 'prev' ? currentDecade - 10 : currentDecade + 10
        setCurrentDecade(newDecade)
    }

    const handleYearSelect = (year) => {
        onYearSelect(year)
        onClose()
    }

    const years = []
    for (let i = currentDecade - 1; i <= currentDecade + 10; i++) {
        years.push(i)
    }

    return (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[280px]">
            {/* Decade Navigation */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDecadeChange('prev')}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                    <FiChevronLeft className="w-4 h-4" />
                    <FiChevronLeft className="w-4 h-4 -ml-2" />
                </Button>
                <span className="text-sm font-medium text-gray-900">{currentDecade}-{currentDecade + 9}</span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDecadeChange('next')}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                    <FiChevronRight className="w-4 h-4" />
                    <FiChevronRight className="w-4 h-4 -ml-2" />
                </Button>
            </div>

            {/* Year Grid */}
            <div className="p-3">
                <div className="grid grid-cols-3 gap-2">
                    {years.map((year) => {
                        const isAvailable = isYearAvailable ? isYearAvailable(year) : true
                        return (
                            <Button
                                key={year}
                                variant={selectedYear === year ? "default" : "outline"}
                                onClick={() => isAvailable && handleYearSelect(year)}
                                disabled={!isAvailable}
                                className={`h-10 text-sm ${
                                    selectedYear === year
                                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                        : 'border-gray-300 hover:bg-gray-50'
                                } ${year < currentDecade || year > currentDecade + 9 ? 'opacity-50' : ''} ${
                                    !isAvailable ? 'opacity-30 cursor-not-allowed' : ''
                                }`}
                            >
                                {year}
                            </Button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default YearPicker
