import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useDataEngine } from '@dhis2/app-runtime'
import { useNavigate } from 'react-router-dom'

import { useToast } from '../components/ui/ui/toast'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import config from '../lib/config'
import { fetchProgramStageDataElementsWithOptions, FORM_FIELD_LABELS } from '../lib/dhis2FormData'
import Filters from '../components/records-list/Filters'
import HeaderBar from '../components/records-list/HeaderBar'
import Pagination from '../components/records-list/Pagination'
import Table from '../components/records-list/Table'
import ConnectionStatus from '../components/ConnectionStatus'

const RecordsList = () => {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedOrgUnit, setSelectedOrgUnit] = useState('')
    const [selectedPeriodType, setSelectedPeriodType] = useState('')
    const [selectedPeriod, setSelectedPeriod] = useState('')
    const [selectedYear, setSelectedYear] = useState('')
    const [selectedQuarter, setSelectedQuarter] = useState(null)
    const [selectedMonth, setSelectedMonth] = useState(null)
    const [showYearPicker, setShowYearPicker] = useState(false)
    const [showQuarterPicker, setShowQuarterPicker] = useState(false)
    const [showMonthPicker, setShowMonthPicker] = useState(false)
    const [orgUnits, setOrgUnits] = useState([])
    
    // Pagination state - reduced page size for better performance
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRecords, setTotalRecords] = useState(0)
    
    // Option sets for mapping option codes to display names
    const [dataElementOptionsById, setDataElementOptionsById] = useState({})
    const [provinceOptions, setProvinceOptions] = useState([])
    
    // Enhanced cache for API responses using refs to prevent dependency issues
    const cacheRef = useRef(new Map())
    const lastCacheTimeRef = useRef(0)
    const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes (increased from 5)

    
    const engine = useDataEngine()
    const navigate = useNavigate()
    const { showToast } = useToast()
    const latestPageRequestedRef = useRef(0)

    // Close pickers when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.picker-container')) {
                setShowYearPicker(false)
                setShowQuarterPicker(false)
                setShowMonthPicker(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Load option sets on mount
    useEffect(() => {
        const loadOptionSets = async () => {
            try {
                const { dataElementOptions } = await fetchProgramStageDataElementsWithOptions(engine, config.program.stageId)
                setDataElementOptionsById(dataElementOptions || {})
                
                // Fetch province option set if it exists
                try {
                    const provinceAttrId = config.mapping.trackedEntityAttributes.Province
                    const provinceResponse = await engine.query({
                        trackedEntityAttribute: {
                            resource: `trackedEntityAttributes/${provinceAttrId}`,
                            params: {
                                fields: 'id,name,valueType,optionSet[id,name,options[id,name,code]]'
                            }
                        }
                    })
                    
                    const attr = provinceResponse.trackedEntityAttribute
                    if (attr?.optionSet?.options && attr.optionSet.options.length > 0) {
                        setProvinceOptions(attr.optionSet.options.map(opt => ({
                            value: opt.code || opt.name,
                            label: opt.name
                        })))
                    }
                } catch (error) {
                    // Province may not have an option set, that's okay
                }
            } catch (error) {
            }
        }
        loadOptionSets()
    }, [engine])

    // Load data on mount
    useEffect(() => {
        fetchOrgUnits()
    }, [])


    // Reset period selections when period type changes
    useEffect(() => {
        setSelectedPeriod('')
        setSelectedQuarter(null)
        setSelectedMonth(null)
        setShowYearPicker(false)
        setShowQuarterPicker(false)
        setShowMonthPicker(false)
    }, [selectedPeriodType])

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [selectedPeriodType, selectedPeriod])

    const fetchOrgUnits = useCallback(async () => {
        try {
            const ousResp = await engine.query({
                ous: {
                    resource: 'organisationUnits',
                    params: {
                        withinUserHierarchy: true,
                        paging: false,
                        fields: 'id,displayName,level'
                    }
                }
            })
            const orgUnitsList = ousResp?.ous?.organisationUnits || []
            // Filter to show only level 4
            const filteredOrgUnits = orgUnitsList.filter(ou => ou.level === 4)
            setOrgUnits(filteredOrgUnits)
            
            // Don't auto-select first organization - let user choose
            // if (filteredOrgUnits.length > 0) {
            //     setSelectedOrgUnit(filteredOrgUnits[0].id)
            // }
        } catch (error) {
            showToast({
                title: 'Error',
                description: 'Failed to load organization units',
                variant: 'error'
            })
        }
    }, [engine, showToast])


    const fetchRecords = useCallback(async () => {
        if (!selectedOrgUnit || !selectedPeriod) {
            return
        }

        // Check cache first
        const cacheKey = `${selectedOrgUnit}-${selectedPeriod}-${currentPage}-${pageSize}`
        const now = Date.now()
        
        if (cacheRef.current.has(cacheKey) && (now - lastCacheTimeRef.current) < CACHE_DURATION) {
            const cachedData = cacheRef.current.get(cacheKey)
            setRecords(cachedData.records)
            setTotalRecords(cachedData.totalRecords)
            setTotalPages(cachedData.totalPages)
            setLoading(false)
            return
        }

        setLoading(true)
        const startTime = performance.now()
        
        try {
            const requestedPage = currentPage
            latestPageRequestedRef.current = requestedPage
            
            // Convert period to start and end dates
            let startDate, endDate
            if (selectedPeriodType === 'yearly') {
                startDate = `${selectedPeriod}-01-01`
                endDate = `${selectedPeriod}-12-31`
            } else if (selectedPeriodType === 'quarterly') {
                const [year, quarter] = selectedPeriod.split('Q')
                const quarterNum = parseInt(quarter)
                const quarterStartMonth = (quarterNum - 1) * 3 + 1
                const quarterEndMonth = quarterNum * 3
                startDate = `${year}-${quarterStartMonth.toString().padStart(2, '0')}-01`
                const lastDay = new Date(parseInt(year), quarterEndMonth, 0).getDate()
                endDate = `${year}-${quarterEndMonth.toString().padStart(2, '0')}-${lastDay}`
            } else if (selectedPeriodType === 'monthly') {
                const year = selectedPeriod.substring(0, 4)
                const month = selectedPeriod.substring(4, 6)
                startDate = `${year}-${month}-01`
                const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate()
                endDate = `${year}-${month}-${lastDay}`
            }

            // Optimized field selection - only fetch what we need
            const eventFields = [
                'event', 'eventDate', 'orgUnit', 'trackedEntityInstance', 'enrollment',
                // Only specific data elements we actually use
                'dataValues[dataElement,value]'
            ].join(',')

            const teiFields = [
                'trackedEntityInstance',
                'attributes[attribute,value]'
            ].join(',')

            // First, fetch events
            const eventsResponse = await engine.query({
                events: {
                    resource: 'events',
                    params: {
                        program: 'gmO3xUubvMb',
                        programStage: 'hqJKFmOU6s7',
                        orgUnit: selectedOrgUnit,
                        startDate: startDate,
                        endDate: endDate,
                        fields: eventFields,
                        page: currentPage,
                        pageSize: pageSize,
                        paging: true,
                        totalPages: true
                    }
                }
            })

            const events = eventsResponse?.events?.events || []
            
            // Early return if no events found
            if (events.length === 0) {
                setRecords([])
                setTotalRecords(0)
                setTotalPages(1)
                setLoading(false)
                return
            }
            
            // Only fetch TEIs for the events we actually have - optimized batching
            let trackedEntities = []
            if (events.length > 0) {
                const trackedEntityIds = [...new Set(events.map(event => event.trackedEntityInstance).filter(Boolean))]
                
                if (trackedEntityIds.length > 0) {
                    // Batch TEI requests for better performance (max 50 per request)
                    const batchSize = 50
                    const batches = []
                    
                    for (let i = 0; i < trackedEntityIds.length; i += batchSize) {
                        const batch = trackedEntityIds.slice(i, i + batchSize)
                        batches.push(
                            engine.query({
                                trackedEntityInstances: {
                                    resource: 'trackedEntityInstances',
                                    params: {
                                        trackedEntityType: 'MCPQUTHX1Ze',
                                        trackedEntityInstance: batch.join(';'),
                                        fields: teiFields,
                                        paging: false
                                    }
                                }
                            })
                        )
                    }
                    
                    // Execute all batches in parallel
                    const batchResults = await Promise.all(batches)
                    trackedEntities = batchResults.flatMap(result => 
                        result?.trackedEntityInstances?.trackedEntityInstances || []
                    )
                }
            }
            
            // Create lookup map for faster TEI matching
            const teiMap = new Map()
            trackedEntities.forEach(tei => {
                teiMap.set(tei.trackedEntityInstance, tei.attributes || [])
            })
            
            // Pre-compute reverse mappings and attribute lookups for better performance
            const valueMappings = config.mapping.valueMappings || {}
            const reverseMappings = Object.fromEntries(
                Object.entries(valueMappings).map(([key, mapping]) => [
                    key, 
                    Object.fromEntries(Object.entries(mapping).map(([k, v]) => [v, k]))
                ])
            )
            
            // Create attribute mapping for faster lookups
            const attrMapping = config.mapping.trackedEntityAttributes
            const dataElementMapping = config.mapping.programStageDataElements

            // Optimized data processing
            const processedRecords = events.map(event => {
                const dataValues = event.dataValues || []
                
                // Use Map lookup instead of find() for O(1) performance
                const attributes = teiMap.get(event.trackedEntityInstance) || []
                
                // Removed excessive logging for better performance
                
                const record = {
                    id: event.event,
                    eventDate: event.eventDate,
                    orgUnit: event.orgUnit,
                    trackedEntityInstance: event.trackedEntityInstance,
                    enrollment: event.enrollment,
                    // Extract data values
                    systemId: '',
                    uuic: '',
                    familyName: '',
                    lastName: '',
                    sex: '',
                    dateOfBirth: '',
                    age: '',
                    province: '',
                    od: '',
                    district: '',
                    commune: '',
                    genderIdentity: '',
                    sexualHealthConcerns: '',
                    partnerMale: '',
                    partnerFemale: '',
                    partnerTGW: '',
                    numberOfSexualPartners: '',
                    everOnPrep: '',
                    currentlyOnPrep: '',
                    riskScreeningResult: '',
                    riskScreeningScore: '',
                    riskScore: '',
                    riskLevel: '',
                    riskFactors: [],
                    recommendations: []
                }

                // Helper function to reverse map DHIS2 values to display values
                const reverseMapValue = (fieldName, dhValue) => {
                    if (!dhValue || dhValue === '') return ''
                    
                    // Handle boolean values
                    if (dhValue === true || dhValue === 'true') {
                        const reverseMapping = reverseMappings[fieldName]
                        return reverseMapping?.['true'] || reverseMapping?.[true] || 'Yes'
                    }
                    if (dhValue === false || dhValue === 'false') {
                        const reverseMapping = reverseMappings[fieldName]
                        return reverseMapping?.['false'] || reverseMapping?.[false] || 'No'
                    }
                    
                    const reverseMapping = reverseMappings[fieldName]
                    return reverseMapping?.[dhValue] || dhValue
                }

                // Map tracked entity attributes (personal information) - optimized with direct mapping
                attributes.forEach(attr => {
                    switch (attr.attribute) {
                        case attrMapping.System_ID: record.systemId = attr.value; break
                        case attrMapping.UUIC: record.uuic = attr.value; break
                        case attrMapping.Family_Name: record.familyName = attr.value; break
                        case attrMapping.Last_Name: record.lastName = attr.value; break
                        case attrMapping.Sex: record.sex = reverseMapValue('sex', attr.value); break
                        case attrMapping.DOB: record.dateOfBirth = attr.value; break
                        case attrMapping.Province: record.province = attr.value; break
                        case attrMapping.OD: record.od = attr.value; break
                        case attrMapping.District: record.district = attr.value; break
                        case attrMapping.Commune: record.commune = attr.value; break
                    }
                })

                // Calculate age from date of birth
                if (record.dateOfBirth) {
                    const today = new Date()
                    const birthDate = new Date(record.dateOfBirth)
                    let age = today.getFullYear() - birthDate.getFullYear()
                    const monthDiff = today.getMonth() - birthDate.getMonth()
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--
                    }
                    record.age = age.toString()
                }

                // Map data values to record fields using optimized switch statement
                dataValues.forEach(dv => {
                    if (!dv.value || dv.value === '') return // Skip empty values
                    
                    // Optimized data element mapping with switch for better performance
                    switch (dv.dataElement) {
                        case dataElementMapping.genderIdentity:
                            record.genderIdentity = reverseMapValue('genderIdentity', dv.value) || dv.value
                            break
                        case dataElementMapping.sexAtBirth:
                            record.sexAtBirth = reverseMapValue('sex', dv.value) || dv.value
                            // Only set sex if it's not already set from tracked entity attributes
                            if (!record.sex || record.sex === '') {
                                record.sex = reverseMapValue('sex', dv.value) || dv.value
                            }
                            break
                        case dataElementMapping.sexualHealthConcerns:
                            record.sexualHealthConcerns = reverseMapValue('sexualHealthConcerns', dv.value) || dv.value
                            break
                        case dataElementMapping.hadSexPast6Months:
                            record.hadSexPast6Months = reverseMapValue('hadSexPast6Months', dv.value) || dv.value
                            break
                        case dataElementMapping.partnerMale:
                            record.partnerMale = reverseMapValue('partnerMale', dv.value) || dv.value
                            break
                        case dataElementMapping.partnerFemale:
                            record.partnerFemale = reverseMapValue('partnerFemale', dv.value) || dv.value
                            break
                        case dataElementMapping.partnerTGW:
                            record.partnerTGW = reverseMapValue('partnerTGW', dv.value) || dv.value
                            break
                        case dataElementMapping.partnerTGM:
                            record.partnerTGM = reverseMapValue('partnerTGM', dv.value) || dv.value
                            break
                        case dataElementMapping.numberOfSexualPartners:
                            record.numberOfSexualPartners = dv.value
                            break
                        case dataElementMapping.sexWithoutCondom:
                            record.sexWithoutCondom = reverseMapValue('sexWithoutCondom', dv.value) || dv.value
                            break
                        case dataElementMapping.sexWithHIVPartner:
                            record.sexWithHIVPartner = reverseMapValue('sexWithHIVPartner', dv.value) || dv.value
                            break
                        case dataElementMapping.stiSymptoms:
                            record.stiSymptoms = reverseMapValue('stiSymptoms', dv.value) || dv.value
                            break
                        case dataElementMapping.syphilisPositive:
                            record.syphilisPositive = reverseMapValue('syphilisPositive', dv.value) || dv.value
                            break
                        case dataElementMapping.hivTestPast6Months:
                            record.hivTestPast6Months = reverseMapValue('hivTestPast6Months', dv.value) || dv.value
                            break
                        case dataElementMapping.hivTestResult:
                            record.hivTestResult = reverseMapValue('hivTestResult', dv.value) || dv.value
                            break
                        case dataElementMapping.lastHivTestDate:
                            record.lastHivTestDate = dv.value
                            break
                        case dataElementMapping.currentlyOnPrep:
                            // Handle special case where currentlyOnPrep might be stored as a number
                            let value = dv.value
                            
                            // Map numeric values to text values (Yes/No only)
                            if (value === '10' || value === 10) {
                                value = 'Yes' // Map 10 to Yes for PrEP
                            } else if (value === '0' || value === 0) {
                                value = 'No' // Map 0 to No for PrEP
                            }
                            
                            // Use reverse mapping to get display value
                            record.currentlyOnPrep = reverseMapValue('currentlyOnPrep', value) || value
                            break
                        case dataElementMapping.everOnPrep:
                            // everOnPrep is an option set - map numeric codes or option codes to display name
                            let displayValue = dv.value
                            const options = dataElementOptionsById[dataElementMapping.everOnPrep] || []
                            
                            // First try to map numeric codes (10=Yes, 11=No, 12=Never Know)
                            if (dv.value === '10' || dv.value === 10) {
                                displayValue = 'Yes'
                            } else if (dv.value === '11' || dv.value === 11) {
                                displayValue = 'No'
                            } else if (dv.value === '12' || dv.value === 12) {
                                displayValue = 'Never Know'
                            } else if (options.length > 0) {
                                // Find the option by code if not numeric
                                const option = options.find(o => o.code === String(dv.value) || o.code === dv.value)
                                if (option) {
                                    displayValue = option.name
                                }
                            }
                            
                            record.everOnPrep = reverseMapValue('everOnPrep', displayValue) || displayValue
                            break
                        case dataElementMapping.receiveMoneyForSex:
                            record.receiveMoneyForSex = reverseMapValue('receiveMoneyForSex', dv.value) || dv.value
                            break
                        case dataElementMapping.paidForSex:
                            record.paidForSex = reverseMapValue('paidForSex', dv.value) || dv.value
                            break
                        case dataElementMapping.injectedDrugSharedNeedle:
                            record.injectedDrugSharedNeedle = reverseMapValue('injectedDrugSharedNeedle', dv.value) || dv.value
                            break
                        case dataElementMapping.alcoholDrugBeforeSex:
                            record.alcoholDrugBeforeSex = reverseMapValue('alcoholDrugBeforeSex', dv.value) || dv.value
                            break
                        case dataElementMapping.groupSexChemsex:
                            record.groupSexChemsex = reverseMapValue('groupSexChemsex', dv.value) || dv.value
                            break
                        case dataElementMapping.abortion:
                            record.abortion = reverseMapValue('abortion', dv.value) || dv.value
                            break
                        case dataElementMapping.forcedSex:
                            record.forcedSex = reverseMapValue('forcedSex', dv.value) || dv.value
                            break
                        case dataElementMapping.noneOfAbove:
                            record.noneOfAbove = reverseMapValue('noneOfAbove', dv.value) || dv.value
                            break
                        case dataElementMapping.riskScreeningResult:
                            record.riskScreeningResult = dv.value
                            break
                        case dataElementMapping.riskScreeningScore:
                            record.riskScreeningScore = dv.value
                            break
                        case dataElementMapping.past6MonthsPractices:
                            record.past6MonthsPractices = dv.value
                            break
                    }
                })

                // Record processing complete
                
                return record
            })

            // Get pagination info from response (optimized - no additional API calls)
            const pagination = eventsResponse?.events?.pager || {}
            const totalRecordsFromAPI = pagination.total || processedRecords.length
            const totalPagesFromAPI = pagination.pageCount || Math.ceil(totalRecordsFromAPI / pageSize)
            
            // Performance monitoring
            const endTime = performance.now()
            const loadTime = Math.round(endTime - startTime)
            
            if (process.env.NODE_ENV === 'development') {
            }
            
            // Ignore stale responses if the user changed pages mid-flight
            if (requestedPage !== latestPageRequestedRef.current) {
                return
            }

            setRecords(processedRecords)
            setTotalRecords(totalRecordsFromAPI)
            setTotalPages(totalPagesFromAPI)
            
            // Enhanced caching with longer duration
            cacheRef.current.set(cacheKey, {
                records: processedRecords,
                totalRecords: totalRecordsFromAPI,
                totalPages: totalPagesFromAPI,
                timestamp: now
            })
            lastCacheTimeRef.current = now
            
            // Only show toast for manual refresh, not automatic loads
            if (process.env.NODE_ENV === 'development') {
            }
        } catch (error) {
            
            // Better error handling
            let errorMessage = 'Failed to load records'
            if (error.message?.includes('organisation unit must be specified')) {
                errorMessage = 'Please select an organization unit'
            } else if (error.message?.includes('404')) {
                errorMessage = 'Data not found. Please check your organization unit selection.'
            } else if (error.message?.includes('409')) {
                errorMessage = 'Conflict error. Please try refreshing the page.'
            } else if (error.message) {
                errorMessage = error.message
            }
            
            showToast({
                title: 'Error',
                description: errorMessage,
                variant: 'error'
            })
        } finally {
            setLoading(false)
        }
    }, [engine, selectedOrgUnit, selectedPeriodType, selectedPeriod, currentPage, pageSize, showToast, CACHE_DURATION])

    // Clear records and cache when filters change (optimized)
    useEffect(() => {
        setRecords([])
        setTotalRecords(0)
        setTotalPages(1)
        // Only clear cache for different org unit, keep period cache
        if (selectedOrgUnit) {
            const newCache = new Map()
            // Keep cache entries for other org units
            cacheRef.current.forEach((value, key) => {
                if (!key.startsWith(selectedOrgUnit)) {
                    newCache.set(key, value)
                }
            })
            cacheRef.current = newCache
        }
        lastCacheTimeRef.current = 0
    }, [selectedOrgUnit, selectedPeriod])

    // Clear period selections and cache when organization changes
    useEffect(() => {
        if (!selectedOrgUnit) {
            setSelectedPeriodType('')
            setSelectedPeriod('')
            setSelectedYear('')
            setSelectedQuarter(null)
            setSelectedMonth(null)
            cacheRef.current = new Map() // Clear cache when org unit changes
            lastCacheTimeRef.current = 0
        }
    }, [selectedOrgUnit])

    // Fetch records when pagination changes
    useEffect(() => {
        if (selectedOrgUnit && selectedPeriod && currentPage > 0) {
            fetchRecords()
        }
    }, [currentPage, fetchRecords])

    const getRiskLevelColor = (riskLevel) => {
        switch (riskLevel?.toLowerCase()) {
            case 'very high': return 'bg-red-100 text-red-800 border-red-200'
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'low': return 'bg-green-100 text-green-800 border-green-200'
            case 'very low': return 'bg-blue-100 text-blue-800 border-blue-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    // Pagination helper functions
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const goToFirstPage = () => goToPage(1)
    const goToLastPage = () => goToPage(totalPages)
    const goToNextPage = () => goToPage(currentPage + 1)
    const goToPreviousPage = () => goToPage(currentPage - 1)

    const handleRefresh = () => {
        // Clear cache when manually refreshing
        cacheRef.current = new Map()
        lastCacheTimeRef.current = 0
        setCurrentPage(1) // Reset to first page when manually loading
        
        // Show toast for manual refresh
        setTimeout(() => {
            fetchRecords().then(() => {
                showToast({
                    title: 'Refreshed',
                    description: 'Data has been refreshed successfully',
                    variant: 'default'
                })
            })
        }, 100)
    }

    // Picker handlers
    const handleYearSelect = (year) => {
        setSelectedYear(year)
        if (selectedPeriodType === 'yearly') {
            setSelectedPeriod(year.toString())
        } else if (selectedPeriodType === 'quarterly' && selectedQuarter) {
            setSelectedPeriod(`${year}Q${selectedQuarter}`)
        } else if (selectedPeriodType === 'monthly' && selectedMonth) {
            setSelectedPeriod(`${year}${selectedMonth.toString().padStart(2, '0')}`)
        }
    }

    const handleQuarterSelect = (quarter, yearOverride) => {
        const yearToUse = yearOverride ?? selectedYear ?? new Date().getFullYear()
        setSelectedYear(yearToUse)
        setSelectedQuarter(quarter)
        setSelectedPeriod(`${yearToUse}Q${quarter}`)
    }

    const handleMonthSelect = (month, yearOverride) => {
        const yearToUse = yearOverride ?? selectedYear ?? new Date().getFullYear()
        setSelectedYear(yearToUse)
        setSelectedMonth(month)
        setSelectedPeriod(`${yearToUse}${month.toString().padStart(2, '0')}`)
    }

    const getPeriodDisplay = () => {
        if (!selectedPeriodType) {
            return 'Select period type'
        }
        
        if (selectedPeriodType === 'yearly') {
            return selectedYear ? selectedYear.toString() : 'Select year'
        } else if (selectedPeriodType === 'quarterly') {
            return selectedQuarter ? `Q${selectedQuarter} ${selectedYear}` : 'Select quarter'
        } else if (selectedPeriodType === 'monthly') {
            if (selectedMonth) {
                const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleDateString('en-US', { month: 'long' })
                return `${monthName} ${selectedYear}`
            }
            return 'Select month'
        }
        return 'Select period'
    }

    // Period availability: from 2020 up to current year/quarter/month
    const today = new Date()
    const currentYearVal = today.getFullYear()
    const currentQuarterVal = Math.ceil((today.getMonth() + 1) / 3)
    const currentMonthVal = today.getMonth() + 1
    const MIN_YEAR = 2020

    const isYearAvailable = (year) => {
        return year >= MIN_YEAR && year <= currentYearVal
    }

    const getAvailableQuartersForYear = (year) => {
        if (year < MIN_YEAR) return []
        if (year < currentYearVal) return [1,2,3,4]
        if (year > currentYearVal) return []
        return [1,2,3,4].filter(q => q <= currentQuarterVal)
    }

    const getAvailableMonthsForYear = (year) => {
        if (year < MIN_YEAR) return []
        if (year < currentYearVal) return [1,2,3,4,5,6,7,8,9,10,11,12]
        if (year > currentYearVal) return []
        return Array.from({ length: currentMonthVal }, (_, i) => i + 1)
    }

    const getFilterPeriodDisplay = () => {
        if (!selectedPeriod) return 'All periods'
        
        if (selectedPeriodType === 'yearly') {
            return selectedPeriod
        } else if (selectedPeriodType === 'quarterly') {
            const [year, quarter] = selectedPeriod.split('Q')
            return `Q${quarter} ${year}`
        } else if (selectedPeriodType === 'monthly') {
            const year = selectedPeriod.substring(0, 4)
            const month = selectedPeriod.substring(4, 6)
            const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'long' })
            return `${monthName} ${year}`
        }
        return 'All periods'
    }




    // Delete an event record
    const [deletingId, setDeletingId] = useState(null)
    const [bulkDeleting, setBulkDeleting] = useState(false)
    
    // View and Edit handlers
    const handleViewRecord = (record) => {
        navigate('/risk-screening-tool', {
            state: {
                mode: 'view',
                recordData: record
            }
        })
    }
    
    const handleEditRecord = (record) => {
        navigate('/risk-screening-tool', {
            state: {
                mode: 'edit',
                recordData: record
            }
        })
    }
    
    const handleDeleteRecord = async (record) => {
        if (!record?.id) return
        const confirmDelete = window.confirm('Are you sure you want to delete this record?')
        if (!confirmDelete) return
        try {
            setDeletingId(record.id)
            await engine.mutate({
                type: 'delete',
                resource: `events/${record.id}`
            })
            
            // Clear cache to force fresh data fetch
            const cacheKey = `${selectedOrgUnit}-${selectedPeriod}-${currentPage}-${pageSize}`
            cacheRef.current.delete(cacheKey)
            lastCacheTimeRef.current = 0
            
            // Always refresh to get updated data from server
            // Wait for fetchRecords to complete
            try {
                await fetchRecords()
            } catch (fetchError) {
                // fetchRecords will handle its own error display
            }
            
        } catch (error) {
            alert('Failed to delete record')
        } finally {
            setDeletingId(null)
        }
    }

    const handleBulkDelete = async (selectedRecords) => {
        if (!selectedRecords || selectedRecords.length === 0) return
        
        try {
            setBulkDeleting(true)
            
            let successCount = 0
            let errorCount = 0
            const selectedIds = selectedRecords.map(record => record.id)
            
            // Delete records one by one to avoid overwhelming the API
            for (const record of selectedRecords) {
                try {
                    await engine.mutate({
                        type: 'delete',
                        resource: `events/${record.id}`
                    })
                    successCount++
                    
                    // Don't update local state immediately - let the refresh handle it
                    // This ensures consistency with server data
                    
                } catch (error) {
                    errorCount++
                }
            }
            
            // Handle pagination after bulk delete
            if (successCount > 0) {
                // Clear cache to force fresh data fetch
                const cacheKey = `${selectedOrgUnit}-${selectedPeriod}-${currentPage}-${pageSize}`
                cacheRef.current.delete(cacheKey)
                lastCacheTimeRef.current = 0
                
                // Always refresh to get updated data from server
                // Wait for fetchRecords to complete before resetting bulkDeleting
                try {
                    await fetchRecords()
                } catch (fetchError) {
                    // fetchRecords will handle its own error display
                }
            }
            
            // Show appropriate feedback
            if (errorCount === 0) {
                showToast({
                    title: 'Bulk Delete Successful',
                    description: `Successfully deleted ${successCount} record(s)`,
                    variant: 'default'
                })
            } else if (successCount === 0) {
                showToast({
                    title: 'Bulk Delete Failed',
                    description: `Failed to delete ${errorCount} record(s). Please try again.`,
                    variant: 'error'
                })
            } else {
                showToast({
                    title: 'Bulk Delete Partially Completed',
                    description: `Deleted ${successCount} record(s), ${errorCount} failed`,
                    variant: 'default'
                })
            }
            
        } catch (error) {
            showToast({
                title: 'Error',
                description: 'Bulk delete operation failed. Please try again.',
                variant: 'error'
            })
        } finally {
            setBulkDeleting(false)
        }
    }

    // Inline update handler - updates individual fields directly in DHIS2
    const handleInlineUpdate = useCallback(async (record, fieldKey, newValue) => {
        try {
            // Map field names to DHIS2 IDs
            const attributeFieldToId = {
                'systemId': config.mapping.trackedEntityAttributes.System_ID,
                'uuic': config.mapping.trackedEntityAttributes.UUIC,
                'familyName': config.mapping.trackedEntityAttributes.Family_Name,
                'lastName': config.mapping.trackedEntityAttributes.Last_Name,
                'sex': config.mapping.trackedEntityAttributes.Sex,
                'dateOfBirth': config.mapping.trackedEntityAttributes.DOB,
                'province': config.mapping.trackedEntityAttributes.Province, // Also available as data element
                'od': config.mapping.trackedEntityAttributes.OD,
                'district': config.mapping.trackedEntityAttributes.District,
                'commune': config.mapping.trackedEntityAttributes.Commune,
                'donor': config.mapping.trackedEntityAttributes.Donor,
                'ngo': config.mapping.trackedEntityAttributes.NGO
            }

            // Use data element IDs from config to ensure consistency
            const dataElementFieldToId = {
                'sexAtBirth': config.mapping.programStageDataElements.sexAtBirth,
                'genderIdentity': config.mapping.programStageDataElements.genderIdentity,
                'sexualHealthConcerns': config.mapping.programStageDataElements.sexualHealthConcerns,
                'hadSexPast6Months': config.mapping.programStageDataElements.hadSexPast6Months,
                'partnerMale': config.mapping.programStageDataElements.partnerMale,
                'partnerFemale': config.mapping.programStageDataElements.partnerFemale,
                'partnerTGW': config.mapping.programStageDataElements.partnerTGW,
                'partnerTGM': config.mapping.programStageDataElements.partnerTGM,
                'numberOfSexualPartners': config.mapping.programStageDataElements.numberOfSexualPartners,
                'past6MonthsPractices': config.mapping.programStageDataElements.past6MonthsPractices,
                'receiveMoneyForSex': config.mapping.programStageDataElements.receiveMoneyForSex,
                'paidForSex': config.mapping.programStageDataElements.paidForSex,
                'sexWithHIVPartner': config.mapping.programStageDataElements.sexWithHIVPartner,
                'sexWithoutCondom': config.mapping.programStageDataElements.sexWithoutCondom,
                'stiSymptoms': config.mapping.programStageDataElements.stiSymptoms,
                'syphilisPositive': config.mapping.programStageDataElements.syphilisPositive,
                'abortion': config.mapping.programStageDataElements.abortion,
                'alcoholDrugBeforeSex': config.mapping.programStageDataElements.alcoholDrugBeforeSex,
                'groupSexChemsex': config.mapping.programStageDataElements.groupSexChemsex,
                'injectedDrugSharedNeedle': config.mapping.programStageDataElements.injectedDrugSharedNeedle,
                'noneOfAbove': config.mapping.programStageDataElements.noneOfAbove,
                'forcedSex': config.mapping.programStageDataElements.forcedSex,
                'everOnPrep': config.mapping.programStageDataElements.everOnPrep,
                'currentlyOnPrep': config.mapping.programStageDataElements.currentlyOnPrep,
                'hivTestPast6Months': config.mapping.programStageDataElements.hivTestPast6Months,
                'lastHivTestDate': config.mapping.programStageDataElements.lastHivTestDate,
                'hivTestResult': config.mapping.programStageDataElements.hivTestResult,
                'riskScreeningResult': config.mapping.programStageDataElements.riskScreeningResult,
                'riskScreeningScore': config.mapping.programStageDataElements.riskScreeningScore
            }

            // Normalize value for DHIS2
            const normalizeValueForDhis = (value, fieldKey) => {
                if (value === null || value === undefined || value === '') return ''
                
                // Boolean fields
                const booleanFields = ['sexualHealthConcerns', 'hadSexPast6Months', 'partnerMale', 'partnerFemale', 'partnerTGW', 'partnerTGM',
                    'receiveMoneyForSex', 'paidForSex', 'sexWithHIVPartner', 'sexWithoutCondom', 'stiSymptoms', 
                    'syphilisPositive', 'abortion', 'alcoholDrugBeforeSex', 'groupSexChemsex', 'injectedDrugSharedNeedle', 
                    'noneOfAbove', 'forcedSex', 'everOnPrep', 'currentlyOnPrep', 'hivTestPast6Months']
                
                if (booleanFields.includes(fieldKey)) {
                    if (value === 'true' || value === true || value === '1' || value === 1 || value === 'Yes' || value === 'បាទ/ចាស') return 'true'
                    if (value === 'false' || value === false || value === '0' || value === 0 || value === 'No' || value === 'ទេ') return 'false'
                    return ''
                }

                // Date fields
                if (fieldKey === 'dateOfBirth' || fieldKey === 'lastHivTestDate' || fieldKey === 'eventDate') {
                    if (value instanceof Date) {
                        return value.toISOString().split('T')[0]
                    }
                    if (typeof value === 'string' && value.includes('-')) {
                        return value.split('T')[0]
                    }
                    return value
                }

                // Number fields
                if (fieldKey === 'numberOfSexualPartners' || fieldKey === 'riskScreeningScore' || fieldKey === 'age') {
                    return String(value || '0')
                }

                return String(value)
            }

            // Map display value to option code if needed
            const mapDisplayValueToOptionCode = (value, fieldKey) => {
                const dataElementId = dataElementFieldToId[fieldKey]
                if (!dataElementId || !dataElementOptionsById[dataElementId]) {
                    return value
                }
                const options = dataElementOptionsById[dataElementId]
                // Try multiple matching strategies
                const option = options.find(opt => 
                    opt.label === value || 
                    opt.value === value || 
                    opt.name === value ||
                    opt.code === value ||
                    (opt.label && opt.label.toLowerCase() === String(value).toLowerCase()) ||
                    (opt.name && opt.name.toLowerCase() === String(value).toLowerCase())
                )
                // Prefer code, then value, then name
                return option ? (option.code || option.value || option.name || value) : value
            }

            const normalizedValue = normalizeValueForDhis(newValue, fieldKey)

            // Check if this is a TEI attribute or a data element
            if (attributeFieldToId[fieldKey]) {
                // Update TEI attribute
                const attributeId = attributeFieldToId[fieldKey]
                await engine.mutate({
                    type: 'update',
                    resource: `trackedEntityInstances/${record.trackedEntityInstance}`,
                    data: {
                        attributes: [{
                            attribute: attributeId,
                            value: normalizedValue
                        }]
                    }
                })
            } else if (dataElementFieldToId[fieldKey] || fieldKey === 'eventDate') {
                // Update event data element or event date
                if (fieldKey === 'eventDate') {
                    // Update event date
                    await engine.mutate({
                        type: 'update',
                        resource: `events/${record.id}`,
                        data: {
                            eventDate: normalizedValue
                        }
                    })
                } else {
                    // Update data element - use PUT endpoint to update single value
                    const dataElementId = dataElementFieldToId[fieldKey]
                    const optionValue = mapDisplayValueToOptionCode(normalizedValue, fieldKey)
                    
                    // Fetch current event to get full data
                    const eventResponse = await engine.query({
                        event: {
                            resource: `events/${record.id}`,
                            params: {
                                fields: 'dataValues[dataElement,value],eventDate,status,orgUnit,program,programStage,trackedEntityInstance,enrollment'
                            }
                        }
                    })
                    
                    const event = eventResponse.event
                    const existingDataValues = event.dataValues || []
                    
                    // Update or add the data value
                    const updatedDataValues = [...existingDataValues.filter(dv => dv.dataElement !== dataElementId), {
                        dataElement: dataElementId,
                        value: optionValue
                    }]

                    // Submit full event update
                    await engine.mutate({
                        type: 'update',
                        resource: `events/${record.id}`,
                        data: {
                            ...event,
                            dataValues: updatedDataValues
                        }
                    })
                }
            } else {
                throw new Error(`Unknown field: ${fieldKey}`)
            }

            // Update local cache and refresh
            const cacheKey = `${selectedOrgUnit}-${selectedPeriod}-${currentPage}-${pageSize}`
            cacheRef.current.delete(cacheKey)
            
            // Refresh records
            setTimeout(() => {
                fetchRecords()
            }, 300)

            showToast({
                title: 'Updated',
                description: `${FORM_FIELD_LABELS[fieldKey] || fieldKey} updated successfully`,
                variant: 'success'
            })

        } catch (error) {
            showToast({
                title: 'Update Failed',
                description: error.message || 'Failed to update field',
                variant: 'error'
            })
            throw error
        }
    }, [engine, selectedOrgUnit, selectedPeriod, currentPage, pageSize, dataElementOptionsById, fetchRecords, showToast])

    // Editable fields configuration
    const editableFields = useMemo(() => new Set([
        // TEI Attributes
        'systemId', 'uuic', 'familyName', 'lastName', 'sex', 'dateOfBirth',
        'province', 'od', 'district', 'commune', 'donor', 'ngo',
        // Data Elements
        'sexAtBirth', 'genderIdentity', 'sexualHealthConcerns', 'hadSexPast6Months',
        'partnerMale', 'partnerFemale', 'partnerTGW', 'numberOfSexualPartners',
        'receiveMoneyForSex', 'paidForSex', 'sexWithHIVPartner', 'sexWithoutCondom',
        'stiSymptoms', 'syphilisPositive', 'abortion', 'alcoholDrugBeforeSex',
        'groupSexChemsex', 'injectedDrugSharedNeedle', 'noneOfAbove', 'forcedSex',
        'everOnPrep', 'currentlyOnPrep', 'hivTestPast6Months', 'lastHivTestDate',
        'hivTestResult', 'riskScreeningResult', 'riskScreeningScore', 'eventDate'
    ]), [])

    // Field options for select fields
    const fieldOptions = useMemo(() => {
        const options = {}
        
        // Boolean fields with Yes/No options in Khmer
        const booleanFieldsOptions = [
            { value: 'true', label: 'បាទ/ចាស' },
            { value: 'false', label: 'ទេ' }
        ]
        
        const booleanFields = [
            'sexualHealthConcerns', 'hadSexPast6Months', 'partnerMale', 'partnerFemale', 'partnerTGW',
            'receiveMoneyForSex', 'paidForSex', 'sexWithHIVPartner', 'sexWithoutCondom', 'stiSymptoms',
            'syphilisPositive', 'abortion', 'alcoholDrugBeforeSex', 'groupSexChemsex', 
            'injectedDrugSharedNeedle', 'noneOfAbove', 'forcedSex', 'currentlyOnPrep', 'hivTestPast6Months'
        ]
        
        booleanFields.forEach(field => {
            options[field] = booleanFieldsOptions
        })

        // Add options for each data element that has an option set
        Object.keys(dataElementOptionsById).forEach(dataElementId => {
            // Find the field key for this data element using config mapping
            const fieldKey = Object.keys(config.mapping.programStageDataElements).find(
                key => config.mapping.programStageDataElements[key] === dataElementId
            )
            if (fieldKey && dataElementOptionsById[dataElementId]) {
                options[fieldKey] = dataElementOptionsById[dataElementId].map(opt => ({
                    value: opt.value,
                    label: opt.label || opt.name || opt.value
                }))
            }
        })

        // Add special options
        options.sex = [
            { value: 'Male', label: 'ប្រុស' },
            { value: 'Female', label: 'ស្រី' },
            { value: 'Other', label: 'ផ្សេងៗ' }
        ]

        // Province options - use from option set if available, otherwise use defaults
        if (provinceOptions.length > 0) {
            options.province = provinceOptions
        } else {
            options.province = [
                { value: 'Phnom Penh', label: 'ភ្នំពេញ' },
                { value: 'Battambang', label: 'បាត់ដំបង' },
                { value: 'Siem Reap', label: 'សៀមរាប' },
                { value: 'Kandal', label: 'កណ្ដាល' },
                { value: 'Kampong Cham', label: 'កំពង់ចាម' }
            ]
        }

        // Ever on PrEP options (if not from option set)
        if (!options.everOnPrep) {
            options.everOnPrep = [
                { value: 'true', label: 'បាទ/ចាស' },
                { value: 'false', label: 'ទេ' },
                { value: '', label: 'មិនដឹង' }
            ]
        }

        return options
    }, [dataElementOptionsById, provinceOptions])

    // Date fields
    const dateFields = useMemo(() => [
        'dateOfBirth', 'lastHivTestDate', 'eventDate'
    ], [])

    // Number fields
    const numberFields = useMemo(() => [
        'numberOfSexualPartners', 'riskScreeningScore', 'age'
    ], [])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            
                {/* Connection Status */}
                <ConnectionStatus engine={engine} />
            
                <Filters
                    orgUnits={orgUnits}
                    selectedOrgUnit={selectedOrgUnit}
                    setSelectedOrgUnit={setSelectedOrgUnit}
                    selectedPeriodType={selectedPeriodType}
                    setSelectedPeriodType={setSelectedPeriodType}
                    selectedYear={selectedYear}
                    selectedQuarter={selectedQuarter}
                    selectedMonth={selectedMonth}
                    showYearPicker={showYearPicker}
                    showQuarterPicker={showQuarterPicker}
                    showMonthPicker={showMonthPicker}
                    selectedPeriod={selectedPeriod}
                    onYearSelect={handleYearSelect}
                    onQuarterSelect={handleQuarterSelect}
                    onMonthSelect={handleMonthSelect}
                    getPeriodDisplay={getPeriodDisplay}
                    onToggleYearPicker={() => { setShowYearPicker(!showYearPicker); setShowQuarterPicker(false); setShowMonthPicker(false) }}
                    onToggleQuarterPicker={() => { setShowQuarterPicker(!showQuarterPicker); setShowYearPicker(false); setShowMonthPicker(false) }}
                    onToggleMonthPicker={() => { setShowMonthPicker(!showMonthPicker); setShowYearPicker(false); setShowQuarterPicker(false) }}
                    onClosePickers={() => { setShowYearPicker(false); setShowQuarterPicker(false); setShowMonthPicker(false) }}
                    onRun={handleRefresh}
                    isYearAvailable={isYearAvailable}
                    getAvailableQuartersForYear={getAvailableQuartersForYear}
                    getAvailableMonthsForYear={getAvailableMonthsForYear}
                    loading={loading}
                />



                {/* Records Table */}
                <Card className="bg-white border border-gray-200 rounded-none shadow-sm">
                    <CardHeader className="pb-4 border-b border-gray-100">
                        <CardTitle>
                            <HeaderBar
                                loading={loading}
                                totalRecords={totalRecords}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                orgUnits={orgUnits}
                                selectedOrgUnit={selectedOrgUnit}
                                periodLabel={getFilterPeriodDisplay()}
                            />
                        </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-0">
                        <Table
                            loading={loading}
                            totalRecords={totalRecords}
                            records={records}
                            getRiskLevelColor={getRiskLevelColor}
                            onDelete={handleDeleteRecord}
                            deletingId={deletingId}
                            onBulkDelete={handleBulkDelete}
                            bulkDeleting={bulkDeleting}
                            onView={handleViewRecord}
                            onEdit={handleEditRecord}
                            onInlineUpdate={handleInlineUpdate}
                            editableFields={editableFields}
                            fieldOptions={fieldOptions}
                            dateFields={dateFields}
                            numberFields={numberFields}
                        />
                    </CardContent>
                    
                    {/* Enhanced Pagination Controls */}
                    {totalRecords > 0 && totalPages > 1 && (
                        <div className="border-t border-gray-200 bg-gray-50/50 px-3 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center justify-end">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onFirst={goToFirstPage}
                                    onPrev={goToPreviousPage}
                                    onNext={goToNextPage}
                                    onLast={goToLastPage}
                                    goToPage={goToPage}
                                />
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}

export default RecordsList
