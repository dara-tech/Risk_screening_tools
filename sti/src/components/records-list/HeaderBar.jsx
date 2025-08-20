import React from 'react'
import { Badge } from '../ui/badge'

const HeaderBar = ({
    loading,
    totalRecords,
    currentPage,
    totalPages,
    orgUnits,
    selectedOrgUnit,
    periodLabel
}) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="w-5 h-5 text-blue-600">📄</span>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Screening Records</h2>
                    <div className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
                        {selectedOrgUnit && (
                            <>
                                <span className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                    {orgUnits.find(ou => ou.id === selectedOrgUnit)?.displayName}
                                </span>
                                <span>•</span>
                            </>
                        )}
                        <span>{periodLabel}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-4 flex-wrap gap-y-2 justify-end">
                {loading ? (
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 animate-pulse">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
                            <span>Loading...</span>
                        </div>
                    </Badge>
                ) : (
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                        <span className="font-semibold text-slate-900">{totalRecords.toLocaleString()}</span> Records Found
                    </Badge>
                )}
                {!loading && totalRecords > 0 && (
                    <div className="flex items-center space-x-3 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg flex-wrap gap-y-2">
                        <div className="flex items-center space-x-1">
                            <span className="font-medium">Page</span>
                            <span className="px-2 py-1 bg-white rounded border text-slate-900 font-semibold">{currentPage}</span>
                            <span>of</span>
                            <span className="font-medium">{totalPages}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HeaderBar


