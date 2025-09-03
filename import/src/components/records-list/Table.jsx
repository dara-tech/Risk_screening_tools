import React, { useState } from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import Tooltip from '../ui/tooltip'
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi'
// Removed: BulkDeleteModal is no longer needed

const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString()
}

const Table = ({ loading, totalRecords, records, getRiskLevelColor, onDelete, deletingId, onBulkDelete, bulkDeleting, onEdit, onView }) => {
    const [selectedIds, setSelectedIds] = useState([])
    // Removed: showBulkDeleteModal state is gone

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(records.map(record => record.id))
        } else {
            setSelectedIds([])
        }
    }

    const handleSelectRecord = (recordId, checked) => {
        if (checked) {
            setSelectedIds(prev => [...prev, recordId])
        } else {
            setSelectedIds(prev => prev.filter(id => id !== recordId))
        }
    }

    // New: Simplified bulk delete handler
    const handleBulkDeleteClick = async () => {
        if (selectedIds.length === 0 || bulkDeleting) return

        // 1. Use a simple browser confirm dialog
        const userConfirmed = window.confirm(
            `Are you sure you want to permanently delete ${selectedIds.length} record(s)? This action cannot be undone.`
        )

        // 2. If confirmed, call the delete function and wait for it to finish
        if (userConfirmed && onBulkDelete) {
            const selectedRecordsArray = records.filter(record => selectedIds.includes(record.id))
            await onBulkDelete(selectedRecordsArray)
            // 3. Clear the selection only after deletion is complete
            setSelectedIds([])
        }
    }

    const isAllSelected = records.length > 0 && selectedIds.length === records.length

    return (
        <div className="min-h-screen flex flex-col">
            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-blue-900">
                            {selectedIds.length} record(s) selected
                        </span>
                        <Button
                            onClick={handleBulkDeleteClick}
                            variant="destructive"
                            size="sm"
                            disabled={bulkDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white w-40" // Added fixed width for consistency
                        >
                            {bulkDeleting ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Deleting...
                                </div>
                            ) : `Delete Selected (${selectedIds.length})`}
                        </Button>
                    </div>
                    <Button
                        onClick={() => setSelectedIds([])}
                        variant="ghost"
                        size="sm"
                        className="text-blue-700 hover:text-blue-800"
                    >
                        Clear Selection
                    </Button>
                </div>
            )}

            {/* Removed: The BulkDeleteModal component is gone */}

            {loading ? (
                <div className="flex-1">
                    <div className="overflow-x-auto overflow-y-auto min-h-screen">
                        <table className="w-full">
                            <thead className="bg-white/70 backdrop-blur border-b border-slate-200 sticky top-0 z-10">
                                <tr>
                                    <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">
                                        <div className="flex justify-center">
                                            <Checkbox 
                                                onCheckedChange={(checked) => handleSelectAll(checked)}
                                                checked={isAllSelected}
                                                disabled={records.length === 0}
                                            />
                                        </div>
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Patient Information</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Demographics</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Location</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Risk Assessment</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Clinical Data</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Screening Date</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[...Array(20)].map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        <td className="py-4 px-6">
                                            <div className="flex justify-center">
                                                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-3">
                                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                                <div className="h-3 bg-gray-100 rounded w-20"></div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-3">
                                                <div className="h-4 bg-gray-200 rounded w-28"></div>
                                                <div className="h-3 bg-gray-100 rounded w-16"></div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                                <div className="h-3 bg-gray-100 rounded w-16"></div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-2">
                                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                                                <div className="h-3 bg-gray-200 rounded w-20"></div>
                                                <div className="h-3 bg-gray-200 rounded w-14"></div>
                                                <div className="h-3 bg-gray-200 rounded w-12"></div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-1">
                                                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : totalRecords === 0 ? (
                <div className="flex-1 flex items-center justify-center py-16">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="w-10 h-10 text-gray-400">📄</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">No Records Found</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            No screening records match your current filters. Try adjusting your organization unit, 
                            period selection, or search criteria.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex-1">
                    <div className="overflow-x-auto overflow-y-auto min-h-screen">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                <tr>
                                    <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">
                                        <div className="flex justify-center">
                                            <Checkbox 
                                                onCheckedChange={(checked) => handleSelectAll(checked)}
                                                checked={isAllSelected}
                                                disabled={records.length === 0}
                                            />
                                        </div>
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Patient Information</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Demographics</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Location</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Risk Assessment</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Clinical Data</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Screening Date</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {records.map((record, index) => (
                                    <tr key={record.id || `record-${index}`} className="hover:bg-gray-50/70 transition-colors duration-150">
                                        <td className="py-4 px-6">
                                            <div className="flex justify-center">
                                                <Checkbox 
                                                    onCheckedChange={(checked) => handleSelectRecord(record.id, checked)}
                                                    checked={selectedIds.includes(record.id)}
                                                />
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="font-semibold text-gray-900 text-sm">
                                                    {record.systemId || 'No ID'}
                                                </div>
                                                <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                                                    {record.uuic || 'No UUIC'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="font-medium text-gray-900 text-sm">
                                                    {[record.familyName, record.lastName].filter(Boolean).join(' ') || 'No Name'}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge 
                                                        variant="secondary" 
                                                        className="text-xs bg-slate-100 text-slate-700 border-slate-200"
                                                    >
                                                        {record.sex || 'Unknown'}
                                                    </Badge>
                                                    {record.age && (
                                                        <span className="text-xs text-gray-500">
                                                            Age {record.age}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {record.province || 'Unknown Province'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {record.district || 'Unknown District'}
                                                </div>
                                                {record.commune && (
                                                    <div className="text-xs text-gray-400">
                                                        {record.commune}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-2">
                                                <Badge 
                                                    variant="outline" 
                                                    className={`font-medium border-slate-200 text-slate-700`}
                                                >
                                                    {record.riskScreeningResult || record.riskLevel || 'Unknown Risk'}
                                                </Badge>
                                                {record.riskScreeningScore && (
                                                    <div className="text-xs text-gray-500">
                                                        Score: {record.riskScreeningScore}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="text-xs text-gray-600">
                                                    <span className="font-medium">Gender:</span> {record.genderIdentity || 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    <span className="font-medium">Sex Activity:</span> {record.hadSexPast6Months === 'true' ? 'Yes' : record.hadSexPast6Months === 'false' ? 'No' : 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    <span className="font-medium">Partners:</span> {record.numberOfSexualPartners || 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    <span className="font-medium">HIV Test:</span> {record.hivTestPast6Months === 'true' ? 'Yes' : record.hivTestPast6Months === 'false' ? 'No' : 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-700 font-medium">
                                                {formatDate(record.eventDate)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-1">
                                                <Tooltip content="View record details" position="top">
                                                    <Button
                                                        onClick={() => onView && onView(record)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                                    >
                                                        <FiEye className="w-4 h-4" />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content="Edit record" position="top">
                                                    <Button
                                                        onClick={() => onEdit && onEdit(record)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        <FiEdit className="w-4 h-4" />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content="Delete record" position="top">
                                                    <Button
                                                        onClick={() => onDelete && onDelete(record)}
                                                        variant="ghost"
                                                        size="icon"
                                                        disabled={deletingId === record.id}
                                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        {deletingId === record.id ? (
                                                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <FiTrash2 className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Table