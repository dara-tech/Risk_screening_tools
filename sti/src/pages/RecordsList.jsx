import React, { useState, useEffect, useCallback } from 'react'
import { useDataEngine } from '@dhis2/app-runtime'
import { t } from '../lib/i18n'
import { useToast } from '../components/ui/ui/toast'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { FiSearch, FiFilter, FiDownload, FiRefreshCw, FiEye, FiCalendar, FiUser, FiMapPin } from 'react-icons/fi'
import { Shield, Activity, Calculator, FileText } from 'lucide-react'
import config from '../lib/config'

const RecordsList = () => {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedPeriod, setSelectedPeriod] = useState('')
    const [selectedOrgUnit, setSelectedOrgUnit] = useState('')
    const [orgUnits, setOrgUnits] = useState([])
    const [periods, setPeriods] = useState([])
    const [filteredRecords, setFilteredRecords] = useState([])
    const [periodType, setPeriodType] = useState('year')
    
    const engine = useDataEngine()
    const { showToast } = useToast()

    // Load data on mount
    useEffect(() => {
        fetchOrgUnits()
        fetchPeriods()
    }, [])

    // Update selected period when period type changes
    useEffect(() => {
        if (periods.length > 0) {
            const firstPeriodOfType = periods.find(p => p.type === periodType)
            if (firstPeriodOfType) {
                setSelectedPeriod(firstPeriodOfType.value)
            }
        }
    }, [periodType, periods])

    // Filter records when search or filters change
    useEffect(() => {
        let filtered = records
        console.log('🔍 Filtering records:', { recordsCount: records.length, searchTerm, selectedPeriod, selectedOrgUnit })

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(record => 
                record.familyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.systemId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.uuic?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filter by period - handle year, quarter, and monthly periods
        if (selectedPeriod) {
            console.log('🔍 Period filtering:', { selectedPeriod })
            filtered = filtered.filter(record => {
                if (!record.eventDate) {
                    console.log('❌ No eventDate for record:', record.id)
                    return false
                }
                const eventDate = new Date(record.eventDate)
                const recordYear = eventDate.getFullYear().toString()
                const recordMonth = (eventDate.getMonth() + 1).toString().padStart(2, '0')
                const recordQuarter = Math.ceil((eventDate.getMonth() + 1) / 3).toString()
                const recordPeriod = recordYear + recordMonth
                
                let matches = false
                
                // Check if selectedPeriod is a year (4 digits)
                if (selectedPeriod.length === 4 && /^\d{4}$/.test(selectedPeriod)) {
                    matches = recordYear === selectedPeriod
                }
                // Check if selectedPeriod is a quarter (YYYYQ# format)
                else if (selectedPeriod.includes('Q')) {
                    const [year, quarter] = selectedPeriod.split('Q')
                    matches = recordYear === year && recordQuarter === quarter
                }
                // Check if selectedPeriod is a month (YYYYMM format)
                else if (selectedPeriod.length === 6 && /^\d{6}$/.test(selectedPeriod)) {
                    matches = recordPeriod === selectedPeriod
                }
                
                console.log('📅 Period check:', { 
                    recordId: record.id, 
                    eventDate: record.eventDate, 
                    recordYear,
                    recordMonth,
                    recordQuarter,
                    recordPeriod, 
                    selectedPeriod, 
                    matches 
                })
                return matches
            })
        }

        // Filter by org unit - records are already filtered by the API call
        // This is just a safety check
        if (selectedOrgUnit) {
            filtered = filtered.filter(record => record.orgUnit === selectedOrgUnit)
        }

        console.log('📋 Filtered records:', { filteredCount: filtered.length, filtered })
        setFilteredRecords(filtered)
    }, [records, searchTerm, selectedPeriod, selectedOrgUnit])

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
            
            if (filteredOrgUnits.length > 0) {
                setSelectedOrgUnit(filteredOrgUnits[0].id)
            }
        } catch (error) {
            console.error('Error loading org units:', error)
            showToast({
                title: 'Error',
                description: 'Failed to load organization units',
                variant: 'error'
            })
        }
    }, [engine, showToast])

    const fetchPeriods = useCallback(async () => {
        try {
            const periods = []
            const today = new Date()
            const currentYear = today.getFullYear()
            
            // Add current year
            periods.push({
                value: currentYear.toString(),
                label: `${currentYear} (Year)`,
                type: 'year'
            })
            
            // Add last 2 years
            for (let i = 1; i <= 2; i++) {
                const year = currentYear - i
                periods.push({
                    value: year.toString(),
                    label: `${year} (Year)`,
                    type: 'year'
                })
            }
            
            // Add current year quarters
            for (let quarter = 1; quarter <= 4; quarter++) {
                const quarterLabel = `Q${quarter}`
                const quarterValue = `${currentYear}Q${quarter}`
                periods.push({
                    value: quarterValue,
                    label: `${currentYear} ${quarterLabel}`,
                    type: 'quarter'
                })
            }
            
            // Add last year quarters
            for (let quarter = 1; quarter <= 4; quarter++) {
                const year = currentYear - 1
                const quarterLabel = `Q${quarter}`
                const quarterValue = `${year}Q${quarter}`
                periods.push({
                    value: quarterValue,
                    label: `${year} ${quarterLabel}`,
                    type: 'quarter'
                })
            }
            
            // Add last 12 months
            for (let i = 0; i < 12; i++) {
                const date = new Date(currentYear, today.getMonth() - i, 1)
                const year = date.getFullYear()
                const month = date.getMonth() + 1
                const monthName = date.toLocaleDateString('en-US', { month: 'short' })
                const periodValue = year.toString() + month.toString().padStart(2, '0')
                periods.push({
                    value: periodValue,
                    label: `${monthName} ${year}`,
                    type: 'month'
                })
            }
            
            setPeriods(periods)
            // Set initial period based on period type
            const initialPeriod = periods.find(p => p.type === 'year')
            setSelectedPeriod(initialPeriod?.value || periods[0]?.value || '')
        } catch (error) {
            console.error('Error generating periods:', error)
        }
    }, [])

    const fetchRecords = useCallback(async () => {
        if (!selectedOrgUnit || !selectedPeriod) return

        setLoading(true)
        try {
            // Convert period to start and end dates
            let startDate, endDate
            
            // Check if selectedPeriod is a year (4 digits)
            if (selectedPeriod.length === 4 && /^\d{4}$/.test(selectedPeriod)) {
                startDate = `${selectedPeriod}-01-01`
                endDate = `${selectedPeriod}-12-31`
            }
            // Check if selectedPeriod is a quarter (YYYYQ# format)
            else if (selectedPeriod.includes('Q')) {
                const [year, quarter] = selectedPeriod.split('Q')
                const quarterStartMonth = (parseInt(quarter) - 1) * 3 + 1
                const quarterEndMonth = parseInt(quarter) * 3
                startDate = `${year}-${quarterStartMonth.toString().padStart(2, '0')}-01`
                const lastDay = new Date(parseInt(year), quarterEndMonth, 0).getDate()
                endDate = `${year}-${quarterEndMonth.toString().padStart(2, '0')}-${lastDay}`
            }
            // Check if selectedPeriod is a month (YYYYMM format)
            else if (selectedPeriod.length === 6 && /^\d{6}$/.test(selectedPeriod)) {
                const year = selectedPeriod.substring(0, 4)
                const month = selectedPeriod.substring(4, 6)
                startDate = `${year}-${month}-01`
                const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate()
                endDate = `${year}-${month}-${lastDay}`
            }

            // Try analytics first, fallback to raw data if needed
            let response
            try {
                console.log('🔍 Trying analytics query first...')
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
                            paging: false,
                            includeAllChildren: true
                        }
                    }
                })
                
                // If no data, try without date restrictions
                const events = response?.events?.events || []
                if (events.length === 0) {
                    console.log('⚠️ No data with date filter, trying without date restrictions...')
                    response = await engine.query({
                        events: {
                            resource: 'events',
                            params: {
                                program: 'gmO3xUubvMb',
                                programStage: 'hqJKFmOU6s7',
                                orgUnit: selectedOrgUnit,
                                fields: 'event,eventDate,dueDate,dataValues,orgUnit,trackedEntityInstance,enrollment',
                                paging: false,
                                includeAllChildren: true
                            }
                        }
                    })
                    console.log('📊 Raw data response (no date filter):', response?.events?.events?.length || 0)
                }
            } catch (error) {
                console.error('❌ Analytics query failed, trying raw data...', error)
                // Fallback to raw data query
                response = await engine.query({
                    events: {
                        resource: 'events',
                        params: {
                            program: 'gmO3xUubvMb',
                            programStage: 'hqJKFmOU6s7',
                            orgUnit: selectedOrgUnit,
                            fields: 'event,eventDate,dueDate,dataValues,orgUnit,trackedEntityInstance,enrollment',
                            paging: false,
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

            setRecords(processedRecords)
            showToast({
                title: 'Success',
                description: `Loaded ${processedRecords.length} records`,
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
    }, [engine, selectedOrgUnit, selectedPeriod, showToast])

    // Load records when period or org unit changes
    useEffect(() => {
        if (selectedOrgUnit && selectedPeriod) {
            fetchRecords()
        }
    }, [selectedOrgUnit, selectedPeriod, fetchRecords])

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

    const formatDate = (dateString) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleDateString()
    }

    const handleRefresh = () => {
        fetchRecords()
    }

    const handleExport = () => {
        const csvContent = [
            ['System ID', 'UUIC', 'Family Name', 'Last Name', 'Sex', 'Age', 'Province', 'District', 'Risk Level', 'Event Date'],
            ...filteredRecords.map(record => [
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
        a.download = `sti-records-${selectedPeriod}.csv`
        a.click()
        window.URL.revokeObjectURL(url)

        showToast({
            title: 'Export Successful',
            description: 'Records exported to CSV file',
            variant: 'default'
        })
    }

    return (
        <div className="min-h-screen py-4 sm:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100">
                        <FileText className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Records List</h1>
                        <p className="text-gray-500 text-sm mt-1">View and manage all screening records</p>
                    </div>
                </div>

                {/* Filters */}
                <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center space-x-2">
                            <FiFilter className="w-5 h-5 text-gray-600" />
                            <span className="text-lg font-medium text-gray-900">Filters</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="w-4 h-4 text-gray-400" />
                            </div>
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by patient name, ID, or any field..."
                                className="pl-10 pr-4 h-10 bg-white border border-gray-300 rounded-md focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                            />
                        </div>

                        {/* Filter Controls */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Time Period Selector */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                                    <FiCalendar className="w-4 h-4 text-gray-500" />
                                    <span>Time Period</span>
                                </label>
                                
                                {/* Period Type Tabs */}
                                <div className="flex bg-gray-100 rounded-md p-1">
                                    <button
                                        onClick={() => setPeriodType('year')}
                                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                                            periodType === 'year' 
                                                ? 'bg-white text-gray-900 shadow-sm' 
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        Year
                                    </button>
                                    <button
                                        onClick={() => setPeriodType('quarter')}
                                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                                            periodType === 'quarter' 
                                                ? 'bg-white text-gray-900 shadow-sm' 
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        Quarter
                                    </button>
                                    <button
                                        onClick={() => setPeriodType('month')}
                                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                                            periodType === 'month' 
                                                ? 'bg-white text-gray-900 shadow-sm' 
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        Monthly
                                    </button>
                                </div>
                                
                                {/* Period Selection */}
                                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                    <SelectTrigger className="h-10 bg-white border border-gray-300 rounded-md focus:border-gray-400 focus:ring-1 focus:ring-gray-400">
                                        <SelectValue placeholder={`Select ${periodType}`} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border border-gray-200 rounded-md max-h-60 w-64 shadow-lg">
                                        {periods.filter(p => p.type === periodType).map(period => (
                                            <SelectItem key={period.value} value={period.value} className="hover:bg-gray-50">
                                                {period.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Organization Unit Selector */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                                    <FiMapPin className="w-4 h-4 text-gray-500" />
                                    <span>Location</span>
                                </label>
                                <Select value={selectedOrgUnit} onValueChange={setSelectedOrgUnit}>
                                    <SelectTrigger className="h-10 bg-white border border-gray-300 rounded-md focus:border-gray-400 focus:ring-1 focus:ring-gray-400">
                                        <SelectValue placeholder="Select organization unit" />
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

                            {/* Action Buttons */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                                    <Activity className="w-4 h-4 text-gray-500" />
                                    <span>Actions</span>
                                </label>
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={handleRefresh}
                                        disabled={loading}
                                        variant="outline"
                                        className="flex-1 h-10 border border-gray-300 hover:bg-gray-50"
                                    >
                                        <FiRefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                        Refresh
                                    </Button>
                                    <Button
                                        onClick={handleExport}
                                        disabled={filteredRecords.length === 0}
                                        variant="outline"
                                        className="flex-1 h-10 border border-gray-300 hover:bg-gray-50"
                                    >
                                        <FiDownload className="w-4 h-4 mr-2" />
                                        Export
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Records Table */}
                <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <FiEye className="w-5 h-5 text-gray-600" />
                                <span className="text-lg font-medium text-gray-900">Screening Records</span>
                            </div>
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                {filteredRecords.length} Records
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center space-y-3">
                                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto"></div>
                                    <p className="text-sm text-gray-600">Loading records...</p>
                                </div>
                            </div>
                        ) : filteredRecords.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Records Found</h3>
                                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria.</p>
                                <Button 
                                    onClick={handleRefresh}
                                    variant="outline"
                                    className="border border-gray-300 hover:bg-gray-50"
                                >
                                    <FiRefreshCw className="w-4 h-4 mr-2" />
                                    Refresh
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Patient ID</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Name</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Gender</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Age</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Location</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Risk Level</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredRecords.map((record, index) => (
                                            <tr key={record.id || index} className="hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{record.systemId || '-'}</div>
                                                        <div className="text-xs text-gray-500">{record.uuic || 'No UUIC'}</div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="font-medium text-gray-900">
                                                        {record.familyName || ''} {record.lastName || ''}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                                        {record.sex || '-'}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4 text-gray-700">{record.age || '-'}</td>
                                                <td className="py-3 px-4">
                                                    <div className="text-sm text-gray-700">{record.province || '-'}</div>
                                                    <div className="text-xs text-gray-500">{record.district || '-'}</div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge variant="outline" className={getRiskLevelColor(record.riskScreeningResult)}>
                                                        {record.riskScreeningResult || record.riskLevel || 'Unknown'}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {formatDate(record.eventDate)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default RecordsList
