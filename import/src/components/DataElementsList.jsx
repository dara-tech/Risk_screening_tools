import React, { useState, useEffect, useMemo } from 'react'
import { useDataEngine } from '@dhis2/app-runtime'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useToast } from './ui/ui/toast'
import { programStageDataElements, fetchAndUpdateProgramStageData } from '../lib/programStageData'
import { Search, Copy, Check, Filter, Download, RefreshCw, Info, ArrowUpDown } from 'lucide-react'

const DataElementsList = () => {
    const engine = useDataEngine()
    const { showToast } = useToast()
    const [dataElements, setDataElements] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterValueType, setFilterValueType] = useState('all')
    const [sortBy, setSortBy] = useState('programOrder') // 'programOrder', 'name', 'id', 'valueType', 'formName'
    const [sortDirection, setSortDirection] = useState('asc') // 'asc', 'desc'
    const [copiedId, setCopiedId] = useState(null)
    const [optionSets, setOptionSets] = useState({})
    const [optionSetOptions, setOptionSetOptions] = useState({})
    const [detailedElements, setDetailedElements] = useState({})

    useEffect(() => {
        loadDataElements()
    }, [])

    const loadDataElements = async () => {
        setLoading(true)
        try {
            // Import config for formName mapping fallback
            const { default: config } = await import('../lib/config')
            
            // Create reverse mapping: dataElementId -> formName from config
            const formNameMap = {}
            Object.entries(config.mapping.programStageDataElements).forEach(([formName, dataElementId]) => {
                if (dataElementId && dataElementId.match(/^[a-zA-Z0-9]{11}$/)) {
                    formNameMap[dataElementId] = formName
                }
            })
            
            // Fetch from DHIS2
            const updatedElements = await fetchAndUpdateProgramStageData(engine)
            
            // Use updated elements or fallback to static data
            const elements = updatedElements.length > 0 
                ? updatedElements.map(item => {
                    // Find Khmer translation (locale: 'km', property: 'NAME')
                    const kmTranslation = (item.translations || item.dataElement?.translations || [])
                        .find(tr => tr.locale === 'km' && tr.property === 'NAME')
                    
                    const elementId = item.dataElement?.id || item.id
                    // Get formName from API response, or fallback to config mapping
                    const formName = item.dataElement?.formName || item.formName || formNameMap[elementId]
                    
                    return {
                        id: elementId,
                        name: item.dataElement?.name || item.name,
                        shortName: item.dataElement?.shortName || item.shortName,
                        valueType: item.dataElement?.valueType || item.valueType,
                        formName: formName, // Use API formName or config mapping
                        code: item.dataElement?.code || item.code,
                        translation: kmTranslation?.value || item.translations?.[0]?.value || item.dataElement?.translation
                    }
                })
                : programStageDataElements.map(item => ({
                    id: item.id,
                    name: item.name,
                    valueType: item.valueType,
                    formName: item.formName || formNameMap[item.id], // Use static formName or config mapping
                    translation: item.translations?.find(tr => tr.locale === 'km' && tr.property === 'NAME')?.value || item.translations?.[0]?.value
                }))

            setDataElements(elements)
            
            // Create option set map and fetch detailed info
            const optionSetMap = {}
            const optionSetOptionsMap = {}
            const detailedElementsMap = {}
            
            // Get all element IDs
            const elementIds = elements.map(e => e.id).filter(Boolean)
            
            // Map to store translations found during detailed fetch
            const translationUpdates = {}
            
            // Fetch detailed information for each element
            for (const elementId of elementIds) {
                try {
                    const detailResponse = await engine.query({
                        dataElement: {
                            resource: 'dataElements',
                            id: elementId,
                            params: {
                                fields: 'id,name,shortName,code,valueType,formName,description,aggregationType,domainType,displayFormName,zeroIsSignificant,url,dimensionItem,categoryCombo[id,name],optionSet[id,name,options[id,name,code]],translations[property,locale,value]'
                            }
                        }
                    })
                    
                    const de = detailResponse.dataElement
                    if (de) {
                        // Find Khmer translation
                        const kmTranslation = (de.translations || [])
                            .find(tr => tr.locale === 'km' && tr.property === 'NAME')
                        
                        // Store translation if found and element doesn't have one yet
                        if (kmTranslation?.value) {
                            const element = elements.find(el => el.id === elementId)
                            if (element && !element.translation) {
                                translationUpdates[elementId] = kmTranslation.value
                            }
                        }
                        
                        detailedElementsMap[elementId] = {
                            categoryCombo: de.categoryCombo,
                            aggregationType: de.aggregationType,
                            domainType: de.domainType,
                            displayFormName: de.displayFormName,
                            description: de.description,
                            zeroIsSignificant: de.zeroIsSignificant,
                            url: de.url,
                            dimensionItem: de.dimensionItem,
                            translation: kmTranslation?.value
                        }
                        
                        if (de.optionSet && de.optionSet.id) {
                            optionSetMap[elementId] = {
                                id: de.optionSet.id,
                                name: de.optionSet.name || 'Unnamed Option Set'
                            }
                            
                            // Get options from the response
                            if (de.optionSet.options && de.optionSet.options.length > 0) {
                                optionSetOptionsMap[elementId] = de.optionSet.options
                            }
                        }
                    }
                } catch (err) {
                    console.warn(`Failed to fetch details for ${elementId}:`, err)
                }
            }
            
            // Update elements with translations found during detailed fetch
            if (Object.keys(translationUpdates).length > 0) {
                const updatedElements = elements.map(el => {
                    if (translationUpdates[el.id]) {
                        return { ...el, translation: translationUpdates[el.id] }
                    }
                    return el
                })
                setDataElements(updatedElements)
            }
            
            setOptionSets(optionSetMap)
            setOptionSetOptions(optionSetOptionsMap)
            setDetailedElements(detailedElementsMap)
        } catch (error) {
            console.error('Error loading data elements:', error)
            showToast({
                title: 'Error',
                description: 'Failed to load data elements',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    // Create order map from programStageDataElements
    const programOrderMap = useMemo(() => {
        const orderMap = {}
        programStageDataElements.forEach((item, index) => {
            orderMap[item.id] = index
        })
        return orderMap
    }, [])

    const filteredAndSortedElements = useMemo(() => {
        // First filter - exclude specific elements
        let filtered = dataElements.filter(element => {
            // Exclude "11.Had test for HIV in past 6 months?"
            if (element.name?.includes('11.Had test for HIV in past 6 months?') || 
                element.id === 'upbKDAnhG8T') {
                return false
            }
            
            const matchesSearch = 
                element.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                element.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                element.formName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                element.translation?.toLowerCase().includes(searchTerm.toLowerCase())
            
            const matchesFilter = filterValueType === 'all' || element.valueType === filterValueType
            
            return matchesSearch && matchesFilter
        })

        // Then sort
        filtered = [...filtered].sort((a, b) => {
            let compareA, compareB

            switch (sortBy) {
                case 'programOrder':
                    // Sort by program stage order (if available), then by name
                    const orderA = programOrderMap[a.id] !== undefined ? programOrderMap[a.id] : 9999
                    const orderB = programOrderMap[b.id] !== undefined ? programOrderMap[b.id] : 9999
                    if (orderA !== orderB) {
                        return sortDirection === 'asc' ? orderA - orderB : orderB - orderA
                    }
                    // If same order, sort by name
                    compareA = (a.name || '').toLowerCase()
                    compareB = (b.name || '').toLowerCase()
                    break
                case 'name':
                    compareA = (a.name || '').toLowerCase()
                    compareB = (b.name || '').toLowerCase()
                    break
                case 'id':
                    compareA = (a.id || '').toLowerCase()
                    compareB = (b.id || '').toLowerCase()
                    break
                case 'valueType':
                    compareA = (a.valueType || '').toLowerCase()
                    compareB = (b.valueType || '').toLowerCase()
                    // If same value type, sort by name
                    if (compareA === compareB) {
                        compareA = (a.name || '').toLowerCase()
                        compareB = (b.name || '').toLowerCase()
                    }
                    break
                case 'formName':
                    compareA = (a.formName || '').toLowerCase()
                    compareB = (b.formName || '').toLowerCase()
                    // If same form name, sort by name
                    if (compareA === compareB) {
                        compareA = (a.name || '').toLowerCase()
                        compareB = (b.name || '').toLowerCase()
                    }
                    break
                default:
                    compareA = (a.name || '').toLowerCase()
                    compareB = (b.name || '').toLowerCase()
            }

            if (compareA < compareB) {
                return sortDirection === 'asc' ? -1 : 1
            }
            if (compareA > compareB) {
                return sortDirection === 'asc' ? 1 : -1
            }
            return 0
        })

        return filtered
    }, [dataElements, searchTerm, filterValueType, sortBy, sortDirection, programOrderMap])

    const valueTypes = useMemo(() => {
        const types = new Set(dataElements.map(de => de.valueType).filter(Boolean))
        return Array.from(types).sort()
    }, [dataElements])

    const copyToClipboard = (text, label = 'ID') => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(text)
            showToast({
                title: 'Copied!',
                description: `${label} copied to clipboard`,
            })
            setTimeout(() => setCopiedId(null), 2000)
        }).catch(err => {
            console.error('Failed to copy:', err)
            showToast({
                title: 'Error',
                description: 'Failed to copy to clipboard',
                variant: 'destructive'
            })
        })
    }


    const exportToCSV = () => {
        const headers = ['ID', 'Name', 'Form Name', 'Value Type', 'Short Name', 'Code', 'Khmer Translation']
        const rows = dataElements.map(de => [
            de.id || '',
            de.name || '',
            de.formName || '',
            de.valueType || '',
            de.shortName || '',
            de.code || '',
            de.translation || ''
        ])
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `data-elements-${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        showToast({
            title: 'Exported!',
            description: 'Data elements exported to CSV',
        })
    }

    const getValueTypeColor = (valueType) => {
        const colors = {
            'TEXT': 'bg-blue-100 text-blue-800',
            'BOOLEAN': 'bg-green-100 text-green-800',
            'TRUE_ONLY': 'bg-purple-100 text-purple-800',
            'NUMBER': 'bg-orange-100 text-orange-800',
            'DATE': 'bg-pink-100 text-pink-800',
            'DATETIME': 'bg-red-100 text-red-800',
            'LONG_TEXT': 'bg-yellow-100 text-yellow-800',
        }
        return colors[valueType] || 'bg-gray-100 text-gray-800'
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading data elements...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            📋 Data Elements List
                            <Badge variant="secondary">{dataElements.length} elements</Badge>
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={loadDataElements}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Refresh
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={exportToCSV}
                                className="flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Export CSV
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">

                    {/* Data Elements Table */}
                    <div className="overflow-x-auto max-h-[calc(100vh-250px)] overflow-y-auto border border-gray-300 rounded-lg shadow-sm">
                        <table className="w-full border-collapse bg-white text-sm">
                            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-10">
                                <tr>
                                    <th className="text-center py-2 px-3 font-semibold text-xs border-r border-blue-500 w-16">
                                        No
                                    </th>
                                    <th className="text-left py-2 px-4 font-semibold text-xs border-r border-blue-500">
                                        Question
                                    </th>
                                    <th className="text-left py-2 px-4 font-semibold text-xs">
                                        Answer Type / Options
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedElements.map((element, index) => {
                                    const hasOptions = optionSets[element.id]
                                    const options = optionSetOptions[element.id] || []
                                    
                                    // Extract number from element name
                                    const extractNumber = (name) => {
                                        if (!name) return '-'
                                        const match = name.match(/^(\d+(?:\.\d+)?)\./)
                                        return match ? match[1] : '-'
                                    }
                                    
                                    const elementNumber = extractNumber(element.name)
                                    
                                    return (
                                        <tr 
                                            key={element.id || index} 
                                            className={`border-b border-gray-200 transition-colors ${
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            } hover:bg-blue-50`}
                                        >
                                            {/* No Column */}
                                            <td className="py-2 px-3 text-center border-r border-gray-200">
                                                <span className="text-base font-bold text-blue-600">
                                                    {elementNumber}
                                                </span>
                                            </td>
                                            
                                            {/* Question Column */}
                                            <td className="py-2 px-4 border-r border-gray-200">
                                                <div className="space-y-1.5">
                                                    <div className="font-medium text-gray-900 text-sm leading-tight">
                                                        {element.name || 'Unnamed Element'}
                                                    </div>
                                                    {element.translation && (
                                                        <div className="text-sm text-gray-700 font-khmer leading-tight font-medium">
                                                            {element.translation}
                                                        </div>
                                                    )}
                                                    {element.formName && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <code className="text-xs font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                                                                {element.formName}
                                                            </code>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            
                                            {/* Answer Column */}
                                            <td className="py-2 px-4">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={`${getValueTypeColor(element.valueType)} text-xs`}>
                                                            {element.valueType}
                                                        </Badge>
                                                    </div>
                                                    
                                                    {/* Options */}
                                                    {options.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {options.slice(0, 6).map((option, optIndex) => (
                                                                <span 
                                                                    key={option.id || optIndex}
                                                                    className="text-xs bg-white border border-gray-200 rounded px-2 py-0.5"
                                                                >
                                                                    {option.name || option.code}
                                                                </span>
                                                            ))}
                                                            {options.length > 6 && (
                                                                <span className="text-xs text-gray-500 px-2">
                                                                    +{options.length - 6}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">-</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filteredAndSortedElements.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <p>No data elements found matching your search.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default DataElementsList

