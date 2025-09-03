import React, { useState, useEffect } from 'react'

const CascadingFilterTest = () => {
    const [selectedYear, setSelectedYear] = useState('')
    const [selectedQuarter, setSelectedQuarter] = useState('')
    const [selectedMonth, setSelectedMonth] = useState('')
    const [years, setYears] = useState([])
    const [quarters, setQuarters] = useState([])
    const [months, setMonths] = useState([])

    // Generate years
    useEffect(() => {
        const years = []
        const currentYear = new Date().getFullYear()
        for (let i = 0; i <= 5; i++) {
            const year = currentYear - i
            years.push({
                value: year.toString(),
                label: year.toString()
            })
        }
        setYears(years)
        setSelectedYear(currentYear.toString())
    }, [])

    // Generate quarters when year changes
    useEffect(() => {
        if (selectedYear) {
            const quarters = []
            for (let quarter = 1; quarter <= 4; quarter++) {
                const quarterLabel = `Q${quarter}`
                quarters.push({
                    value: quarter.toString(),
                    label: `${quarterLabel} (${selectedYear})`
                })
            }
            setQuarters(quarters)
            setSelectedQuarter('')
            setSelectedMonth('')
        } else {
            setQuarters([])
            setSelectedQuarter('')
            setSelectedMonth('')
        }
    }, [selectedYear])

    // Generate months when quarter changes
    useEffect(() => {
        if (selectedYear && selectedQuarter) {
            const months = []
            const quarterNum = parseInt(selectedQuarter)
            const startMonth = (quarterNum - 1) * 3 + 1
            const endMonth = quarterNum * 3
            
            for (let month = startMonth; month <= endMonth; month++) {
                const date = new Date(selectedYear, month - 1, 1)
                const monthName = date.toLocaleDateString('en-US', { month: 'long' })
                months.push({
                    value: month.toString(),
                    label: `${monthName} (${selectedYear})`
                })
            }
            setMonths(months)
            setSelectedMonth('')
        } else {
            setMonths([])
            setSelectedMonth('')
        }
    }, [selectedYear, selectedQuarter])

    const getFilterPeriodDisplay = () => {
        if (selectedMonth && selectedQuarter) {
            const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleDateString('en-US', { month: 'long' })
            return `${monthName} ${selectedYear} (Q${selectedQuarter})`
        } else if (selectedQuarter) {
            return `Q${selectedQuarter} ${selectedYear}`
        } else if (selectedYear) {
            return selectedYear
        }
        return 'All periods'
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Cascading Filter Test</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Year Selector */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Year</label>
                    <select 
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Select year</option>
                        {years.map(year => (
                            <option key={year.value} value={year.value}>
                                {year.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Quarter Selector */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Quarter</label>
                    <select 
                        value={selectedQuarter} 
                        onChange={(e) => setSelectedQuarter(e.target.value)}
                        disabled={!selectedYear}
                        className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                    >
                        <option value="">{selectedYear ? "Select quarter" : "Select year first"}</option>
                        {quarters.map(quarter => (
                            <option key={quarter.value} value={quarter.value}>
                                {quarter.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Month Selector */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Month</label>
                    <select 
                        value={selectedMonth} 
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        disabled={!selectedQuarter}
                        className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                    >
                        <option value="">{selectedQuarter ? "Select month" : "Select quarter first"}</option>
                        {months.map(month => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Current Selection Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Current Selection:</h3>
                <div className="text-blue-800">
                    <p><strong>Year:</strong> {selectedYear || 'Not selected'}</p>
                    <p><strong>Quarter:</strong> {selectedQuarter || 'Not selected'}</p>
                    <p><strong>Month:</strong> {selectedMonth || 'Not selected'}</p>
                    <p><strong>Display:</strong> {getFilterPeriodDisplay()}</p>
                </div>
            </div>

            {/* Available Options */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Available Years ({years.length})</h4>
                    <div className="text-sm text-gray-600">
                        {years.map(year => (
                            <div key={year.value} className="py-1">
                                {year.label} {year.value === selectedYear && '✓'}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Available Quarters ({quarters.length})</h4>
                    <div className="text-sm text-gray-600">
                        {quarters.map(quarter => (
                            <div key={quarter.value} className="py-1">
                                {quarter.label} {quarter.value === selectedQuarter && '✓'}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Available Months ({months.length})</h4>
                    <div className="text-sm text-gray-600">
                        {months.map(month => (
                            <div key={month.value} className="py-1">
                                {month.label} {month.value === selectedMonth && '✓'}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CascadingFilterTest
