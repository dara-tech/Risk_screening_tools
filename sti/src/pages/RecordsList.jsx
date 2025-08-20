import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useDataEngine } from '@dhis2/app-runtime'

import { t } from '../lib/i18n'
import { useToast } from '../components/ui/ui/toast'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { FiDownload, FiRefreshCw, FiEye, FiCalendar, FiMapPin, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Activity, FileText } from 'lucide-react'
import config from '../lib/config'
import QuarterPicker from '../components/QuarterPicker'
import MonthPicker from '../components/MonthPicker'
import YearPicker from '../components/YearPicker'
import Filters from '../components/records-list/Filters'
import HeaderBar from '../components/records-list/HeaderBar'
import Pagination from '../components/records-list/Pagination'
import Table from '../components/records-list/Table'

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
    const [periods, setPeriods] = useState([])
    const [filteredRecords, setFilteredRecords] = useState([])
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(50)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRecords, setTotalRecords] = useState(0)
    const [paginatedRecords, setPaginatedRecords] = useState([])
    // For accurate display range regardless of render timing
    const [displayStartIndex, setDisplayStartIndex] = useState(0)
    const [displayEndIndex, setDisplayEndIndex] = useState(0)
    // Responsive helpers
    const [isSmallScreen, setIsSmallScreen] = useState(false)

    
    const engine = useDataEngine()
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
        generatePeriods()
    }, [])

    // Track screen size for responsive pagination/header
    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 640)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
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

    const generatePeriods = useCallback(() => {
        try {
            const periods = []
            const today = new Date()
            const currentYear = today.getFullYear()
            
            if (selectedPeriodType === 'yearly') {
                // Generate years (current year and last 5 years)
                for (let i = 0; i <= 5; i++) {
                    const year = currentYear - i
                    periods.push({
                        value: year.toString(),
                        label: `${year} (Year)`
                    })
                }
            } else if (selectedPeriodType === 'quarterly') {
                // Generate quarters for current year and last 2 years
                for (let yearOffset = 0; yearOffset <= 2; yearOffset++) {
                    const year = currentYear - yearOffset
                    for (let quarter = 1; quarter <= 4; quarter++) {
                        const quarterLabel = `Q${quarter}`
                        periods.push({
                            value: `${year}Q${quarter}`,
                            label: `${year} ${quarterLabel}`
                        })
                    }
                }
            } else if (selectedPeriodType === 'monthly') {
                // Generate last 24 months
                for (let i = 0; i < 24; i++) {
                    const date = new Date(currentYear, today.getMonth() - i, 1)
                    const year = date.getFullYear()
                    const month = date.getMonth() + 1
                    const monthName = date.toLocaleDateString('en-US', { month: 'short' })
                    const periodValue = year.toString() + month.toString().padStart(2, '0')
                    periods.push({
                        value: periodValue,
                        label: `${monthName} ${year}`
                    })
                }
            }
            
            setPeriods(periods)
            
            // Set default period based on type
            if (periods.length > 0 && !selectedPeriod) {
                if (selectedPeriodType === 'yearly') {
                    setSelectedPeriod(currentYear.toString())
                } else if (selectedPeriodType === 'quarterly') {
                    const currentQuarter = Math.ceil((today.getMonth() + 1) / 3)
                    setSelectedPeriod(`${currentYear}Q${currentQuarter}`)
                } else if (selectedPeriodType === 'monthly') {
                    const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0')
                    setSelectedPeriod(`${currentYear}${currentMonth}`)
                }
            }
        } catch (error) {
            console.error('Error generating periods:', error)
        }
    }, [selectedPeriodType, selectedPeriod])

    const fetchRecords = useCallback(async () => {
        if (!selectedOrgUnit || !selectedPeriod) return

        setLoading(true)
        try {
            const requestedPage = currentPage
            latestPageRequestedRef.current = requestedPage
            // Convert period to start and end dates
            let startDate, endDate
            
            if (selectedPeriodType === 'yearly') {
                // Year format: YYYY
                startDate = `${selectedPeriod}-01-01`
                endDate = `${selectedPeriod}-12-31`
            } else if (selectedPeriodType === 'quarterly') {
                // Quarter format: YYYYQ#
                const [year, quarter] = selectedPeriod.split('Q')
                const quarterNum = parseInt(quarter)
                const quarterStartMonth = (quarterNum - 1) * 3 + 1
                const quarterEndMonth = quarterNum * 3
                startDate = `${year}-${quarterStartMonth.toString().padStart(2, '0')}-01`
                const lastDay = new Date(parseInt(year), quarterEndMonth, 0).getDate()
                endDate = `${year}-${quarterEndMonth.toString().padStart(2, '0')}-${lastDay}`
            } else if (selectedPeriodType === 'monthly') {
                // Month format: YYYYMM
                const year = selectedPeriod.substring(0, 4)
                const month = selectedPeriod.substring(4, 6)
                startDate = `${year}-${month}-01`
                const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate()
                endDate = `${year}-${month}-${lastDay}`
            }

            // Calculate pagination parameters
            const page = currentPage
            const pageSizeParam = pageSize

                        // Fetch events with pagination
            let response
            try {
                response = await engine.query({
                    events: {
                        resource: 'events',
                        params: {
                            program: 'gmO3xUubvMb',
                            programStage: 'hqJKFmOU6s7',
                            orgUnit: selectedOrgUnit,
                            startDate: startDate,
                            endDate: endDate,
                            fields: 'event,eventDate,dueDate,dataValues,orgUnit,trackedEntityInstance,enrollment',
                            page: page,
                            pageSize: pageSizeParam,
                            paging: true,
                            includeAllChildren: true
                        }
                    }
                })
                
                // If no data, try without date restrictions
                const events = response?.events?.events || []
                if (events.length === 0) {
                    response = await engine.query({
                        events: {
                            resource: 'events',
                            params: {
                                program: 'gmO3xUubvMb',
                                programStage: 'hqJKFmOU6s7',
                                orgUnit: selectedOrgUnit,
                                fields: 'event,eventDate,dueDate,dataValues,orgUnit,trackedEntityInstance,enrollment',
                                page: page,
                                pageSize: pageSizeParam,
                                paging: true,
                                includeAllChildren: true
                            }
                        }
                    })
                }
            } catch (error) {
                console.error('Error fetching events:', error)
                // Fallback to raw data query
                response = await engine.query({
                    events: {
                        resource: 'events',
                        params: {
                            program: 'gmO3xUubvMb',
                            programStage: 'hqJKFmOU6s7',
                            orgUnit: selectedOrgUnit,
                            fields: 'event,eventDate,dueDate,dataValues,orgUnit,trackedEntityInstance,enrollment',
                            page: page,
                            pageSize: pageSizeParam,
                            paging: true,
                            includeAllChildren: true
                        }
                    }
                })
            }

            // Fetch tracked entity instances to get personal information
            const events = response?.events?.events || []
            const trackedEntityIds = events.map(event => event.trackedEntityInstance).filter(Boolean)
            
            let trackedEntities = []
            if (trackedEntityIds.length > 0) {
                console.log('🔍 Fetching tracked entity instances for:', trackedEntityIds)
                const teiResponse = await engine.query({
                    trackedEntityInstances: {
                        resource: 'trackedEntityInstances',
                        params: {
                            trackedEntityType: 'MCPQUTHX1Ze',
                            trackedEntityInstance: trackedEntityIds.join(';'),
                            fields: 'trackedEntityInstance,attributes[attribute,value]',
                            paging: false
                        }
                    }
                })
                trackedEntities = teiResponse?.trackedEntityInstances?.trackedEntityInstances || []
                console.log('👥 Tracked entity instances fetched:', trackedEntities.length)
                console.log('📋 Sample tracked entity:', trackedEntities[0])
            } else {
                console.log('⚠️ No tracked entity IDs found')
            }
            console.log('🔍 Raw events from DHIS2:', events)
            
            const processedRecords = events.map(event => {
                const dataValues = event.dataValues || []
                console.log('📊 Data values for event:', event.event, dataValues)
                
                // Find tracked entity instance data
                const tei = trackedEntities.find(te => te.trackedEntityInstance === event.trackedEntityInstance)
                const attributes = tei?.attributes || []
                console.log('👤 Tracked entity attributes for:', event.trackedEntityInstance, attributes)
                console.log('📅 Date of birth from attributes:', attributes.find(attr => attr.attribute === config.mapping.trackedEntityAttributes.DOB)?.value)
                
                const record = {
                    id: event.event,
                    eventDate: event.eventDate,
                    orgUnit: event.orgUnit,
                    trackedEntityInstance: event.trackedEntityInstance,
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
                    riskScore: '',
                    riskLevel: '',
                    riskFactors: [],
                    recommendations: []
                }

                // Map tracked entity attributes (personal information)
                attributes.forEach(attr => {
                    if (attr.attribute === config.mapping.trackedEntityAttributes.System_ID) record.systemId = attr.value
                    else if (attr.attribute === config.mapping.trackedEntityAttributes.UUIC) record.uuic = attr.value
                    else if (attr.attribute === config.mapping.trackedEntityAttributes.Family_Name) record.familyName = attr.value
                    else if (attr.attribute === config.mapping.trackedEntityAttributes.Last_Name) record.lastName = attr.value
                    else if (attr.attribute === config.mapping.trackedEntityAttributes.Sex) record.sex = attr.value
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
                    console.log('🎂 Age calculation:', { dateOfBirth: record.dateOfBirth, calculatedAge: record.age })
                } else {
                    console.log('❌ No date of birth found for record:', record.id)
                }

                // Map data values to record fields using actual DHIS2 data element IDs
                dataValues.forEach(dv => {
                    // Program Stage Data Elements - Using actual field names
                    if (dv.dataElement === config.mapping.programStageDataElements.genderIdentity) record.genderIdentity = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.sexualHealthConcerns) record.sexualHealthConcerns = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.hadSexPast6Months) record.hadSexPast6Months = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.partnerMale) record.partnerMale = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.partnerFemale) record.partnerFemale = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.partnerTGW) record.partnerTGW = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.numberOfSexualPartners) record.numberOfSexualPartners = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.sexWithoutCondom) record.sexWithoutCondom = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.sexWithHIVPartner) record.sexWithHIVPartner = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.stiSymptoms) record.stiSymptoms = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.syphilisPositive) record.syphilisPositive = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.hivTestPast6Months) record.hivTestPast6Months = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.hivTestResult) record.hivTestResult = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.lastHivTestDate) record.lastHivTestDate = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.currentlyOnPrep) record.currentlyOnPrep = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.everOnPrep) record.everOnPrep = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.receiveMoneyForSex) record.receiveMoneyForSex = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.paidForSex) record.paidForSex = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.injectedDrugSharedNeedle) record.injectedDrugSharedNeedle = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.alcoholDrugBeforeSex) record.alcoholDrugBeforeSex = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.groupSexChemsex) record.groupSexChemsex = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.abortion) record.abortion = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.forcedSex) record.forcedSex = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.noneOfAbove) record.noneOfAbove = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.sexAtBirth) record.sexAtBirth = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.riskScreeningResult) record.riskScreeningResult = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.riskScreeningScore) record.riskScreeningScore = dv.value
                    else if (dv.dataElement === config.mapping.programStageDataElements.past6MonthsPractices) record.past6MonthsPractices = dv.value
                })

                console.log('📋 Processed record:', record)
                return record
            })

            // Get pagination info from response
            const pagination = response?.events?.pager || {}
            let totalRecordsFromAPI = pagination.total || processedRecords.length
            let totalPagesFromAPI = pagination.pageCount || Math.ceil(totalRecordsFromAPI / pageSize)
            
            // Check if this is the last page
            const isLastPage = pagination.isLastPage || false
            
            // If not the last page and we don't have a proper total, estimate it
            if (!isLastPage && totalRecordsFromAPI <= pageSize) {
                console.log('⚠️ Not last page but total records is limited, estimating...')
                // If we're on page 2 and not the last page, assume there are at least 3 pages
                if (page === 2) {
                    totalRecordsFromAPI = pageSize * 3 // At least 3 pages
                    totalPagesFromAPI = 3
                } else {
                    // For other pages, assume there are more pages ahead
                    totalRecordsFromAPI = pageSize * (page + 2) // Current page + at least 2 more
                    totalPagesFromAPI = page + 2
                }
                console.log('📊 Estimated total records:', totalRecordsFromAPI, 'Total pages:', totalPagesFromAPI)
            }
            
            // Always get total count to ensure accurate pagination
            if (page === 1) {
                try {
                    console.log('🔍 Getting total count...')
                    const countResponse = await engine.query({
                        events: {
                            resource: 'events',
                            params: {
                                program: 'gmO3xUubvMb',
                                programStage: 'hqJKFmOU6s7',
                                orgUnit: selectedOrgUnit,
                                startDate: startDate,
                                endDate: endDate,
                                fields: 'event',
                                paging: false,
                                includeAllChildren: true
                            }
                        }
                    })
                    const allEvents = countResponse?.events?.events || []
                    totalRecordsFromAPI = allEvents.length
                    totalPagesFromAPI = Math.ceil(totalRecordsFromAPI / pageSize)
                    console.log('📊 Total count from separate query:', totalRecordsFromAPI)
                    
                    // If the count query also returns limited results, try without date filters
                    if (allEvents.length <= pageSize) {
                        console.log('⚠️ Count query also limited, trying without date filters...')
                        const countResponseNoDate = await engine.query({
                            events: {
                                resource: 'events',
                                params: {
                                    program: 'gmO3xUubvMb',
                                    programStage: 'hqJKFmOU6s7',
                                    orgUnit: selectedOrgUnit,
                                    fields: 'event',
                                    paging: false,
                                    includeAllChildren: true
                                }
                            }
                        })
                        const allEventsNoDate = countResponseNoDate?.events?.events || []
                        totalRecordsFromAPI = allEventsNoDate.length
                        totalPagesFromAPI = Math.ceil(totalRecordsFromAPI / pageSize)
                        console.log('📊 Total count without date filters:', totalRecordsFromAPI)
                        
                        // If still limited, try with a very large page size
                        if (allEventsNoDate.length <= pageSize) {
                            console.log('⚠️ Still limited, trying with large page size...')
                            const countResponseLarge = await engine.query({
                                events: {
                                    resource: 'events',
                                    params: {
                                        program: 'gmO3xUubvMb',
                                        programStage: 'hqJKFmOU6s7',
                                        orgUnit: selectedOrgUnit,
                                        fields: 'event',
                                        pageSize: 10000, // Try with a very large page size
                                        paging: true,
                                        includeAllChildren: true
                                    }
                                }
                            })
                            const allEventsLarge = countResponseLarge?.events?.events || []
                            const pagerInfo = countResponseLarge?.events?.pager || {}
                            totalRecordsFromAPI = pagerInfo.total || allEventsLarge.length
                            totalPagesFromAPI = Math.ceil(totalRecordsFromAPI / pageSize)
                            console.log('📊 Total count with large page size:', totalRecordsFromAPI, 'Pager info:', pagerInfo)
                        }
                    }
                } catch (error) {
                    console.error('❌ Failed to get total count:', error)
                    // Fallback: if we can't get total count, assume there are more records
                    if (processedRecords.length === pageSize) {
                        totalRecordsFromAPI = pageSize * 10 // Assume at least 10 pages
                        totalPagesFromAPI = 10
                        console.log('📊 Using fallback count:', totalRecordsFromAPI)
                    }
                }
            }
            
            console.log('📊 Full API Response:', response)
            console.log('📊 Pagination info from API:', { 
                pagination,
                totalRecords: totalRecordsFromAPI, 
                totalPages: totalPagesFromAPI,
                currentPage: page,
                pageSize: pageSizeParam,
                recordsInThisPage: processedRecords.length,
                hasPager: !!response?.events?.pager,
                isLastPage: isLastPage
            })
            
            // Ignore stale responses if the user changed pages mid-flight
            if (requestedPage !== latestPageRequestedRef.current) {
                return
            }

            setRecords(processedRecords)
            setTotalRecords(totalRecordsFromAPI)
            setTotalPages(totalPagesFromAPI)
            setFilteredRecords(processedRecords) // For this page only
            setPaginatedRecords(processedRecords) // This page's data
            // Compute display range from server pager + actual page data length
            const start = (requestedPage - 1) * pageSizeParam + 1
            const end = Math.min(start + processedRecords.length - 1, totalRecordsFromAPI)
            setDisplayStartIndex(start)
            setDisplayEndIndex(end)
            
            showToast({
                title: 'Success',
                description: `Loaded ${processedRecords.length} records (Page ${page} of ${totalPagesFromAPI})`,
                variant: 'default'
            })
        } catch (error) {
            console.error('Error fetching records:', error)
            showToast({
                title: 'Error',
                description: 'Failed to load records',
                variant: 'error'
            })
        } finally {
            setLoading(false)
        }
    }, [engine, selectedOrgUnit, selectedPeriodType, selectedPeriod, currentPage, pageSize, showToast])

    // Clear records when filters change (but don't load new data automatically)
    useEffect(() => {
        setRecords([])
        setTotalRecords(0)
        setTotalPages(1)
        // Don't set currentPage to 1 here to avoid triggering the pagination useEffect
        // The pagination useEffect will handle fetching when currentPage is already 1
    }, [selectedOrgUnit, selectedPeriod])

    // Clear period selections when organization changes
    useEffect(() => {
        if (!selectedOrgUnit) {
            setSelectedPeriodType('')
            setSelectedPeriod('')
            setSelectedYear('')
            setSelectedQuarter(null)
            setSelectedMonth(null)
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
        console.log('🔍 goToPage called:', { page, totalPages, currentPage })
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        } else {
            console.log('❌ Page navigation blocked:', { page, totalPages })
        }
    }

    const goToFirstPage = () => goToPage(1)
    const goToLastPage = () => goToPage(totalPages)
    const goToNextPage = () => goToPage(currentPage + 1)
    const goToPreviousPage = () => goToPage(currentPage - 1)

    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = isSmallScreen ? 5 : 10
        
        let startPage = Math.max(1, currentPage - 2)
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }
        
        return pages
    }



    const getDisplayRange = () => {
        if (displayStartIndex && displayEndIndex) {
            return { startIndex: displayStartIndex, endIndex: displayEndIndex }
        }
        const startIndex = (currentPage - 1) * pageSize + 1
        const endIndex = Math.min(currentPage * pageSize, totalRecords)
        return { startIndex, endIndex }
    }

    const formatDate = (dateString) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleDateString()
    }

    const handleRefresh = () => {
        setCurrentPage(1) // Reset to first page when manually loading
        fetchRecords()
    }

    const clearFilters = () => {
        setSelectedPeriod('')
        setSelectedYear(new Date().getFullYear())
        setSelectedQuarter(null)
        setSelectedMonth(null)
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



    const handleExport = () => {
        const csvContent = [
            ['System ID', 'UUIC', 'Family Name', 'Last Name', 'Sex', 'Age', 'Province', 'District', 'Risk Level', 'Event Date'],
            ...records.map(record => [
                record.systemId || '',
                record.uuic || '',
                record.familyName || '',
                record.lastName || '',
                record.sex || '',
                record.age || '',
                record.province || '',
                record.district || '',
                record.riskScreeningResult || record.riskLevel || '',
                formatDate(record.eventDate)
            ])
        ].map(row => row.join(',')).join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
                    const periodLabel = getFilterPeriodDisplay().replace(/\s+/g, '-').toLowerCase()
            a.download = `sti-records-${periodLabel}.csv`
        a.click()
        window.URL.revokeObjectURL(url)

        showToast({
            title: 'Export Successful',
            description: 'Records exported to CSV file',
            variant: 'default'
        })
    }

    // Delete an event record
    const [deletingId, setDeletingId] = useState(null)
    const [bulkDeleting, setBulkDeleting] = useState(false)
    
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
        console.log('handleBulkDelete called:', { selectedRecords })
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
