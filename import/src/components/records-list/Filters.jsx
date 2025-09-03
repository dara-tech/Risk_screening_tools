import React from 'react'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import {Calendar1, RefreshCw } from 'lucide-react'
import YearPicker from '../YearPicker'
import QuarterPicker from '../QuarterPicker'
import MonthPicker from '../MonthPicker'

const Filters = ({
    orgUnits,
    selectedOrgUnit,
    setSelectedOrgUnit,
    selectedPeriodType,
    setSelectedPeriodType,
    selectedYear,
    selectedQuarter,
    selectedMonth,
    showYearPicker,
    showQuarterPicker,
    showMonthPicker,
    selectedPeriod,
    onYearSelect,
    onQuarterSelect,
    onMonthSelect,
    getPeriodDisplay,
    onToggleYearPicker,
    onToggleQuarterPicker,
    onToggleMonthPicker,
    onClosePickers,
    onRun,
    // Availability constraints
    isYearAvailable,
    getAvailableQuartersForYear,
    getAvailableMonthsForYear,
    loading
}) => {
    return (
        <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-4">
                {/* Organization Unit */}
                <div className="flex-1 min-w-[200px]">
                    <Select value={selectedOrgUnit} onValueChange={setSelectedOrgUnit}>
                        <SelectTrigger className="h-10 bg-white border border-slate-300 rounded-md">
                            <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-md max-h-60 shadow-lg">
                            {orgUnits.map(ou => (
                                <SelectItem key={ou.id} value={ou.id} className="hover:bg-gray-50">
                                    {ou.displayName || ou.id}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Period Type */}
                <div className="flex-1 min-w-[150px]">
                    <Select 
                        value={selectedPeriodType} 
                        onValueChange={setSelectedPeriodType}
                        disabled={!selectedOrgUnit}
                    >
                        <SelectTrigger className="h-10 bg-white border border-slate-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed">
                            <SelectValue placeholder={selectedOrgUnit ? "Select period type" : "Select organization first"} />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                            <SelectItem value="yearly" className="hover:bg-gray-50">Yearly</SelectItem>
                            <SelectItem value="quarterly" className="hover:bg-gray-50">Quarterly</SelectItem>
                            <SelectItem value="monthly" className="hover:bg-gray-50">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Period Selector */}
                <div className="flex-1 min-w-[200px] relative picker-container">
                    <Button
                        onClick={() => {
                            if (selectedPeriodType === 'yearly') {
                                onToggleYearPicker()
                            } else if (selectedPeriodType === 'quarterly') {
                                onToggleQuarterPicker()
                            } else if (selectedPeriodType === 'monthly') {
                                onToggleMonthPicker()
                            }
                        }}
                        disabled={!selectedOrgUnit || !selectedPeriodType}
                        variant="outline"
                        className="h-10 w-full justify-between bg-white border border-slate-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <span className="text-left">{getPeriodDisplay()}</span>
                        <Calendar1 className="w-4 h-4" />
                    </Button>

                    {/* Year Picker */}
                    {showYearPicker && (
                        <YearPicker
                            selectedYear={selectedYear}
                            onYearSelect={onYearSelect}
                            isYearAvailable={isYearAvailable}
                            onClose={onClosePickers}
                        />
                    )}
                    {/* Quarter Picker */}
                    {showQuarterPicker && (
                        <QuarterPicker
                            selectedYear={selectedYear}
                            selectedQuarter={selectedQuarter}
                            onYearChange={onYearSelect}
                            onQuarterSelect={onQuarterSelect}
                            getAvailableQuartersForYear={getAvailableQuartersForYear}
                            onClose={onClosePickers}
                        />
                    )}
                    {/* Month Picker */}
                    {showMonthPicker && (
                        <MonthPicker
                            selectedYear={selectedYear}
                            selectedMonth={selectedMonth}
                            onYearChange={onYearSelect}
                            onMonthSelect={onMonthSelect}
                            getAvailableMonthsForYear={getAvailableMonthsForYear}
                            onClose={onClosePickers}
                        />
                    )}
                </div>

                {/* Run Button */}
                <Button
                    onClick={onRun}
                    disabled={loading || !selectedOrgUnit || !selectedPeriod}
                    className="h-10 px-6 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : !selectedOrgUnit ? (
                        'Select Organization'
                    ) : !selectedPeriod ? (
                        'Select Period'
                    ) : (
                        'Run'
                    )}
                </Button>
            </div>
        </div>
    )
}

export default Filters


