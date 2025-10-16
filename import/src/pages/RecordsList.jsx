import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useDataEngine } from '@dhis2/app-runtime'
import { useNavigate } from 'react-router-dom'

import { useToast } from '../components/ui/ui/toast'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import config from '../lib/config'
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
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(50)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRecords, setTotalRecords] = useState(0)
    
    // Enhanced cache for API responses
    const [cache, setCache] = useState(new Map())
    const [lastCacheTime, setLastCacheTime] = useState(0)
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
            console.error('Error loading org units:', error)
            showToast({
                title: 'Error',
                description: 'Failed to load organization units',
                variant: 'error'
            })
        }
    }, [engine, showToast])


    const fetchRecords = useCallback(async () => {
        if (!selectedOrgUnit || !selectedPeriod) {
            console.log('[DEBUG] Missing required parameters:', { selectedOrgUnit, selectedPeriod })
            return
        }

        // Check cache first
        const cacheKey = `${selectedOrgUnit}-${selectedPeriod}-${currentPage}-${pageSize}`
        const now = Date.now()
        
        if (cache.has(cacheKey) && (now - lastCacheTime) < CACHE_DURATION) {
            const cachedData = cache.get(cacheKey)
            setRecords(cachedData.records)
            setTotalRecords(cachedData.totalRecords)
            setTotalPages(cachedData.totalPages)
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
                        includeAllChildren: true,
                        totalPages: true
                    }
                }
            })

            const events = eventsResponse?.events?.events || []
            
            // Only fetch TEIs for the events we actually have
            let trackedEntities = []
            if (events.length > 0) {
                const trackedEntityIds = events.map(event => event.trackedEntityInstance).filter(Boolean)
                
                if (trackedEntityIds.length > 0) {
                    const teiResponse = await engine.query({
                        trackedEntityInstances: {
                            resource: 'trackedEntityInstances',
                            params: {
                                trackedEntityType: 'MCPQUTHX1Ze',
                                trackedEntityInstance: trackedEntityIds.join(';'),
                                fields: teiFields,
                                paging: false
                            }
                        }
                    })
                    trackedEntities = teiResponse?.trackedEntityInstances?.trackedEntityInstances || []
                }
            }
            
            // Create lookup map for faster TEI matching
            const teiMap = new Map()
            trackedEntities.forEach(tei => {
                teiMap.set(tei.trackedEntityInstance, tei.attributes || [])
            })
            
            // Pre-compute reverse mappings once (moved outside for better performance)
            const valueMappings = config.mapping.valueMappings || {}
            const reverseMappings = Object.fromEntries(
                Object.entries(valueMappings).map(([key, mapping]) => [
                    key, 
                    Object.fromEntries(Object.entries(mapping).map(([k, v]) => [v, k]))
                ])
            )

            // Optimized data processing
            const processedRecords = events.map(event => {
                const dataValues = event.dataValues || []
                
                // Use Map lookup instead of find() for O(1) performance
                const attributes = teiMap.get(event.trackedEntityInstance) || []
                
                // Performance logging
                if (process.env.NODE_ENV === 'development') {
                    console.log(`[PERF] Processing event ${event.event} with ${dataValues.length} data values`)
                    console.log(`[DEBUG] Data elements found:`, dataValues.map(dv => ({ de: dv.dataElement, value: dv.value })))
                }
                
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

                // Map tracked entity attributes (personal information)
                attributes.forEach(attr => {
                    if (attr.attribute === config.mapping.trackedEntityAttributes.System_ID) record.systemId = attr.value
                    else if (attr.attribute === config.mapping.trackedEntityAttributes.UUIC) record.uuic = attr.value
                    else if (attr.attribute === config.mapping.trackedEntityAttributes.Family_Name) record.familyName = attr.value
                    else if (attr.attribute === config.mapping.trackedEntityAttributes.Last_Name) record.lastName = attr.value
                    else if (attr.attribute === config.mapping.trackedEntityAttributes.Sex) {
                        record.sex = reverseMapValue('sex', attr.value)
                    }
                    else if (attr.attribute === config.mapping.trackedEntityAttributes.DOB) record.dateOfBirth = attr.value
                    else if (attr.attribute === config.mapping.trackedEntityAttributes.Province) record.province = attr.value
                    else if (attr.attribute === config.mapping.trackedEntityAttributes.OD) record.od = attr.value
                    else if (attr.attribute === config.mapping.trackedEntityAttributes.District) record.district = attr.value
                    else if (attr.attribute === config.mapping.trackedEntityAttributes.Commune) record.commune = attr.value
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

                // Map data values to record fields using actual DHIS2 data element IDs
                dataValues.forEach(dv => {
                    if (!dv.value || dv.value === '') return // Skip empty values
                    
                    // Debug logging for data mapping
                    if (process.env.NODE_ENV === 'development') {
                        console.log('[DEBUG] Mapping data element:', dv.dataElement, 'value:', dv.value)
                    }
                    
                    // Program Stage Data Elements - Using actual field names
                    if (dv.dataElement === config.mapping.programStageDataElements.genderIdentity) {
                        record.genderIdentity = reverseMapValue('genderIdentity', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.sexAtBirth) {
                        record.sexAtBirth = reverseMapValue('sex', dv.value) || dv.value
                        // Only set sex if it's not already set from tracked entity attributes
                        if (!record.sex || record.sex === '') {
                            record.sex = reverseMapValue('sex', dv.value) || dv.value
                        }
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.sexualHealthConcerns) {
                        record.sexualHealthConcerns = reverseMapValue('sexualHealthConcerns', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.hadSexPast6Months) {
                        record.hadSexPast6Months = reverseMapValue('hadSexPast6Months', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.partnerMale) {
                        record.partnerMale = reverseMapValue('partnerMale', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.partnerFemale) {
                        record.partnerFemale = reverseMapValue('partnerFemale', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.partnerTGW) {
                        record.partnerTGW = reverseMapValue('partnerTGW', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.numberOfSexualPartners) {
                        record.numberOfSexualPartners = dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.sexWithoutCondom) {
                        record.sexWithoutCondom = reverseMapValue('sexWithoutCondom', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.sexWithHIVPartner) {
                        record.sexWithHIVPartner = reverseMapValue('sexWithHIVPartner', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.stiSymptoms) {
                        record.stiSymptoms = reverseMapValue('stiSymptoms', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.syphilisPositive) {
                        record.syphilisPositive = reverseMapValue('syphilisPositive', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.hivTestPast6Months) {
                        record.hivTestPast6Months = reverseMapValue('hivTestPast6Months', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.hivTestResult) {
                        record.hivTestResult = reverseMapValue('hivTestResult', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.lastHivTestDate) {
                        record.lastHivTestDate = dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.currentlyOnPrep) {
                        // Handle special case where currentlyOnPrep might be stored as a number
                        let value = dv.value
                        
                        // Debug logging for currentlyOnPrep
                        if (process.env.NODE_ENV === 'development') {
                            console.log('[DEBUG] currentlyOnPrep - Original value:', dv.value, 'Type:', typeof dv.value)
                        }
                        
                        // Map numeric values to text values (Yes/No only)
                        if (value === '10' || value === 10) {
                            value = 'Yes' // Map 10 to Yes for PrEP
                        } else if (value === '0' || value === 0) {
                            value = 'No' // Map 0 to No for PrEP
                        }
                        
                        // Use reverse mapping to get display value
                        record.currentlyOnPrep = reverseMapValue('currentlyOnPrep', value) || value
                        
                        // Debug logging for final value
                        if (process.env.NODE_ENV === 'development') {
                            console.log('[DEBUG] currentlyOnPrep - Mapped value:', value, 'Final value:', record.currentlyOnPrep)
                        }
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.everOnPrep) {
                        // Handle everOnPrep - may be stored as numeric values
                        let value = dv.value
                        
                        // Debug logging for everOnPrep
                        if (process.env.NODE_ENV === 'development') {
                            console.log('[DEBUG] everOnPrep - Original value:', dv.value, 'Type:', typeof dv.value)
                        }
                        
                        // Map numeric values to text values if needed
                        if (value === '12' || value === 12) {
                            value = 'Never Know' // Map 12 to Never Know
                        } else if (value === '10' || value === 10) {
                            value = 'Yes' // Map 10 to Yes
                        } else if (value === '0' || value === 0) {
                            value = 'No' // Map 0 to No
                        }
                        
                        // Use reverse mapping to get display value
                        record.everOnPrep = reverseMapValue('everOnPrep', value) || value
                        
                        // Debug logging for final value
                        if (process.env.NODE_ENV === 'development') {
                            console.log('[DEBUG] everOnPrep - Mapped value:', value, 'Final value:', record.everOnPrep)
                        }
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.receiveMoneyForSex) {
                        record.receiveMoneyForSex = reverseMapValue('receiveMoneyForSex', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.paidForSex) {
                        record.paidForSex = reverseMapValue('paidForSex', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.injectedDrugSharedNeedle) {
                        record.injectedDrugSharedNeedle = reverseMapValue('injectedDrugSharedNeedle', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.alcoholDrugBeforeSex) {
                        record.alcoholDrugBeforeSex = reverseMapValue('alcoholDrugBeforeSex', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.groupSexChemsex) {
                        record.groupSexChemsex = reverseMapValue('groupSexChemsex', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.abortion) {
                        record.abortion = reverseMapValue('abortion', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.forcedSex) {
                        record.forcedSex = reverseMapValue('forcedSex', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.noneOfAbove) {
                        record.noneOfAbove = reverseMapValue('noneOfAbove', dv.value) || dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.riskScreeningResult) {
                        record.riskScreeningResult = dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.riskScreeningScore) {
                        record.riskScreeningScore = dv.value
                    }
                    else if (dv.dataElement === config.mapping.programStageDataElements.past6MonthsPractices) {
                        record.past6MonthsPractices = dv.value
                    }
                })

                // Debug logging for final record
                if (process.env.NODE_ENV === 'development') {
                    console.log(`[DEBUG] Final record for event ${event.event}:`, {
                        everOnPrep: record.everOnPrep,
                        currentlyOnPrep: record.currentlyOnPrep
                    })
                }
                
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
                console.log(`🚀 [PERF] Loaded ${processedRecords.length} records in ${loadTime}ms`)
                console.log(`📊 Total: ${totalRecordsFromAPI}, Pages: ${totalPagesFromAPI}`)
            }
            
            // Ignore stale responses if the user changed pages mid-flight
            if (requestedPage !== latestPageRequestedRef.current) {
                return
            }

            setRecords(processedRecords)
            setTotalRecords(totalRecordsFromAPI)
            setTotalPages(totalPagesFromAPI)
            
            // Enhanced caching with longer duration
            setCache(prev => {
                const newCache = new Map(prev)
                newCache.set(cacheKey, {
                    records: processedRecords,
                    totalRecords: totalRecordsFromAPI,
                    totalPages: totalPagesFromAPI,
                    timestamp: now
                })
                return newCache
            })
            setLastCacheTime(now)
            
            showToast({
                title: 'Success',
                description: `Loaded ${processedRecords.length} records in ${loadTime}ms (Page ${currentPage} of ${totalPagesFromAPI})`,
                variant: 'default'
            })
        } catch (error) {
            console.error('Error fetching records:', error)
            
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
    }, [engine, selectedOrgUnit, selectedPeriodType, selectedPeriod, currentPage, pageSize, showToast, cache, lastCacheTime, CACHE_DURATION])

    // Clear records and cache when filters change (optimized)
    useEffect(() => {
        setRecords([])
        setTotalRecords(0)
        setTotalPages(1)
        // Only clear cache for different org unit, keep period cache
        if (selectedOrgUnit) {
            const newCache = new Map()
            // Keep cache entries for other org units
            cache.forEach((value, key) => {
                if (!key.startsWith(selectedOrgUnit)) {
                    newCache.set(key, value)
                }
            })
            setCache(newCache)
        }
        setLastCacheTime(0)
    }, [selectedOrgUnit, selectedPeriod])

    // Clear period selections and cache when organization changes
    useEffect(() => {
        if (!selectedOrgUnit) {
            setSelectedPeriodType('')
            setSelectedPeriod('')
            setSelectedYear('')
            setSelectedQuarter(null)
            setSelectedMonth(null)
            setCache(new Map()) // Clear cache when org unit changes
            setLastCacheTime(0)
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
        setCache(new Map())
        setLastCacheTime(0)
        setCurrentPage(1) // Reset to first page when manually loading
        fetchRecords()
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

    const handleQuarterSelect = (quarter) => {
        setSelectedQuarter(quarter)
        setSelectedPeriod(`${selectedYear}Q${quarter}`)
    }

    const handleMonthSelect = (month) => {
        setSelectedMonth(month)
        setSelectedPeriod(`${selectedYear}${month.toString().padStart(2, '0')}`)
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
            
            // Don't update local state immediately - let the refresh handle it
            // This ensures consistency with server data
            
            // Always refresh to get updated data from server
            setTimeout(() => {
                setLoading(true) // Show loading state during refresh
                fetchRecords()
            }, 100) // Small delay to ensure state updates are processed
            
        } catch (error) {
            console.error('Failed to delete record:', error)
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
                    console.error(`Failed to delete record ${record.id}:`, error)
                    errorCount++
                }
            }
            
            // Handle pagination after bulk delete
            if (successCount > 0) {
                // Always refresh to get updated data from server
                setTimeout(() => {
                    setLoading(true) // Show loading state during refresh
                    fetchRecords()
                }, 100) // Small delay to ensure state updates are processed
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
            console.error('Bulk delete error:', error)
            showToast({
                title: 'Error',
                description: 'Bulk delete operation failed. Please try again.',
                variant: 'error'
            })
        } finally {
            setBulkDeleting(false)
        }
    }

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
                <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
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
