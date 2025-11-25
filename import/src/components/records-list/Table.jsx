import React, { useState } from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Modal } from '../ui/modal'
import Tooltip from '../ui/tooltip'
import { FiEye, FiEdit, FiTrash2, FiChevronDown, FiChevronRight, FiCheck, FiX, FiEdit2, FiAlertTriangle } from 'react-icons/fi'
import { FORM_FIELD_LABELS_KH } from '../../lib/dhis2FormData'

const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString()
}

const formatBoolean = (value) => {
    if (value === true || value === 'true' || value === '1' || value === 1) return 'បាទ/ចាស'
    if (value === false || value === 'false' || value === '0' || value === 0) return 'ទេ'
    return 'N/A'
}

const Table = ({ 
    loading, 
    totalRecords, 
    records, 
    getRiskLevelColor, 
    onDelete, 
    deletingId, 
    onBulkDelete, 
    bulkDeleting, 
    onEdit, 
    onView,
    onInlineUpdate,
    editableFields = new Set(),
    fieldOptions = {},
    dateFields = [],
    numberFields = []
}) => {
    const [selectedIds, setSelectedIds] = useState([])
    const [expandedRows, setExpandedRows] = useState(new Set())
    const [editingCell, setEditingCell] = useState(null)
    const [draftValue, setDraftValue] = useState('')
    const [savingCell, setSavingCell] = useState(null)
    const [inlineError, setInlineError] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const toggleExpand = (recordId) => {
        setExpandedRows(prev => {
            const next = new Set(prev)
            if (next.has(recordId)) {
                next.delete(recordId)
            } else {
                next.add(recordId)
            }
            return next
        })
    }

    const handleStartEditing = (record, fieldKey, currentValue) => {
        setEditingCell({ recordId: record.id, fieldKey })
        setDraftValue(currentValue || '')
        setInlineError(null)
    }

    const handleCancelEditing = () => {
        setEditingCell(null)
        setDraftValue('')
        setInlineError(null)
    }

    const handleSaveEditing = async (record, fieldKey) => {
        if (!onInlineUpdate) return
        
        try {
            setSavingCell({ recordId: record.id, fieldKey })
            setInlineError(null)
            await onInlineUpdate(record, fieldKey, draftValue)
            setEditingCell(null)
            setDraftValue('')
        } catch (error) {
            setInlineError(error.message || 'Failed to update field')
        } finally {
            setSavingCell(null)
        }
    }

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
    const handleBulkDeleteClick = () => {
        if (selectedIds.length === 0 || bulkDeleting) return
        setShowDeleteModal(true)
    }

    // Confirm and execute bulk delete
    const confirmBulkDelete = async () => {
        if (!onBulkDelete) return
        
        const selectedRecordsArray = records.filter(record => selectedIds.includes(record.id))
        await onBulkDelete(selectedRecordsArray)
        // Clear the selection only after deletion is complete
        setSelectedIds([])
        setShowDeleteModal(false)
    }

    // Cancel bulk delete
    const cancelBulkDelete = () => {
        setShowDeleteModal(false)
    }

    const isAllSelected = records.length > 0 && selectedIds.length === records.length

    const formatDetailValue = (value, fieldKey) => {
        if (value === null || value === undefined || value === '') return 'N/A'
        if (dateFields.includes(fieldKey) && value) {
            try {
                return formatDate(value)
            } catch {
                return value
            }
        }
        if (typeof value === 'boolean' || ['true', 'false', '1', '0'].includes(String(value))) {
            return formatBoolean(value)
        }
        return String(value)
    }

    const buildDetailGroups = (record) => {
        const groups = [
            {
                title: 'ព័ត៌មានបុគ្គល',
                items: [
                    { key: 'systemId', label: 'លេខសម្គាល់ប្រព័ន្ធ (System ID)', value: record.systemId },
                    { key: 'uuic', label: 'UUIC', value: record.uuic },
                    { key: 'familyName', label: 'នាមខ្លួន', value: record.familyName },
                    { key: 'lastName', label: 'នាមត្រកូល', value: record.lastName },
                    { key: 'sex', label: 'ភេទ', value: record.sex },
                    { key: 'dateOfBirth', label: 'ថ្ងៃ ខែ ឆ្នាំកំណើត', value: record.dateOfBirth },
                    { key: 'age', label: 'អាយុ', value: record.age }
                ]
            },
            {
                title: 'ទីតាំង',
                items: [
                    { key: 'province', label: 'ខេត្ត', value: record.province },
                    { key: 'od', label: 'ស្រុកប្រតិបត្តិ', value: record.od },
                    { key: 'district', label: 'ស្រុក/ខណ្ឌ', value: record.district },
                    { key: 'commune', label: 'ឃុំ/សង្កាត់', value: record.commune },
                    { key: 'donor', label: 'ម្ចាស់ជំនួយ', value: record.donor },
                    { key: 'ngo', label: 'អង្គការ', value: record.ngo }
                ]
            },
            {
                title: 'ទិន្នន័យផ្លូវភេទ',
                items: [
                    { key: 'sexAtBirth', label: FORM_FIELD_LABELS_KH.sexAtBirth || 'Sex at Birth', value: record.sexAtBirth },
                    { key: 'genderIdentity', label: FORM_FIELD_LABELS_KH.genderIdentity || 'Gender Identity', value: record.genderIdentity },
                    { key: 'sexualHealthConcerns', label: FORM_FIELD_LABELS_KH.sexualHealthConcerns || 'Sexual Health Concerns', value: record.sexualHealthConcerns },
                    { key: 'hadSexPast6Months', label: FORM_FIELD_LABELS_KH.hadSexPast6Months || 'Had Sex Past 6 Months', value: record.hadSexPast6Months },
                    { key: 'partnerMale', label: FORM_FIELD_LABELS_KH.partnerMale || 'Partner Male', value: record.partnerMale },
                    { key: 'partnerFemale', label: FORM_FIELD_LABELS_KH.partnerFemale || 'Partner Female', value: record.partnerFemale },
                    { key: 'partnerTGW', label: FORM_FIELD_LABELS_KH.partnerTGW || 'Partner TGW', value: record.partnerTGW },
                    { key: 'partnerTGM', label: FORM_FIELD_LABELS_KH.partnerTGM || 'Partner TGM', value: record.partnerTGM },
                    { key: 'numberOfSexualPartners', label: FORM_FIELD_LABELS_KH.numberOfSexualPartners || 'Number of Sexual Partners', value: record.numberOfSexualPartners }
                ]
            },
            {
                title: 'អាកប្បកិរិយា',
                items: [
                    { key: 'past6MonthsPractices', label: FORM_FIELD_LABELS_KH.past6MonthsPractices || 'Practices in Past 6 Months', value: record.past6MonthsPractices },
                    { key: 'receiveMoneyForSex', label: FORM_FIELD_LABELS_KH.receiveMoneyForSex || 'Receive Money for Sex', value: record.receiveMoneyForSex },
                    { key: 'paidForSex', label: FORM_FIELD_LABELS_KH.paidForSex || 'Paid for Sex', value: record.paidForSex },
                    { key: 'sexWithHIVPartner', label: FORM_FIELD_LABELS_KH.sexWithHIVPartner || 'Sex with HIV Partner', value: record.sexWithHIVPartner },
                    { key: 'sexWithoutCondom', label: FORM_FIELD_LABELS_KH.sexWithoutCondom || 'Sex without Condom', value: record.sexWithoutCondom },
                    { key: 'stiSymptoms', label: FORM_FIELD_LABELS_KH.stiSymptoms || 'STI Symptoms', value: record.stiSymptoms },
                    { key: 'syphilisPositive', label: FORM_FIELD_LABELS_KH.syphilisPositive || 'Syphilis Positive', value: record.syphilisPositive },
                    { key: 'abortion', label: FORM_FIELD_LABELS_KH.abortion || 'Abortion', value: record.abortion },
                    { key: 'alcoholDrugBeforeSex', label: FORM_FIELD_LABELS_KH.alcoholDrugBeforeSex || 'Alcohol/Drug Before Sex', value: record.alcoholDrugBeforeSex },
                    { key: 'groupSexChemsex', label: FORM_FIELD_LABELS_KH.groupSexChemsex || 'Group Sex/Chemsex', value: record.groupSexChemsex },
                    { key: 'injectedDrugSharedNeedle', label: FORM_FIELD_LABELS_KH.injectedDrugSharedNeedle || 'Injected Drug/Shared Needle', value: record.injectedDrugSharedNeedle },
                    { key: 'noneOfAbove', label: FORM_FIELD_LABELS_KH.noneOfAbove || 'None of Above', value: record.noneOfAbove },
                    { key: 'forcedSex', label: FORM_FIELD_LABELS_KH.forcedSex || 'Forced Sex', value: record.forcedSex }
                ]
            },
            {
                title: 'PrEP និង HIV',
                items: [
                    { key: 'everOnPrep', label: FORM_FIELD_LABELS_KH.everOnPrep || 'Ever on PrEP', value: record.everOnPrep },
                    { key: 'currentlyOnPrep', label: FORM_FIELD_LABELS_KH.currentlyOnPrep || 'Currently on PrEP', value: record.currentlyOnPrep },
                    { key: 'hivTestPast6Months', label: FORM_FIELD_LABELS_KH.hivTestPast6Months || 'HIV Test Past 6 Months', value: record.hivTestPast6Months },
                    { key: 'lastHivTestDate', label: FORM_FIELD_LABELS_KH.lastHivTestDate || 'Last HIV Test Date', value: record.lastHivTestDate },
                    { key: 'hivTestResult', label: FORM_FIELD_LABELS_KH.hivTestResult || 'HIV Test Result', value: record.hivTestResult }
                ]
            },
            {
                title: 'វាយតម្លៃ',
                items: [
                    { key: 'eventDate', label: 'កាលបរិច្ឆេទ (ថ្ងៃ ខែ ឆ្នាំ)', value: record.eventDate },
                    { key: 'riskScreeningScore', label: FORM_FIELD_LABELS_KH.riskScreeningScore || 'Risk Screening Score', value: record.riskScreeningScore },
                    { key: 'riskScreeningResult', label: FORM_FIELD_LABELS_KH.riskScreeningResult || 'Risk Screening Result', value: record.riskScreeningResult }
                ]
            }
        ]

        // Filter out empty groups and items
        return groups
            .map(group => ({
                ...group,
                items: group.items.filter(item => item.value !== null && item.value !== undefined && item.value !== '')
            }))
            .filter(group => group.items.length > 0)
    }

    const renderExpandedContent = (record) => {
        const groups = buildDetailGroups(record)
        const editableFieldSet = editableFields instanceof Set ? editableFields : new Set(Array.isArray(editableFields) ? editableFields : [])

        return (
            <tr className="border-b border-slate-300">
                <td colSpan={8} className="p-0 bg-slate-50 border-r border-slate-300">
                    <div className="p-4 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {groups.map((group, groupIndex) => (
                                <div
                                    key={group.title}
                                    className="space-y-2 rounded-none border border-slate-300 bg-white p-3 shadow-sm"
                                >
                                    <div className="flex items-center justify-between border-b border-slate-300 bg-primary px-3 py-2.5 rounded-none">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-none bg-primary/10 text-[11px] font-semibold text-white">
                                                {String(groupIndex + 1).padStart(2, '0')}
                                            </span>
                                            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-white">
                                                {group.title}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="grid">
                                        {group.items.map(item => {
                                            const isEditing = editingCell?.recordId === record.id && editingCell?.fieldKey === item.key
                                            const isSaving = savingCell?.recordId === record.id && savingCell?.fieldKey === item.key
                                            const isEditable = editableFieldSet.has(item.key)

                                            const options = fieldOptions[item.key] || []
                                            const hasOptions = options && options.length > 0
                                            const isDateField = dateFields.includes(item.key)
                                            const isNumberField = numberFields.includes(item.key)
                                            
                                            // Use Select if options available, otherwise use Input based on field type
                                            const useSelect = hasOptions && !isDateField && !isNumberField
                                            const inputType = isDateField ? 'date' : isNumberField ? 'number' : 'text'

                                            const editorClass = "h-7 w-[160px] rounded-none border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700 shadow-sm focus:border-primary focus:ring-0"
                                            const triggerClass = "h-7 w-[160px] rounded-none border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700 shadow-sm focus:border-primary focus:ring-0"

                                            return (
                                                <div
                                                    key={`${group.title}-${item.key}`}
                                                    className={`group grid grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)] items-center border-b border-slate-300 last:border-b-0 ${isEditable ? 'hover:bg-slate-50' : ''}`}
                                                >
                                                    <div className="border-r border-slate-300 bg-slate-50 px-3 py-2 text-[11px] font-medium text-slate-600 leading-snug">
                                                        {item.label}
                                                    </div>
                                                    <div className="relative px-3 py-2 text-[11px] text-slate-700 leading-snug">
                                                        {isEditing ? (
                                                            <div className="flex items-center gap-2">
                                                                {useSelect ? (
                                                                    <Select
                                                                        value={draftValue ? String(draftValue) : ''}
                                                                        onValueChange={(value) => setDraftValue(value)}
                                                                        disabled={isSaving}
                                                                    >
                                                                        <SelectTrigger className={triggerClass}>
                                                                            <SelectValue placeholder="ជ្រើសរើស" />
                                                                        </SelectTrigger>
                                                                        <SelectContent className="rounded-none border border-slate-300 bg-white text-[12px] shadow-md max-h-[200px] overflow-y-auto z-[100]">
                                                                            {options.map(option => (
                                                                                <SelectItem
                                                                                    key={String(option.value)}
                                                                                    value={String(option.value)}
                                                                                    className="px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50 focus:bg-slate-50 cursor-pointer"
                                                                                >
                                                                                    {option.label || String(option.value)}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                ) : (
                                                                    <Input
                                                                        type={inputType}
                                                                        value={draftValue}
                                                                        onChange={(e) => setDraftValue(e.target.value)}
                                                                        className={editorClass}
                                                                        autoFocus
                                                                        disabled={isSaving}
                                                                        placeholder={isDateField ? 'YYYY-MM-DD' : isNumberField ? '0' : ''}
                                                                    />
                                                                )}
                                                                <Button
                                                                    onClick={() => handleSaveEditing(record, item.key)}
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    disabled={isSaving}
                                                                    className="h-7 w-7 rounded-none border border-slate-300 text-primary hover:bg-primary/10"
                                                                >
                                                                    {isSaving ? (
                                                                        <div className="h-3.5 w-3.5 animate-spin rounded-none border border-primary border-t-transparent" />
                                                                    ) : (
                                                                        <FiCheck className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    onClick={handleCancelEditing}
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    disabled={isSaving}
                                                                    className="h-7 w-7 rounded-none border border-slate-300 text-slate-500 hover:bg-slate-100"
                                                                >
                                                                    <FiX className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-between">
                                                                <span>{formatDetailValue(item.value, item.key)}</span>
                                                                {isEditable && (
                                                                    <Button
                                                                        onClick={() => handleStartEditing(record, item.key, item.value)}
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="invisible h-6 w-6 shrink-0 rounded-none text-slate-400 group-hover:visible hover:bg-slate-100"
                                                                    >
                                                                        <FiEdit2 className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {inlineError && editingCell?.recordId === record.id && (
                                        <div className="mt-2 px-3 text-[11px] text-red-600">{inlineError}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </td>
            </tr>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between rounded-none">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-blue-900">
                            បានជ្រើសរើស {selectedIds.length} កំណត់ត្រា
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
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-none animate-spin mr-2" />
                                    កំពុងលុប...
                                </div>
                            ) : `លុបដែលបានជ្រើស (${selectedIds.length})`}
                        </Button>
                    </div>
                    <Button
                        onClick={() => setSelectedIds([])}
                        variant="ghost"
                        size="sm"
                        className="text-blue-700 hover:text-blue-800"
                    >
                        លុបជម្រើស
                    </Button>
                </div>
            )}

            {/* Removed: The BulkDeleteModal component is gone */}

            {loading ? (
                <div className="flex-1">
                    <div className="overflow-x-auto overflow-y-auto min-h-screen">
                        <table className="w-full border-collapse border border-slate-300">
                            <thead className="bg-primary border-b border-primary sticky top-0 z-10 rounded-none">
                                <tr>
                                    <th className="text-center py-4 px-6 font-semibold text-white text-sm rounded-none border-r border-slate-300">
                                        <div className="flex justify-center">
                                            <Checkbox 
                                                onCheckedChange={(checked) => handleSelectAll(checked)}
                                                checked={isAllSelected}
                                                disabled={records.length === 0}
                                            />
                                        </div>
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-white text-sm rounded-none border-r border-slate-300">ព័ត៌មានបុគ្គល</th>
                                    <th className="text-left py-4 px-6 font-semibold text-white text-sm rounded-none border-r border-slate-300">ភេទ និងអាយុ</th>
                                    <th className="text-left py-4 px-6 font-semibold text-white text-sm rounded-none border-r border-slate-300">ទីតាំង</th>
                                    <th className="text-left py-4 px-6 font-semibold text-white text-sm rounded-none border-r border-slate-300">វាយតម្លៃកម្រិតហានិភ័យ</th>
                                    <th className="text-left py-4 px-6 font-semibold text-white text-sm rounded-none border-r border-slate-300">ទិន្នន័យគ្លីនិក</th>
                                    <th className="text-left py-4 px-6 font-semibold text-white text-sm rounded-none border-r border-slate-300">កាលបរិច្ឆេទវាយតម្លៃ</th>
                                    <th className="text-left py-4 px-6 font-semibold text-white text-sm rounded-none">សកម្មភាព</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(20)].map((_, index) => (
                                    <tr key={index} className="animate-pulse border-b border-slate-300">
                                        <td className="py-4 px-6 border-r border-slate-300">
                                            <div className="flex justify-center">
                                                <div className="h-4 w-4 bg-gray-200 rounded-none"></div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 border-r border-slate-300">
                                            <div className="space-y-3">
                                                <div className="h-4 bg-gray-200 rounded-none w-24"></div>
                                                <div className="h-3 bg-gray-100 rounded-none w-20"></div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 border-r border-slate-300">
                                            <div className="space-y-3">
                                                <div className="h-4 bg-gray-200 rounded-none w-28"></div>
                                                <div className="h-3 bg-gray-100 rounded-none w-16"></div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 border-r border-slate-300">
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gray-200 rounded-none w-20"></div>
                                                <div className="h-3 bg-gray-100 rounded-none w-16"></div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 border-r border-slate-300">
                                            <div className="h-6 bg-gray-200 rounded-none w-20"></div>
                                        </td>
                                        <td className="py-4 px-6 border-r border-slate-300">
                                            <div className="space-y-2">
                                                <div className="h-3 bg-gray-200 rounded-none w-16"></div>
                                                <div className="h-3 bg-gray-200 rounded-none w-20"></div>
                                                <div className="h-3 bg-gray-200 rounded-none w-14"></div>
                                                <div className="h-3 bg-gray-200 rounded-none w-12"></div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 border-r border-slate-300">
                                            <div className="h-4 bg-gray-200 rounded-none w-24"></div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-1">
                                                <div className="h-8 w-8 bg-gray-200 rounded-none"></div>
                                                <div className="h-8 w-8 bg-gray-200 rounded-none"></div>
                                                <div className="h-8 w-8 bg-gray-200 rounded-none"></div>
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
                        <div className="w-20 h-20 bg-gray-100 rounded-none flex items-center justify-center mx-auto mb-6">
                            <span className="w-10 h-10 text-gray-400">📄</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">មិនមានកំណត់ត្រា</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            គ្មានកំណត់ត្រាវាយតម្លៃដែលត្រូវនឹងតម្រង់របស់អ្នក។ សូមព្យាយាមកែប្រែអង្គការ, 
                            ការជ្រើសរើសរយៈពេល, ឬលក្ខណៈវិនិច្ឆ័យស្វែងរក។
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex-1">
                    <div className="overflow-x-auto overflow-y-auto min-h-screen">
                        <table className="w-full border-collapse border border-slate-300">
                            <thead className="bg-primary border-b border-primary sticky top-0 z-10 rounded-none">
                                <tr>
                                    <th className="text-center py-4 px-6 font-semibold text-white text-sm rounded-none border-r border-slate-300">
                                        <div className="flex justify-center">
                                            <Checkbox 
                                                onCheckedChange={(checked) => handleSelectAll(checked)}
                                                checked={isAllSelected}
                                                disabled={records.length === 0}
                                            />
                                        </div>
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-white text-sm rounded-none border-r border-slate-300">ព័ត៌មានបុគ្គល</th>
                                    <th className="text-left py-4 px-6 font-semibold text-white text-sm rounded-none border-r border-slate-300">ភេទ និងអាយុ</th>
                                    <th className="text-left py-4 px-6 font-semibold text-white text-sm rounded-none border-r border-slate-300">ទីតាំង</th>
                                    <th className="text-left py-4 px-6 font-semibold text-white text-sm rounded-none border-r border-slate-300">វាយតម្លៃកម្រិតហានិភ័យ</th>
                                    <th className="text-left py-4 px-6 font-semibold text-white text-sm rounded-none border-r border-slate-300">ទិន្នន័យគ្លីនិក</th>
                                    <th className="text-left py-4 px-6 font-semibold text-white text-sm rounded-none border-r border-slate-300">កាលបរិច្ឆេទវាយតម្លៃ</th>
                                    <th className="text-left py-4 px-6 font-semibold text-white text-sm rounded-none">សកម្មភាព</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((record, index) => {
                                    const isExpanded = expandedRows.has(record.id)
                                    return (
                                        <React.Fragment key={record.id || `record-${index}`}>
                                            <tr className="hover:bg-gray-50/70 transition-colors duration-150 border-b border-slate-300">
                                                <td className="py-4 px-6 border-r border-slate-300">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button
                                                            onClick={() => toggleExpand(record.id)}
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-none"
                                                        >
                                                            {isExpanded ? (
                                                                <FiChevronDown className="h-4 w-4" />
                                                            ) : (
                                                                <FiChevronRight className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <Checkbox 
                                                            onCheckedChange={(checked) => handleSelectRecord(record.id, checked)}
                                                            checked={selectedIds.includes(record.id)}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 border-r border-slate-300">
                                            <div className="space-y-1">
                                                <div className="font-semibold text-gray-900 text-sm">
                                                    {record.systemId || 'មិនមានលេខសម្គាល់'}
                                                </div>
                                                <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded-none inline-block">
                                                    {record.uuic || 'មិនមាន UUIC'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 border-r border-slate-300">
                                            <div className="space-y-1">
                                                <div className="font-medium text-gray-900 text-sm">
                                                    {[record.familyName, record.lastName].filter(Boolean).join(' ') || 'មិនមានឈ្មោះ'}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge 
                                                        variant="secondary" 
                                                        className="text-xs bg-slate-100 text-slate-700 border-slate-200 rounded-none"
                                                    >
                                                        {record.sex || 'មិនស្គាល់'}
                                                    </Badge>
                                                    {record.age && (
                                                        <span className="text-xs text-gray-500">
                                                            អាយុ {record.age}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 border-r border-slate-300">
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {record.province || 'មិនស្គាល់ខេត្ត'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {record.district || 'មិនស្គាល់ស្រុក'}
                                                </div>
                                                {record.commune && (
                                                    <div className="text-xs text-gray-400">
                                                        {record.commune}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 border-r border-slate-300">
                                            <div className="space-y-2">
                                                <Badge 
                                                    variant="outline" 
                                                    className={`font-medium border-slate-200 text-slate-700 rounded-none`}
                                                >
                                                    {record.riskScreeningResult || record.riskLevel || 'មិនស្គាល់កម្រិតហានិភ័យ'}
                                                </Badge>
                                                {record.riskScreeningScore && (
                                                    <div className="text-xs text-gray-500">
                                                        ពិន្ទុ: {record.riskScreeningScore}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 border-r border-slate-300">
                                            <div className="space-y-1">
                                                <div className="text-xs text-gray-600">
                                                    <span className="font-medium">អត្តសញ្ញាណភេទ:</span> {record.genderIdentity || 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    <span className="font-medium">រួមភេទ:</span> {record.hadSexPast6Months === 'true' ? 'បាទ/ចាស' : record.hadSexPast6Months === 'false' ? 'ទេ' : 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    <span className="font-medium">ដៃគូ:</span> {record.numberOfSexualPartners || 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    <span className="font-medium">តេស្ត HIV:</span> {record.hivTestPast6Months === 'true' ? 'បាទ/ចាស' : record.hivTestPast6Months === 'false' ? 'ទេ' : 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 border-r border-slate-300">
                                            <div className="text-sm text-gray-700 font-medium">
                                                {formatDate(record.eventDate)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-1">
                                                <Tooltip content="មើលព័ត៌មានលម្អិត" position="top">
                                                    <Button
                                                        onClick={() => onView && onView(record)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-none"
                                                    >
                                                        <FiEye className="w-4 h-4" />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content="កែប្រែកំណត់ត្រា" position="top">
                                                    <Button
                                                        onClick={() => onEdit && onEdit(record)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-none"
                                                    >
                                                        <FiEdit className="w-4 h-4" />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content="លុបកំណត់ត្រា" position="top">
                                                    <Button
                                                        onClick={() => onDelete && onDelete(record)}
                                                        variant="ghost"
                                                        size="icon"
                                                        disabled={deletingId === record.id}
                                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 rounded-none"
                                                    >
                                                        {deletingId === record.id ? (
                                                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-none animate-spin" />
                                                        ) : (
                                                            <FiTrash2 className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        </td>
                                            </tr>
                                            {isExpanded && renderExpandedContent(record)}
                                        </React.Fragment>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Bulk Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={cancelBulkDelete}
                title="ផ្ទៀងផ្ទាត់ការលុប"
                size="md"
                showCloseButton={true}
                closeOnBackdrop={true}
            >
                <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-red-100 rounded-none flex items-center justify-center">
                                <FiAlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                តើអ្នកប្រាកដថាចង់លុបកំណត់ត្រាទាំងនេះទេ?
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                                អ្នកកំពុងព្យាយាមលុប <strong className="text-gray-900">{selectedIds.length}</strong> កំណត់ត្រា។
                            </p>
                            <p className="text-sm text-red-600 font-medium">
                                សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយបានទេ។
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                        <Button
                            variant="outline"
                            onClick={cancelBulkDelete}
                            disabled={bulkDeleting}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            បោះបង់
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmBulkDelete}
                            disabled={bulkDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {bulkDeleting ? (
                                <div className="flex items-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-none animate-spin mr-2" />
                                    កំពុងលុប...
                                </div>
                            ) : (
                                'លុប'
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Table