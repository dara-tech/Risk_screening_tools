import { useDataEngine } from '@dhis2/app-runtime'

// Canonical form structure order (used for preview and ordered rendering)
export const FORM_FIELD_ORDER = [
    'systemId', 'uuic', 'donor', 'ngo', 'familyName', 'lastName', 'sex', 'dateOfBirth', 'province', 'od', 'district', 'commune',
    'sexAtBirth', 'genderIdentity', 'sexualHealthConcerns', 'hadSexPast6Months',
    'partnerMale', 'partnerFemale', 'partnerTGW', 'partnerTGM', 'numberOfSexualPartners', 'past6MonthsPractices',
    'hivTestPast6Months', 'hivTestResult', 'riskScreeningResult',
    'sexWithHIVPartner', 'sexWithoutCondom', 'stiSymptoms', 'syphilisPositive',
    'receiveMoneyForSex', 'paidForSex', 'injectedDrugSharedNeedle', 'alcoholDrugBeforeSex', 'groupSexChemsex',
    'currentlyOnPrep', 'lastHivTestDate', 'abortion', 'forcedSex', 'riskScreeningScore', 'noneOfAbove', 'everOnPrep',
    'riskLevel'
]

export const FORM_FIELD_LABELS = {
    systemId: 'System ID',
    uuic: 'UUIC',
    donor: 'Donor',
    ngo: 'NGO',
    familyName: 'Family Name',
    lastName: 'Last Name',
    sex: 'Sex',
    dateOfBirth: 'Date of Birth',
    province: 'Province',
    od: 'OD',
    district: 'District',
    commune: 'Commune',
    sexAtBirth: 'Sex at Birth',
    genderIdentity: 'Gender Identity',
    sexualHealthConcerns: 'Sexual Health Concerns',
    hadSexPast6Months: 'Had Sex Past 6 Months',
    partnerMale: 'Partner Male',
    partnerFemale: 'Partner Female',
    partnerTGW: 'Partner TGW',
    partnerTGM: 'Partner TGM',
    numberOfSexualPartners: 'Number of Sexual Partners',
    past6MonthsPractices: 'Past 6 Months Practices',
    hivTestPast6Months: 'HIV Test Past 6 Months',
    hivTestResult: 'HIV Test Result',
    riskScreeningResult: 'Risk Screening Result',
    sexWithHIVPartner: 'Sex with HIV Partner',
    sexWithoutCondom: 'Sex without Condom',
    stiSymptoms: 'STI Symptoms',
    syphilisPositive: 'Syphilis Positive',
    receiveMoneyForSex: 'Receive Money for Sex',
    paidForSex: 'Paid for Sex',
    injectedDrugSharedNeedle: 'Injected Drug Shared Needle',
    alcoholDrugBeforeSex: 'Alcohol/Drug Before Sex',
    groupSexChemsex: 'Group Sex / Chemsex',
    currentlyOnPrep: 'Currently on PrEP',
    lastHivTestDate: 'Last HIV Test Date',
    abortion: 'Abortion',
    forcedSex: 'Forced Sex',
    riskScreeningScore: 'Risk Screening Score',
    noneOfAbove: 'None of Above',
    everOnPrep: 'Ever on PrEP',
    riskLevel: 'Risk Level'
}

export const FORM_FIELD_LABELS_KH = {
    systemId: 'លេខសម្គាល់ប្រព័ន្ធ',
    uuic: 'លេខកូដអតិថិជន (UUIC)',
    donor: 'អ្នកឧបត្ថម្ភ',
    ngo: 'អង្គការ (NGO)',
    familyName: 'ឈ្មោះ (នាមខ្លួន)',
    lastName: 'នាមត្រកូល',
    sex: 'ភេទ',
    dateOfBirth: 'ថ្ងៃខែឆ្នាំកំណើត',
    province: 'ខេត្ត',
    od: 'ស្រុកសុខាភិបាល (OD)',
    district: 'ស្រុក/ក្រុង',
    commune: 'ឃុំ/សង្កាត់',
    sexAtBirth: '១. តើភេទពីកំណើតរបស់អ្នកជាអ្វី?',
    genderIdentity: '២. តើអ្នកកំណត់អត្តសញ្ញាណភេទរបស់អ្នកយ៉ាងដូចម្តេច?',
    sexualHealthConcerns: '៣. តើអ្នកធ្លាប់ព្រួយបារម្ភអំពីសុខភាពផ្លូវភេទដែរឬទេ?',
    hadSexPast6Months: '៤. តើអ្នកធ្លាប់រួមភេទក្នុង៦ខែចុងក្រោយដែរឬទេ?',
    partnerMale: '៤.១ ដៃគូរបស់អ្នកមានអត្តសញ្ញាណជា ប្រុស',
    partnerFemale: '៤.២ ដៃគូរបស់អ្នកមានអត្តសញ្ញាណជា ស្រី',
    partnerTGW: '៤.៣ ដៃគូរបស់អ្នកមានអត្តសញ្ញាណជា TGW',
    partnerTGM: '៤.៤ ដៃគូរបស់អ្នកមានអត្តសញ្ញាណជា TGM',
    numberOfSexualPartners: '៥. តើអ្នកមានដៃគូរួមភេទប៉ុន្មាននាក់?',
    past6MonthsPractices: '៦. ក្នុង៦ខែចុងក្រោយ តើអ្នកធ្លាប់មានអាកប្បកិរិយាខាងក្រោមដែរឬទេ?',
    hivTestPast6Months: '៧. តើអ្នកធ្លាប់ធ្វើតេស្ត HIV ក្នុង៦ខែចុងក្រោយដែរឬទេ?',
    hivTestResult: '៨. លទ្ធផលតេស្ត HIV របស់អ្នកជាអ្វី?',
    riskScreeningResult: 'លទ្ធផលវាស់វែងហានិភ័យ',
    sexWithHIVPartner: 'តើអ្នកធ្លាប់រួមភេទជាមួយដៃគូដែលដឹងថាមានមេរោគ HIV ដែរឬទេ?',
    sexWithoutCondom: 'តើអ្នកធ្លាប់រួមភេទដោយគ្មានកុងដុំដែរឬទេ?',
    stiSymptoms: 'តើអ្នកមានរោគសញ្ញាជំងឺឆ្លងតាមផ្លូវភេទដែរឬទេ?',
    syphilisPositive: 'តើអ្នកធ្លាប់តេស្តស៊ីភីលីសវិជ្ជមានដែរឬទេ?',
    receiveMoneyForSex: 'តើអ្នកធ្លាប់ទទួលប្រាក់ ឬទំនិញសម្រាប់រួមភេទដែរឬទេ?',
    paidForSex: 'តើអ្នកធ្លាប់បង់ប្រាក់ដើម្បីរួមភេទដែរឬទេ?',
    injectedDrugSharedNeedle: 'តើអ្នកធ្លាប់ចាក់ថ្នាំដោយប្រើម្ជុលរួមដែរឬទេ?',
    alcoholDrugBeforeSex: 'តើអ្នកធ្លាប់ប្រើស្រា ឬគ្រឿងញៀនមុនរួមភេទដែរឬទេ?',
    groupSexChemsex: 'តើអ្នកធ្លាប់រួមភេទជាក្រុម ឬ chemsex ដែរឬទេ?',
    currentlyOnPrep: 'តើអ្នកកំពុងប្រើប្រាស់ PrEP ដែរឬទេ?',
    lastHivTestDate: 'ថ្ងៃធ្វើតេស្ត HIV ចុងក្រោយ',
    abortion: 'តើអ្នកធ្លាប់រំលូតកូនដែរឬទេ?',
    forcedSex: 'តើអ្នកធ្លាប់ត្រូវបង្ខំឱ្យរួមភេទទាស់នឹងឆន្ទៈក្នុង៦ខែចុងក្រោយដែរឬទេ?',
    riskScreeningScore: 'ពិន្ទុវាស់វែងហានិភ័យ',
    noneOfAbove: 'គ្មានអ្វីខាងលើ',
    everOnPrep: 'តើអ្នកធ្លាប់ប្រើប្រាស់ PrEP ដែរឬទេ?',
    riskLevel: 'កម្រិតហានិភ័យ'
}

export const TEMPLATE_COLUMNS = [
    { key: 'systemId', dataKey: 'systemId', labelEn: 'System ID', labelKh: 'System ID' },
    { key: 'displayNo', dataKey: null, labelEn: 'No', labelKh: 'ល.រ' },
    { key: 'displayMonth', dataKey: null, labelEn: 'Month', labelKh: 'ខែ' },
    { key: 'displayYear', dataKey: null, labelEn: 'Year', labelKh: 'ឆ្នាំ' },
    { key: 'donor', dataKey: 'donor', labelEn: 'Donor', labelKh: 'ម្ចាស់ជំនួយ' },
    { key: 'ngo', dataKey: 'ngo', labelEn: 'NGO', labelKh: 'អង្គការ' },
    { key: 'province', dataKey: 'province', labelEn: 'Province', labelKh: 'ខេត្ត' },
    { key: 'od', dataKey: 'od', labelEn: 'Operational District', labelKh: 'ស្រុកប្រតិបត្តិ' },
    { key: 'district', dataKey: 'district', labelEn: 'District', labelKh: 'ស្រុក/ខណ្ឌ' },
    { key: 'lastHivTestDate', dataKey: 'lastHivTestDate', labelEn: 'Event Date', labelKh: 'កាលបរិច្ឆេទ (ថ្ងៃ ខែ ឆ្នាំ)' },
    { key: 'commune', dataKey: 'commune', labelEn: 'Commune', labelKh: 'ឃុំ/សង្កាត់' },
    { key: 'uuic', dataKey: 'uuic', labelEn: 'UUIC', labelKh: 'UUIC' },
    { key: 'lastName', dataKey: 'lastName', labelEn: 'Last Name', labelKh: 'នាមត្រកូល' },
    { key: 'familyName', dataKey: 'familyName', labelEn: 'Family Name', labelKh: 'នាមខ្លួន' },
    { key: 'sex', dataKey: 'sex', labelEn: 'Sex', labelKh: 'ភេទ' },
    { key: 'dateOfBirth', dataKey: 'dateOfBirth', labelEn: 'Date of Birth', labelKh: 'ថ្ងៃ ខែ ឆ្នាំកំណើត' },
    { key: 'genderIdentity', dataKey: 'genderIdentity', labelEn: 'Gender Identity', labelKh: 'អត្តសញ្ញាណភេទ' },
    { key: 'sexualHealthConcerns', dataKey: 'sexualHealthConcerns', labelEn: 'Sexual Health Concerns', labelKh: 'ក្នុងរយៈពេល ៦ខែចុងក្រោយនេះ តើអ្នកធ្លាប់បារម្ភអំពីសុខភាពផ្លូវភេទរបស់អ្នកដែរឬទេ?' },
    { key: 'hadSexPast6Months', dataKey: 'hadSexPast6Months', labelEn: 'Had Sex Past 6 Months', labelKh: 'ក្នុងរយៈពេល ៦ខែចុងក្រោយនេះ តើអ្នកធ្លាប់បានរួមភេទ (តាមមាត់ ទ្វារមាស ឬតាមរុន្ធគូទ) ដែរឬទេ?' },
    { key: 'partnerMale', dataKey: 'partnerMale', labelEn: 'Partner Male', labelKh: '១. ប្រុស' },
    { key: 'partnerFemale', dataKey: 'partnerFemale', labelEn: 'Partner Female', labelKh: '២. ស្រី' },
    { key: 'partnerTGW', dataKey: 'partnerTGW', labelEn: 'Partner TGW', labelKh: '៣. អ្នកប្លែងភេទ​ស្រី' },
    { key: 'partnerTGM', dataKey: 'partnerTGM', labelEn: 'Partner TGM', labelKh: '៤. អ្នកប្លែងភេទ​ប្រុស' },
    { key: 'numberOfSexualPartners', dataKey: 'numberOfSexualPartners', labelEn: 'Number of Sexual Partners', labelKh: 'ជាមធ្យម តើអ្នកមានដៃគូរួមភេទផ្សេងគ្នាចំនួនប៉ុន្មាននាក់?' },
    { key: 'sexWithHIVPartner', dataKey: 'sexWithHIVPartner', labelEn: 'Sex with HIV Partner', labelKh: '១. ដៃគូរួមភេទមានផ្ទុកមេរោគអេដស៍' },
    { key: 'sexWithoutCondom', dataKey: 'sexWithoutCondom', labelEn: 'Sex without Condom', labelKh: '២. រួមភេទដោយមិនបានប្រើស្រោមអនាម័យ' },
    { key: 'stiSymptoms', dataKey: 'stiSymptoms', labelEn: 'STI Symptoms', labelKh: '៣. ធ្លាប់មាន/កំពុងមានជំងឺកាមរោគ' },
    { key: 'syphilisPositive', dataKey: 'syphilisPositive', labelEn: 'Syphilis Positive', labelKh: '៤. មានលទ្ធផលតេស្តមេរោគស្វាយវិជ្ជមាន' },
    { key: 'receiveMoneyForSex', dataKey: 'receiveMoneyForSex', labelEn: 'Receive Money for Sex', labelKh: '៥. ធ្លាប់លក់ ឬដូរយកទំនិញក្នុងសេវាផ្លូវភេទ' },
    { key: 'paidForSex', dataKey: 'paidForSex', labelEn: 'Paid for Sex', labelKh: '៦. ធ្លាប់ទិញសេវាផ្លូវភេទ' },
    { key: 'injectedDrugSharedNeedle', dataKey: 'injectedDrugSharedNeedle', labelEn: 'Injected Drug Shared Needle', labelKh: '៧. ធ្លាប់ចាក់សារធាតុញៀន ឬប្រើម្ជុលរួមគ្នា' },
    { key: 'alcoholDrugBeforeSex', dataKey: 'alcoholDrugBeforeSex', labelEn: 'Alcohol/Drug Before Sex', labelKh: '៨. ធ្លាប់ប្រើគ្រឿងស្រវឹង ឬសារធាតុញៀនមុនពេលរួមភេទ' },
    { key: 'groupSexChemsex', dataKey: 'groupSexChemsex', labelEn: 'Group Sex/Chemsex', labelKh: '១០. ចូលរួមសកម្មភាពរួមភេទជាក្រុម ឬប្រើប្រាស់ថ្នាំជម្រុញចំណង់ផ្លូវភេទ' },
    { key: 'noneOfAbove', dataKey: 'noneOfAbove', labelEn: 'None of Above', labelKh: '១១. មិនមានចំណុចទាំងអស់ខាងលើទេ' },
    { key: 'forcedSex', dataKey: 'forcedSex', labelEn: 'Forced Sex', labelKh: 'ក្នុងរយៈពេល ៦ខែ ចុងក្រោយ តើអ្នកធ្លាប់ត្រូវបានគេបង្ខំដើម្បីការរួមភេទ​ដែរឬទេ?' },
    { key: 'everOnPrep', dataKey: 'everOnPrep', labelEn: 'Ever on PrEP', labelKh: 'តើអ្នកធ្លាប់ប្រើប្រាស់ PrEP ដែរឬទេ?' },
    { key: 'currentlyOnPrep', dataKey: 'currentlyOnPrep', labelEn: 'Currently on PrEP', labelKh: 'តើអ្នកកំពុងប្រើប្រាស់ PrEP ដែរឬទេ?' },
    { key: 'hivTestPast6Months', dataKey: 'hivTestPast6Months', labelEn: 'HIV Test Past 6 Months', labelKh: 'តើអ្នកធ្លាប់ធ្វើតេស្តរកមេរោគអេដស៍ដែរឬទេក្នុងរយៈពេល ៦ខែ ចុងក្រោយ?' },
    { key: 'hivTestResult', dataKey: 'hivTestResult', labelEn: 'HIV Test Result', labelKh: 'តើលទ្ធផលនៃការធ្វើតេស្តដូចម្តេចដែរ ប្រសិនបើអ្នកអាចប្រាប់បាន?' }
]

// Toggle verbose import logging here
const IS_DEBUG = false

/**
 * Fetch option sets from DHIS2
 */
export const fetchOptionSets = async (engine) => {
    try {
        const response = await engine.query({
            optionSets: {
                resource: 'optionSets',
                params: {
                    fields: 'id,name,options[id,name,code]',
                    paging: false
                }
            }
        })
        
        const optionSets = response.optionSets.optionSets || []
        
        // Create a map for easy lookup
        const optionSetMap = {}
        optionSets.forEach(optionSet => {
            optionSetMap[optionSet.id] = {
                id: optionSet.id,
                name: optionSet.name,
                options: optionSet.options || []
            }
        })
        
        return optionSetMap
    } catch (error) {
        return {}
    }
}

/**
 * Fetch data elements with their option sets
 */
export const fetchDataElementsWithOptions = async (engine) => {
    try {
        const response = await engine.query({
            dataElements: {
                resource: 'dataElements',
                params: {
                    fields: 'id,name,shortName,valueType,optionSet[id,name],categoryCombo[id,name]',
                    paging: false
                }
            }
        })
        
        const dataElements = response.dataElements.dataElements || []
        
        return dataElements
    } catch (error) {
        return []
    }
}

/**
 * Get options for a specific data element
 */
export const getOptionsForDataElement = async (engine, dataElementId) => {
    try {
        const response = await engine.query({
            dataElement: {
                resource: 'dataElements',
                id: dataElementId,
                params: {
                    fields: 'id,name,optionSet[id,name,options[id,name,code]]'
                }
            }
        })
        
        const dataElement = response.dataElement
        if (dataElement.optionSet) {
            return dataElement.optionSet.options || []
        }
        
        return []
    } catch (error) {
        return []
    }
}

/**
 * Fetch program stage data elements with their option sets
 */
export const fetchProgramStageDataElementsWithOptions = async (engine, programStageId) => {
    try {
        const response = await engine.query({
            programStage: {
                resource: 'programStages',
                id: programStageId,
                params: {
                    fields: 'id,name,programStageDataElements[dataElement[id,name,shortName,valueType,optionSet[id,name,options[id,name,code]]]]'
                }
            }
        })
        
        const stageData = response.programStage
        const dataElements = stageData?.programStageDataElements || []
        
        // Create a map of data element ID to options
        const dataElementOptions = {}
        
        for (const psde of dataElements) {
            const dataElement = psde.dataElement
            if (dataElement.optionSet) {
                dataElementOptions[dataElement.id] = dataElement.optionSet.options || []
            }
        }
        
        return {
            dataElements,
            dataElementOptions
        }
    } catch (error) {
        return { dataElements: [], dataElementOptions: {} }
    }
}

/**
 * Get form field options based on data element mapping
 */
export const getFormFieldOptions = async (engine, fieldName, dataElementMapping) => {
    try {
        // Find the data element ID for this field
        const dataElementId = dataElementMapping[fieldName]
        if (!dataElementId) {
            return []
        }
        
        // Fetch options for this data element
        const options = await getOptionsForDataElement(engine, dataElementId)
        return options
    } catch (error) {
        return []
    }
}

/**
 * Find existing TEI by System ID or UUIC to avoid duplicate conflicts
 */
const findExistingTei = async (engine, orgUnitId, config, data) => {
    try {
        const systemIdAttr = config.mapping.trackedEntityAttributes.System_ID
        const uuicAttr = config.mapping.trackedEntityAttributes.UUIC
        const programId = config.program.id
        
        
        // Build base params - orgUnit is required by DHIS2
        if (!orgUnitId) {
            return null
        }
        const baseParams = {
            program: programId,
            ou: orgUnitId,
            fields: 'trackedEntityInstance',
            paging: false
        }

        // Try System ID first
        if (data.systemId && systemIdAttr) {
            try {
                const resp = await engine.query({
                    teis: {
                        resource: 'trackedEntityInstances',
                        params: {
                            ...baseParams,
                            filter: `${systemIdAttr}:EQ:${data.systemId}`
                        }
                    }
                })
                const rows = resp?.teis?.trackedEntityInstances || []
                if (rows.length > 0) {
                    const teiId = rows[0].trackedEntityInstance
                    return teiId
                }
            } catch (e) {
            }
        }
        
        // Try UUIC if System ID not found
        if (data.uuic && uuicAttr) {
            try {
                const resp = await engine.query({
                    teis: {
                        resource: 'trackedEntityInstances',
                        params: {
                            ...baseParams,
                            filter: `${uuicAttr}:EQ:${data.uuic}`
                        }
                    }
                })
                const rows = resp?.teis?.trackedEntityInstances || []
                if (rows.length > 0) {
                    const teiId = rows[0].trackedEntityInstance
                    return teiId
                }
            } catch (e) {
            }
        }
        
        return null
    } catch (e) {
        return null
    }
}

/**
 * Find existing TEI across all orgUnits the user has access to
 * Used as fallback when 409 conflict occurs but lookup with specific orgUnit fails
 * Note: DHIS2 requires at least one orgUnit, so we use orgUnitId but search within user hierarchy
 */
const findExistingTeiAcrossOrgUnits = async (engine, orgUnitId, config, data) => {
    try {
        const systemIdAttr = config.mapping.trackedEntityAttributes.System_ID
        const uuicAttr = config.mapping.trackedEntityAttributes.UUIC
        const programId = config.program.id
        
        if (!orgUnitId) {
            return null
        }
        
        // Try System ID first - use orgUnitId but search within user hierarchy
        if (data.systemId && systemIdAttr) {
            try {
                const resp = await engine.query({
                    teis: {
                        resource: 'trackedEntityInstances',
                        params: {
                            filter: `${systemIdAttr}:EQ:${data.systemId}`,
                            ou: orgUnitId, // Required by DHIS2, but withinUserHierarchy expands search
                            program: programId,
                            withinUserHierarchy: true, // Search across all accessible orgUnits
                            fields: 'trackedEntityInstance',
                            paging: false
                        }
                    }
                })
                const rows = resp?.teis?.trackedEntityInstances || []
                if (rows.length > 0) {
                    const teiId = rows[0].trackedEntityInstance
                    return teiId
                }
            } catch (e) {
            }
        }
        
        // Try UUIC if System ID not found
        if (data.uuic && uuicAttr) {
            try {
                const resp = await engine.query({
                    teis: {
                        resource: 'trackedEntityInstances',
                        params: {
                            filter: `${uuicAttr}:EQ:${data.uuic}`,
                            ou: orgUnitId, // Required by DHIS2, but withinUserHierarchy expands search
                            program: programId,
                            withinUserHierarchy: true, // Search across all accessible orgUnits
                            fields: 'trackedEntityInstance',
                            paging: false
                        }
                    }
                })
                const rows = resp?.teis?.trackedEntityInstances || []
                if (rows.length > 0) {
                    const teiId = rows[0].trackedEntityInstance
                    return teiId
                }
            } catch (e) {
            }
        }
        
        return null
    } catch (e) {
        return null
    }
}

/**
 * Find existing TEI without program filter (last resort)
 * Used when all other lookup strategies fail but 409 conflict indicates TEI exists
 */
const findExistingTeiWithoutProgram = async (engine, orgUnitId, config, data) => {
    try {
        const systemIdAttr = config.mapping.trackedEntityAttributes.System_ID
        const uuicAttr = config.mapping.trackedEntityAttributes.UUIC
        
        if (!orgUnitId) {
            return null
        }
        
        
        // Try System ID first - search without program filter
        if (data.systemId && systemIdAttr) {
            try {
                const resp = await engine.query({
                    teis: {
                        resource: 'trackedEntityInstances',
                        params: {
                            filter: `${systemIdAttr}:EQ:${data.systemId}`,
                            ou: orgUnitId,
                            fields: 'trackedEntityInstance',
                            paging: false
                        }
                    }
                })
                const rows = resp?.teis?.trackedEntityInstances || []
                if (rows.length > 0) {
                    const teiId = rows[0].trackedEntityInstance
                    return teiId
                }
            } catch (e) {
            }
        }
        
        // Try UUIC if System ID not found
        if (data.uuic && uuicAttr) {
            try {
                const resp = await engine.query({
                    teis: {
                        resource: 'trackedEntityInstances',
                        params: {
                            filter: `${uuicAttr}:EQ:${data.uuic}`,
                            ou: orgUnitId,
                            fields: 'trackedEntityInstance',
                            paging: false
                        }
                    }
                })
                const rows = resp?.teis?.trackedEntityInstances || []
                if (rows.length > 0) {
                    const teiId = rows[0].trackedEntityInstance
                    return teiId
                }
            } catch (e) {
            }
        }
        
        return null
    } catch (e) {
        return null
    }
}

/**
 * Find existing enrollment for a TEI in a program
 */
const findExistingEnrollment = async (engine, teiId, programId) => {
    try {
        const resp = await engine.query({
            enrollments: {
                resource: 'enrollments',
                params: {
                    trackedEntityInstance: teiId,
                    program: programId,
                    fields: 'enrollment',
                    paging: false
                }
            }
        })
        const enrollments = resp?.enrollments?.enrollments || []
        if (enrollments.length > 0) {
            const enrollmentId = enrollments[0].enrollment
            return enrollmentId
        }
        return null
    } catch (e) {
        return null
    }
}

/**
 * Fetch allowed TEI attribute IDs from the program configuration
 */
const fetchProgramTeAttributeIds = async (engine, programId) => {
    try {
        const resp = await engine.query({
            program: {
                resource: 'programs',
                id: programId,
                params: {
                    fields: 'id,programTrackedEntityAttributes[trackedEntityAttribute[id]]'
                }
            }
        })
        const list = resp?.program?.programTrackedEntityAttributes || []
        const ids = new Set(list.map(p => p?.trackedEntityAttribute?.id).filter(Boolean))
        return ids
    } catch (e) {
        return new Set()
    }
}

/**
 * Process CSV data for import - similar to manual input workflow
 */
export const processCSVForImport = async (csvText, engine, config) => {
    try {
        const lines = csvText.trim().split(/\r?\n/)
        const headers = lines[0].split(',').map(h => h.trim())
        const data = []
        
        // Flexible header mapping: support "simple download" (DHIS2 question-style) headers and template headers
        const normalizeHeader = (s) => (s || '')
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[^a-z0-9]/g, '')

        const headerSynonyms = {
            systemId: [
                'System ID', 'System_ID', 'SystemID', 'System-Id'
            ],
            uuic: [
                'UUIC'
            ],
            donor: [
                'Donor'
            ],
            ngo: [
                'NGO'
            ],
            familyName: [
                'Family Name', 'Fname', 'FamilyName'
            ],
            lastName: [
                'Last Name', 'Lname', 'LastName'
            ],
            sex: [
                'Sex'
            ],
            dateOfBirth: [
                'Date of Birth', 'DOB', 'DateOfBirth'
            ],
            province: [
                'Province'
            ],
            od: [
                'OD', 'Operational District', 'OperationalDistrict'
            ],
            district: [
                'District'
            ],
            commune: [
                'Commune'
            ],
            sexAtBirth: [
                'Sex at Birth', '1. What is your sex at birth?'
            ],
            genderIdentity: [
                'Gender Identity', '2. How do you identify your gender?'
            ],
            sexualHealthConcerns: [
                'Sexual Health Concerns', '3. Have you ever concerns/worries about your sexual health?'
            ],
            hadSexPast6Months: [
                'Had Sex Past 6 Months', '3.Used to have sex in the past 6months?'
            ],
            partnerMale: [
                "Partner Male", "4.1Your partner's sexual identify is Male"
            ],
            partnerFemale: [
                "Partner Female", "4.2Your partner's sexual identify is Female"
            ],
            partnerTGW: [
                "Partner TGW", "4.3Your partner's sexual identify is TGW"
            ],
            partnerTGM: [
                "Partner TGM", "4.4Your partner's sexual identify is TGM"
            ],
            numberOfSexualPartners: [
                'Number of Sexual Partners', '5.How many sexual partner do you have?'
            ],
            past6MonthsPractices: [
                'Past 6 Months Practices', '4.Have had the following practice in the past 6months?'
            ],
            hivTestPast6Months: [
                'HIV Test Past 6 Months', '11.Had test for HIV in past 6 months?'
            ],
            hivTestResult: [
                'HIV Test Result', '12.Result of HIV test if you can tell?'
            ],
            riskScreeningResult: [
                'Risk Screening Result', 'Risk screening result'
            ],
            sexWithHIVPartner: [
                'Sex with HIV Partner', '6.3 Sex with known HIV+ partner(s)'
            ],
            sexWithoutCondom: [
                'Sex without Condom', '6.4 Sex without a condom'
            ],
            stiSymptoms: [
                'STI Symptoms', '6.5 Have a STI symptom'
            ],
            syphilisPositive: [
                'Syphilis Positive', '4.4 Tested syphilis positive'
            ],
            receiveMoneyForSex: [
                'Receive Money for Sex', '6.1 Receive money or goods for sex'
            ],
            paidForSex: [
                'Paid for Sex', '6.2 Paid for sex'
            ],
            injectedDrugSharedNeedle: [
                'Injected Drug Shared Needle', '6.9 Injected drug/shared needle'
            ],
            alcoholDrugBeforeSex: [
                'Alcohol Drug Before Sex', '6.7 Alcohol/drug before sex'
            ],
            groupSexChemsex: [
                'Group Sex Chemsex', '6.8 Joint high fun or group sex or chemsex'
            ],
            currentlyOnPrep: [
                'Currently on PrEP', '9. Currently on PrEP'
            ],
            lastHivTestDate: [
                'Last HIV Test Date', '11. When did your last HIV test?'
            ],
            abortion: [
                'Abortion', '6.6 Abortion'
            ],
            forcedSex: [
                'Forced Sex', '7. Have you ever forced to have sex against your wishes in past 6 months'
            ],
            riskScreeningScore: [
                'Risk Screening Score', 'Risk screening score'
            ],
            noneOfAbove: [
                'None of Above', '6.10 Non-Above'
            ],
            everOnPrep: [
                'Ever on PrEP', '10.Have you ever on PrEP'
            ]
        }

        // Build normalized lookup map
        const normalizedLookup = {}
        Object.entries(headerSynonyms).forEach(([fieldKey, labels]) => {
            labels.forEach(label => {
                normalizedLookup[normalizeHeader(label)] = fieldKey
            })
        })

        const expectedTranslationRow = TEMPLATE_COLUMNS.map(col => (col.labelKh || FORM_FIELD_LABELS_KH[col.dataKey ?? col.key] || '').trim())

        // Process each row
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i]
            if (!row.trim()) continue
            
            const cells = row.split(',').map(c => c.trim().replace(/^"|"$/g, ''))

            // Skip Khmer translation row if present
            if (
                cells.length === expectedTranslationRow.length &&
                cells.every((cell, idx) => cell.trim() === expectedTranslationRow[idx])
            ) {
                continue
            }
            const rowData = {}
            
            // Map headers to data (flexible, case/format-insensitive)
            headers.forEach((header, index) => {
                const norm = normalizeHeader(header)
                const fieldKey = normalizedLookup[norm]
                if (fieldKey) {
                    rowData[fieldKey] = cells[index] || ''
                }
            })
            
            // Validate and transform data (like manual input validation)
            const validatedData = await validateAndTransformRowData(rowData, i, config)
            if (validatedData) {
                data.push(validatedData)
            }
        }
        
        return {
            success: true,
            data,
            totalRows: lines.length - 1,
            processedRows: data.length
        }
    } catch (error) {
        return {
            success: false,
            error: error.message,
            data: []
        }
    }
}

/**
 * Validate and transform row data - similar to manual input validation
 */
export const validateAndTransformRowData = async (rowData, rowNumber, config) => {
    const errors = []
    const warnings = []
    
    // Required field validation (matching manual input requirements)
    const requiredFields = config.validation.requiredFields
    const headerToFieldMapping = {
        'System ID': 'systemId',
        'UUIC': 'uuic',
        'Family Name': 'familyName',
        'Last Name': 'lastName',
        'Sex': 'sex',
        'Date of Birth': 'dateOfBirth',
        'Province': 'province',
        'OD': 'od',
        'District': 'district',
        'Commune': 'commune'
    }
    
    requiredFields.forEach(field => {
        const fieldKey = headerToFieldMapping[field]
        if (!fieldKey) {
            return
        }
        if (!rowData[fieldKey] || rowData[fieldKey].trim() === '') {
            errors.push(`Row ${rowNumber}: Missing required field "${field}"`)
        }
    })
    
    // Data type validation and transformation
    const transformedData = { ...rowData }
    
    // Date validation
    if (transformedData.dateOfBirth) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!dateRegex.test(transformedData.dateOfBirth)) {
            errors.push(`Row ${rowNumber}: Invalid date format for Date of Birth (use YYYY-MM-DD)`)
        }
    }
    
    // Age calculation (like manual input)
    if (transformedData.dateOfBirth) {
        const age = calculateAge(transformedData.dateOfBirth)
        transformedData.age = age
    }
    
    // Number validation
    if (transformedData.numberOfSexualPartners) {
        const num = parseInt(transformedData.numberOfSexualPartners)
        if (isNaN(num) || num < 0) {
            errors.push(`Row ${rowNumber}: Invalid number of sexual partners`)
        }
    }
    
    if (transformedData.riskScreeningScore) {
        const score = parseInt(transformedData.riskScreeningScore)
        if (isNaN(score) || score < 0) {
            errors.push(`Row ${rowNumber}: Invalid risk screening score`)
        }
    }
    
    // Boolean normalization (like manual input)
    const booleanFields = [
        'sexWithHIVPartner', 'sexWithoutCondom', 'stiSymptoms', 'syphilisPositive',
        'receiveMoneyForSex', 'paidForSex', 'injectedDrugSharedNeedle', 
        'alcoholDrugBeforeSex', 'groupSexChemsex', 'currentlyOnPrep', 
        'abortion', 'forcedSex', 'noneOfAbove', 'everOnPrep'
    ]
    
    booleanFields.forEach(field => {
        if (transformedData[field]) {
            const value = transformedData[field].toLowerCase()
            
            // Special handling for everOnPrep (boolean field: true/false, skip "Never Know")
            if (field === 'everOnPrep') {
                if (value === 'yes' || value === 'true' || value === '10' || value === '1') {
                    transformedData[field] = 'true'
                } else if (value === 'no' || value === 'false' || value === '11' || value === '0') {
                    transformedData[field] = 'false'
                } else if (value === 'never know' || value === 'neverknow' || value === '12' || value === 'unknown') {
                    transformedData[field] = ''
                    warnings.push(`Row ${rowNumber}: everOnPrep set to "Never Know" - field will be left blank`)
                } else {
                    warnings.push(`Row ${rowNumber}: Ambiguous everOnPrep value: ${transformedData[field]}`)
                }
            } else if (field === 'sexualHealthConcerns') {
                if (value === 'yes' || value === 'true' || value === '1') {
                    transformedData[field] = 'true'
                } else if (value === 'no' || value === 'false' || value === '0') {
                    transformedData[field] = 'false'
                } else {
                    warnings.push(`Row ${rowNumber}: Ambiguous sexualHealthConcerns value: ${transformedData[field]}`)
                }
            } else if (field === 'sexWithoutCondom') {
                if (value === 'yes' || value === 'true' || value === '1') {
                    transformedData[field] = 'true'
                } else if (value === 'no' || value === 'false' || value === '0') {
                    transformedData[field] = 'false'
                } else {
                    warnings.push(`Row ${rowNumber}: Ambiguous sexWithoutCondom value: ${transformedData[field]}`)
                }
            } else if (field === 'currentlyOnPrep') {
                if (value === 'yes' || value === 'true' || value === '1' || value === '10') {
                    transformedData[field] = 'true'
                } else if (value === 'no' || value === 'false' || value === '0') {
                    transformedData[field] = 'false'
                } else if (value === 'never know' || value === 'neverknow' || value === '12' || value === 'unknown') {
                    transformedData[field] = ''
                    warnings.push(`Row ${rowNumber}: currentlyOnPrep set to "Never Know" - field will be left blank`)
                } else {
                    warnings.push(`Row ${rowNumber}: Ambiguous currentlyOnPrep value: ${transformedData[field]}`)
                }
            } else {
                // Convert to numeric: true -> 1, false -> 0 (for other boolean fields with numeric option sets)
                if (value === 'yes' || value === 'true' || value === '1') {
                    transformedData[field] = '1'
                } else if (value === 'no' || value === 'false' || value === '0') {
                    transformedData[field] = '0'
                } else {
                    warnings.push(`Row ${rowNumber}: Ambiguous boolean value for "${field}": ${transformedData[field]}`)
                }
            }
        }
    })
    
    // Generate unique IDs if missing (like manual input)
    if (!transformedData.systemId) {
        const timestamp = Date.now()
        const uniqueId = Math.floor(Math.random() * 10000)
        transformedData.systemId = `SYS_${timestamp}_${uniqueId}_${rowNumber}`
    }
    // Note: Don't modify existing System ID - let findExistingTei handle duplicates
    
    // Generate UUIC only if not provided
    if (!transformedData.uuic) {
        const timestamp = Date.now()
        const uniqueId = Math.floor(Math.random() * 10000)
        transformedData.uuic = `UUIC_${timestamp}_${uniqueId}_${rowNumber}`
    }
    // Note: Don't modify existing UUIC - let findExistingTei handle duplicates
    
    // Risk calculation (like manual input)
    const riskData = calculateRiskScoreFromData(transformedData)
    Object.assign(transformedData, riskData)
    
    return {
        data: transformedData,
        errors,
        warnings,
        isValid: errors.length === 0
    }
}

/**
 * Calculate age from date of birth (like manual input)
 */
export const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return ''
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return age.toString()
}

/**
 * Calculate risk score from data (like manual input calculation)
 */
export const calculateRiskScoreFromData = (data) => {
    let score = 0
    const riskFactors = []

    if (data.riskScreeningScore && data.riskScreeningScore > 0) {
        score = parseInt(data.riskScreeningScore)
    } else {
        if (data.numberOfSexualPartners && parseInt(data.numberOfSexualPartners) >= 3) {
            score += 10
            riskFactors.push('Multiple sexual partners')
        }
        if (data.sexWithoutCondom === 'true') {
            score += 15
            riskFactors.push('No condom use')
        }
        if (data.sexWithHIVPartner === 'true') {
            score += 20
            riskFactors.push('Sex with HIV+ partner')
        }
        if (data.stiSymptoms === 'true') {
            score += 15
            riskFactors.push('STI symptoms')
        }
        if (data.syphilisPositive === 'true') {
            score += 15
            riskFactors.push('Syphilis positive')
        }
        if (data.hivTestResult === 'Positive') {
            score += 25
            riskFactors.push('HIV positive')
        }
        if (data.injectedDrugSharedNeedle === 'true') {
            score += 20
            riskFactors.push('Needle sharing')
        }
        if (data.alcoholDrugBeforeSex === 'true') {
            score += 12
            riskFactors.push('Drug use before sex')
        }
        if (data.groupSexChemsex === 'true') {
            score += 15
            riskFactors.push('Chemsex')
        }
        if (data.receiveMoneyForSex === 'true') {
            score += 20
            riskFactors.push('Sex work')
        }
        if (data.paidForSex === 'true') {
            score += 12
            riskFactors.push('Paid for sex')
        }
        if (data.forcedSex === 'true') {
            score += 8
            riskFactors.push('Forced sex')
        }
    }

    let riskLevel = 'Low'
    if (score >= 50) riskLevel = 'Very High'
    else if (score >= 35) riskLevel = 'High'
    else if (score >= 20) riskLevel = 'Medium'
    else if (score >= 10) riskLevel = 'Low'
    else riskLevel = 'Very Low'

    const recommendations = []
    if (score >= 20) recommendations.push('Regular STI testing recommended')
    if (data.sexWithoutCondom === 'true') recommendations.push('Condom use education needed')
    if (data.hivTestResult === 'Unknown' || !data.hivTestResult) recommendations.push('HIV testing recommended')
    if (data.injectedDrugSharedNeedle === 'true') recommendations.push('Substance use counseling recommended')
    if (score >= 35) recommendations.push('Consider PrEP for HIV prevention')
    if (data.currentlyOnPrep === 'false' && score >= 20) recommendations.push('Consider PrEP for HIV prevention')

    return { 
        riskScore: score, 
        riskLevel, 
        riskFactors, 
        recommendations,
        riskScreeningScore: score,
        riskScreeningResult: riskLevel  // Add riskScreeningResult mapped to riskLevel
    }
}

/**
 * Create DHIS2 payload from processed data (like manual input save)
 */
export const createDHIS2Payload = (data, orgUnitId, config) => {
    // Prepare tracked entity attributes (like manual input)
    const attributes = []
    const teiMappings = {
        systemId: config.mapping.trackedEntityAttributes.System_ID,
        uuic: config.mapping.trackedEntityAttributes.UUIC,
        donor: config.mapping.trackedEntityAttributes.Donor,
        ngo: config.mapping.trackedEntityAttributes.NGO,
        familyName: config.mapping.trackedEntityAttributes.Family_Name,
        lastName: config.mapping.trackedEntityAttributes.Last_Name,
        sex: config.mapping.trackedEntityAttributes.Sex,
        dateOfBirth: config.mapping.trackedEntityAttributes.DOB,
        province: config.mapping.trackedEntityAttributes.Province,
        od: config.mapping.trackedEntityAttributes.OD,
        district: config.mapping.trackedEntityAttributes.District,
        commune: config.mapping.trackedEntityAttributes.Commune
    }

    // Include all mapped TEI attributes; ensure IDs match program/TET configuration

    Object.entries(teiMappings).forEach(([key, attrId]) => {
        // Validate attribute ID format (should be 11 characters)
        if (attrId && attrId.match(/^[a-zA-Z0-9]{11}$/) && data[key]) {
            attributes.push({ attribute: attrId, value: String(data[key]) })
        } else if (attrId && !attrId.match(/^[a-zA-Z0-9]{11}$/)) {
        } else if (attrId && !data[key]) {
        }
    })

    // Create TEI payload
    const teiPayload = {
        trackedEntityInstances: [{
            trackedEntityType: config.program.trackedEntityType,
            orgUnit: orgUnitId,
            attributes
        }]
    }

    return { teiPayload, attributes }
}

/**
 * Create program stage data values (like manual input)
 */
export const createProgramStageDataValues = (data, config) => {
    const dataValues = []
    const usedDataElements = new Set() // Track used data elements to prevent duplicates
    const eventMappings = {
        sexAtBirth: config.mapping.programStageDataElements.sexAtBirth,
        genderIdentity: config.mapping.programStageDataElements.genderIdentity,
        sexualHealthConcerns: config.mapping.programStageDataElements.sexualHealthConcerns,
        hadSexPast6Months: config.mapping.programStageDataElements.hadSexPast6Months,
        partnerMale: config.mapping.programStageDataElements.partnerMale,
        partnerFemale: config.mapping.programStageDataElements.partnerFemale,
        partnerTGW: config.mapping.programStageDataElements.partnerTGW,
        partnerTGM: config.mapping.programStageDataElements.partnerTGM,
        numberOfSexualPartners: config.mapping.programStageDataElements.numberOfSexualPartners,
        averageNumberOfSexualPartners: config.mapping.programStageDataElements.averageNumberOfSexualPartners,
        past6MonthsPractices: config.mapping.programStageDataElements.past6MonthsPractices,
        sexWithoutCondom: config.mapping.programStageDataElements.sexWithoutCondom,
        sexWithHIVPartner: config.mapping.programStageDataElements.sexWithHIVPartner,
        stiSymptoms: config.mapping.programStageDataElements.stiSymptoms,
        hivTestPast6Months: config.mapping.programStageDataElements.hivTestPast6Months,
        hivTestResult: config.mapping.programStageDataElements.hivTestResult,
        lastHivTestDate: config.mapping.programStageDataElements.lastHivTestDate,
        currentlyOnPrep: config.mapping.programStageDataElements.currentlyOnPrep,
        everOnPrep: config.mapping.programStageDataElements.everOnPrep,
        receiveMoneyForSex: config.mapping.programStageDataElements.receiveMoneyForSex,
        paidForSex: config.mapping.programStageDataElements.paidForSex,
        injectedDrugSharedNeedle: config.mapping.programStageDataElements.injectedDrugSharedNeedle,
        alcoholDrugBeforeSex: config.mapping.programStageDataElements.alcoholDrugBeforeSex,
        groupSexChemsex: config.mapping.programStageDataElements.groupSexChemsex,
        abortion: config.mapping.programStageDataElements.abortion,
        forcedSex: config.mapping.programStageDataElements.forcedSex,
        riskScreeningResult: config.mapping.programStageDataElements.riskScreeningResult,
        riskScreeningScore: config.mapping.programStageDataElements.riskScreeningScore,
        noneOfAbove: config.mapping.programStageDataElements.noneOfAbove
    }

    // Some DHIS2 data elements are trueOnly (checkbox). They only accept 'true',
    // sending 'false' causes 409 value_not_true_only conflicts. We skip 'false' values for those IDs.
    const trueOnlyElementIds = new Set([
        config.mapping.programStageDataElements.partnerMale,
        config.mapping.programStageDataElements.partnerFemale,
        config.mapping.programStageDataElements.partnerTGW,
        config.mapping.programStageDataElements.partnerTGM,
        config.mapping.programStageDataElements.noneOfAbove
    ])

    const booleanElementIds = new Set([
        config.mapping.programStageDataElements.sexWithHIVPartner,
        config.mapping.programStageDataElements.receiveMoneyForSex,
        config.mapping.programStageDataElements.paidForSex,
        config.mapping.programStageDataElements.injectedDrugSharedNeedle,
        config.mapping.programStageDataElements.alcoholDrugBeforeSex,
        config.mapping.programStageDataElements.groupSexChemsex,
        config.mapping.programStageDataElements.forcedSex,
        config.mapping.programStageDataElements.currentlyOnPrep,
        config.mapping.programStageDataElements.stiSymptoms,
        config.mapping.programStageDataElements.sexualHealthConcerns,
        config.mapping.programStageDataElements.sexWithoutCondom,
        config.mapping.programStageDataElements.everOnPrep,
        config.mapping.programStageDataElements.abortion,
        config.mapping.programStageDataElements.numberOfSexualPartners // Added: BOOLEAN type
    ].filter(Boolean))

    // Log incoming data for debugging
    console.log('[createProgramStageDataValues] Input data keys:', Object.keys(data))
    console.log('[createProgramStageDataValues] Input data sample:', Object.entries(data).slice(0, 5).reduce((acc, [k, v]) => {
        acc[k] = String(v).substring(0, 50)
        return acc
    }, {}))
    
    Object.entries(eventMappings).forEach(([key, dataElementId]) => {
        // Skip invalid placeholder IDs
        if (dataElementId && dataElementId.includes('ID') && !dataElementId.match(/^[a-zA-Z0-9]{11}$/)) {
            return
        }
        
        // Skip if data element already used (prevent duplicates)
        if (usedDataElements.has(dataElementId)) {
            return
        }
        
        if (dataElementId && data[key] && dataElementId.match(/^[a-zA-Z0-9]{11}$/)) {
            let value = data[key]
            
            // Special handling for boolean data elements that expect true/false
            if (booleanElementIds.has(dataElementId)) {
                if (typeof value === 'string') {
                    const v = value.trim().toLowerCase()
                    // For everOnPrep boolean: skip "Never Know" values (empty = not sent)
                    if (key === 'everOnPrep') {
                        if (['never know', 'neverknow', '12', 'unknown', ''].includes(v)) {
                            value = ''
                        } else if (['1', 'yes', 'true', '10'].includes(v)) {
                            value = 'true'
                        } else if (['0', 'no', 'false', '11'].includes(v)) {
                            value = 'false'
                        }
                    } else {
                        if (['never know', 'neverknow', '12', 'unknown', ''].includes(v)) {
                            value = ''
                        } else if (['1', 'yes', 'true'].includes(v)) {
                            value = 'true'
                        } else if (['0', 'no', 'false'].includes(v)) {
                            value = 'false'
                        }
                    }
                } else if (value === 1 || value === 10) {
                    value = 'true'
                } else if (value === 0 || value === 11) {
                    value = 'false'
                } else if (value === 12) {
                    // For everOnPrep, 12 = Never Know = skip
                    if (key === 'everOnPrep') {
                        value = ''
                    }
                }
            }

            // Skip empty values, but log in development to help debug
            if (value === '' || value === null || typeof value === 'undefined') {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`[createProgramStageDataValues] ⏭️ Skipping ${key} - empty value:`, { 
                        original: data[key], 
                        processed: value,
                        dataElement: dataElementId 
                    })
                }
                return
            }

            // Special handling for PrEP fields that use specific numeric codes (only if NOT boolean)
            if (key === 'everOnPrep' && !booleanElementIds.has(dataElementId)) {
                // everOnPrep uses: 10=Yes, 11=No, 12=Never Know (only for option set types)
                if (typeof value === 'string') {
                    const v = value.toLowerCase()
                    if (v === 'yes' || v === 'true' || v === '10' || v === '1') {
                        value = '10'
                    } else if (v === 'no' || v === 'false' || v === '11' || v === '0') {
                        value = '11'
                    } else if (v === 'never know' || v === 'neverknow' || v === '12' || v === 'unknown') {
                        value = '12'
                    }
                    // Keep numeric values as-is if already 10, 11, or 12
                }
            } else if (key === 'currentlyOnPrep') {
                // currentlyOnPrep is a boolean data element (Yes/No)
                if (typeof value === 'string') {
                    const v = value.toLowerCase()
                    if (['yes', 'true', '1', '10'].includes(v)) {
                        value = 'true'
                    } else if (['no', 'false', '0'].includes(v)) {
                        value = 'false'
                    }
                }
                if (value === 1 || value === 10) {
                    value = 'true'
                } else if (value === 0) {
                    value = 'false'
                }
            } else if (key === 'riskScreeningResult') {
                // Special handling for riskScreeningResult
                // The value might be text like "Low", "High", "Medium" etc.
                // We need to preserve it as-is since we can't fetch option sets here
                // The value should match option set codes/names exactly
                // If it doesn't match, DHIS2 will reject it, but that's expected behavior
                value = String(value).trim()
                
                // Log the value being used
                console.log('[createProgramStageDataValues] riskScreeningResult value:', {
                    original: data[key],
                    processed: value,
                    dataElementId,
                    note: 'Value should match option set code/name exactly. If rejected by DHIS2, check option set configuration.'
                })
            } else if (!booleanElementIds.has(dataElementId)) {
                // Normalize other boolean values - convert true/false/yes/no to 1/0 for numeric option sets
                if (typeof value === 'string') {
                    const v = value.trim().toLowerCase()
                    if (v === 'yes' || v === 'true' || v === '1') {
                        value = '1'
                    } else if (v === 'no' || v === 'false' || v === '0') {
                        value = '0'
                    }
                    // Keep other string values as-is (for text fields, option sets, etc.)
                } else if (value === true || value === 1) {
                    value = '1'
                } else if (value === false || value === 0) {
                    value = '0'
                }
            }
            
            // For trueOnly data elements, only send when value is '1' or 'true'
            if (trueOnlyElementIds.has(dataElementId)) {
                if (value !== '1' && value !== 'true') {
                    return
                }
                // Normalize trueOnly to 'true' for DHIS2
                if (value === '1') {
                    value = 'true'
                }
            }

            // Debug logging for riskScreeningResult
            if (key === 'riskScreeningResult') {
                console.log('[createProgramStageDataValues] riskScreeningResult:', {
                    key,
                    dataElementId,
                    value,
                    originalValue: data[key],
                    willAdd: value !== '' && value !== null && typeof value !== 'undefined'
                })
            }

            dataValues.push({ dataElement: dataElementId, value: String(value) })
            usedDataElements.add(dataElementId) // Mark as used
            
            // Log each field being added
            if (process.env.NODE_ENV === 'development') {
                console.log(`[createProgramStageDataValues] ✅ Added ${key}:`, { dataElement: dataElementId, value: String(value) })
            }
            
            // Additional logging for riskScreeningResult
            if (key === 'riskScreeningResult') {
                console.log('[createProgramStageDataValues] ✅ riskScreeningResult ADDED to dataValues:', {
                    dataElement: dataElementId,
                    value: String(value),
                    valueType: typeof value,
                    valueLength: String(value).length
                })
            }
        } else if (dataElementId && !dataElementId.match(/^[a-zA-Z0-9]{11}$/)) {
            // Invalid data element ID - skip silently
            if (key === 'riskScreeningResult') {
                console.error('[createProgramStageDataValues] ❌ Invalid riskScreeningResult dataElementId:', dataElementId)
            }
        } else if (dataElementId && !data[key]) {
            // No data value - skip silently
            if (key === 'riskScreeningResult') {
                console.warn('[createProgramStageDataValues] ⚠️ riskScreeningResult missing in data:', {
                    key,
                    dataElementId,
                    dataKeys: Object.keys(data),
                    hasRiskResult: 'riskScreeningResult' in data,
                    riskResultValue: data.riskScreeningResult
                })
            }
            // Log skipped fields in development
            if (process.env.NODE_ENV === 'development' && dataElementId.match(/^[a-zA-Z0-9]{11}$/)) {
                console.log(`[createProgramStageDataValues] ⏭️ Skipped ${key} (no value):`, { dataElement: dataElementId, hasValue: !!data[key] })
            }
        }
    })
    
    console.log('[createProgramStageDataValues] Total data values created:', dataValues.length)
    console.log('[createProgramStageDataValues] Data values summary:', dataValues.map(dv => ({
        dataElement: dv.dataElement.substring(0, 11) + '...',
        value: String(dv.value).substring(0, 30)
    })))

    return dataValues
}

/**
 * Import single record to DHIS2 (with tracked entity type)
 */
export const importRecordToDHIS2 = async (data, orgUnitId, engine, config) => {
    try {
        // 0. Upsert TEI: reuse existing when System ID or UUIC already present
        // Lookup existing TEI - orgUnit is required by DHIS2
        let teiId = await findExistingTei(engine, orgUnitId, config, data)
        
        if (!teiId) {
            // 1. Create TEI (like manual input)
            const { teiPayload, attributes } = createDHIS2Payload(data, orgUnitId, config)
            // Filter attributes to only those allowed by the program/TET
            const allowedAttrIds = await fetchProgramTeAttributeIds(engine, config.program.id)
            if (allowedAttrIds && allowedAttrIds.size > 0) {
                const filtered = (attributes || []).filter(a => allowedAttrIds.has(a.attribute))
                teiPayload.trackedEntityInstances[0].attributes = filtered
            }
            
            try {
                const teiRes = await engine.mutate({
                    resource: 'trackedEntityInstances',
                    type: 'create',
                    data: teiPayload
                })
                
                // Always check for reference first, even in error responses
                const importSummary = teiRes?.response?.importSummaries?.[0]
                if (importSummary?.reference) {
                    teiId = importSummary.reference
                } else if (teiRes?.response?.status === 'ERROR' || teiRes?.response?.status === 'WARNING') {
                    const errorDetails = importSummary?.description || 'Unknown error'
                    
                    // Check for conflicts
                    if (importSummary?.conflicts && importSummary.conflicts.length > 0) {
                        const conflictDetails = importSummary.conflicts.map(c => `${c.object || ''}: ${c.value}`).join(', ')
                        // If conflict due to unique attribute, try lookup and reuse TEI
                        const isUniqueConflict = /already exists|value_exists|duplicate|unique|conflict/i.test(conflictDetails)
                        if (isUniqueConflict) {
                            // Try simpler lookup without program filter first (less likely to cause CORS issues)
                            teiId = await findExistingTeiWithoutProgram(engine, orgUnitId, config, data)
                            if (!teiId) {
                                // Retry lookup with orgUnit and program
                                await new Promise(resolve => setTimeout(resolve, 500)) // Wait for consistency
                                teiId = await findExistingTei(engine, orgUnitId, config, data)
                            }
                            if (!teiId) {
                                // Try broader search across user hierarchy
                                await new Promise(resolve => setTimeout(resolve, 500)) // Wait for consistency
                                teiId = await findExistingTeiAcrossOrgUnits(engine, orgUnitId, config, data)
                            }
                            if (!teiId) {
                                throw new Error(`Duplicate TEI but not found via lookup: ${conflictDetails}`)
                            }
                        } else {
                            throw new Error(`Duplicate data found: ${conflictDetails}`)
                        }
                    } else {
                        throw new Error(`TEI creation failed: ${errorDetails}`)
                    }
                } else {
                    teiId = teiRes?.response?.importSummaries?.[0]?.reference
                    if (!teiId) throw new Error('TEI creation failed - no reference ID')
                }
            } catch (error) {
                // Handle 409 conflict error from API - check multiple error structures
                const errorResponse = error.details?.response || error.response || error
                const httpStatusCode = error.details?.httpStatusCode || errorResponse?.details?.httpStatusCode || errorResponse?.httpStatusCode
                const isConflict = httpStatusCode === 409 || 
                                 httpStatusCode === '409' ||
                                 error.message?.includes('409') || 
                                 error.message?.includes('Conflict') ||
                                 error.details?.status === 'Conflict'
                
                
                if (isConflict) {
                    // Try to extract TEI ID from error response - check multiple locations
                    let extractedTeiId = null
                    try {
                        // Check error.response first
                        if (error.response) {
                            const errorResp = error.response
                            if (errorResp?.response?.importSummaries?.[0]?.reference) {
                                extractedTeiId = errorResp.response.importSummaries[0].reference
                            } else if (errorResp?.importSummaries?.[0]?.reference) {
                                extractedTeiId = errorResp.importSummaries[0].reference
                            }
                        }
                        
                        // Check error.details - it might be a string that needs parsing
                        if (!extractedTeiId && error.details) {
                            try {
                                let detailsObj = error.details
                                
                                // If details is a string, parse it first
                                if (typeof error.details === 'string') {
                                    try {
                                        detailsObj = JSON.parse(error.details)
                                    } catch (e) {
                                        // Failed to parse
                                    }
                                }
                                
                                // Now check for response in parsed details
                                if (detailsObj?.response) {
                                    const detailsResp = detailsObj.response
                                    if (detailsResp?.response?.importSummaries?.[0]?.reference) {
                                        extractedTeiId = detailsResp.response.importSummaries[0].reference
                                    } else if (detailsResp?.importSummaries?.[0]?.reference) {
                                        extractedTeiId = detailsResp.importSummaries[0].reference
                                    }
                                }
                                
                                // Also check directly in detailsObj
                                if (!extractedTeiId && detailsObj?.importSummaries?.[0]?.reference) {
                                    extractedTeiId = detailsObj.importSummaries[0].reference
                                }
                            } catch (e) {
                                // Error parsing
                            }
                        }
                        
                        // Try parsing errorResponse as JSON if it's a string
                        if (!extractedTeiId && errorResponse) {
                            try {
                                const parsedResponse = typeof errorResponse === 'string' ? JSON.parse(errorResponse) : errorResponse
                                if (parsedResponse?.response?.importSummaries?.[0]?.reference) {
                                    extractedTeiId = parsedResponse.response.importSummaries[0].reference
                                } else if (parsedResponse?.importSummaries?.[0]?.reference) {
                                    extractedTeiId = parsedResponse.importSummaries[0].reference
                                }
                            } catch (parseError) {
                                // Not JSON, skip
                            }
                        }
                    } catch (e) {
                        // Failed to extract
                    }
                    
                    // If we extracted the ID, use it
                    if (extractedTeiId) {
                        teiId = extractedTeiId
                    } else {
                        // Try lookup with multiple strategies
                        try {
                            // Strategy 1: Try without program filter first (simplest, least likely to fail)
                            await new Promise(resolve => setTimeout(resolve, 500)) // Wait for consistency
                            teiId = await findExistingTeiWithoutProgram(engine, orgUnitId, config, data)
                            
                            if (!teiId) {
                                // Strategy 2: Try with program filter
                                await new Promise(resolve => setTimeout(resolve, 500))
                                teiId = await findExistingTei(engine, orgUnitId, config, data)
                            }
                            
                            if (!teiId) {
                                // Strategy 3: Try broader search across orgUnits (might trigger CORS, but worth trying)
                                await new Promise(resolve => setTimeout(resolve, 500))
                                try {
                                    teiId = await findExistingTeiAcrossOrgUnits(engine, orgUnitId, config, data)
                                } catch (corsError) {
                                    // Broader search failed (possible CORS)
                                }
                            }
                            
                            if (!teiId) {
                                // All lookup strategies failed - the TEI exists (409 confirms this) but we can't find it
                                // This usually means it's in a different orgUnit or the lookup queries are failing
                                throw new Error(`TEI creation conflict: Resource exists but cannot be located. The TEI with System ID "${data.systemId}" or UUIC "${data.uuic}" may exist in a different organization unit. Please check your data or try importing from the correct organization unit.`)
                            }
                        } catch (lookupError) {
                            // If lookup fails (possibly due to CORS), throw a helpful error
                            if (lookupError.message?.includes('cannot be located')) {
                                throw lookupError
                            }
                            // Otherwise, throw the conflict error with lookup failure info
                            throw new Error(`TEI creation conflict: Resource exists but cannot be located. System ID: ${data.systemId}, UUIC: ${data.uuic}. Lookup failed: ${lookupError.message}`)
                        }
                    }
                    
                    if (!teiId) {
                        throw new Error(`TEI creation conflict: Resource exists but cannot be located. System ID: ${data.systemId}, UUIC: ${data.uuic}`)
                    }
                } else {
                    throw error
                }
            }
        } else {
        }

        // 2. Check for existing enrollment or create new one
        let enrollmentId = await findExistingEnrollment(engine, teiId, config.program.id)
        
        if (!enrollmentId) {
            // No existing enrollment, create a new one
            const enrollmentPayload = {
                enrollments: [{
                    trackedEntityInstance: teiId,
                    program: config.program.id,
                    orgUnit: orgUnitId,
                    enrollmentDate: new Date().toISOString().split('T')[0],
                    incidentDate: data.dateOfBirth || new Date().toISOString().split('T')[0]
                }]
            }

            console.log('[importRecordToDHIS2] Creating new enrollment for TEI:', teiId)
            let enrRes
            try {
                enrRes = await engine.mutate({
                    resource: 'enrollments',
                    type: 'create',
                    data: enrollmentPayload
                })

                if (enrRes?.response?.status === 'ERROR' || enrRes?.response?.status === 'WARNING') {
                    const importSummary = enrRes?.response?.importSummaries?.[0]
                    const errorDetails = importSummary?.description || 'Unknown error'
                    
                    // Check if error is due to duplicate enrollment
                    if (importSummary?.conflicts && importSummary.conflicts.length > 0) {
                        const conflictDetails = importSummary.conflicts.map(c => `${c.object || ''}: ${c.value}`).join(', ')
                        const isDuplicateConflict = /already exists|value_exists|duplicate|already enrolled/i.test(conflictDetails)
                        
                        if (isDuplicateConflict) {
                            // Try to find existing enrollment again
                            enrollmentId = await findExistingEnrollment(engine, teiId, config.program.id)
                            if (!enrollmentId) {
                                throw new Error(`Duplicate enrollment but not found via lookup: ${conflictDetails}`)
                            }
                        } else {
                            throw new Error(`Enrollment failed: ${errorDetails}`)
                        }
                    } else {
                        throw new Error(`Enrollment failed: ${errorDetails}`)
                    }
                } else {
                    enrollmentId = enrRes?.response?.importSummaries?.[0]?.reference
                    if (!enrollmentId) {
                        throw new Error('Enrollment failed - no reference ID')
                    }
                    console.log('[importRecordToDHIS2] ✅ Created new enrollment:', enrollmentId)
                }
            } catch (error) {
                // Handle 409 conflict error for enrollment
                // NOTE: 409 is EXPECTED when enrollment already exists - this is normal behavior
                const errorResponse = error.details?.response || error.response || error
                const httpStatusCode = error.details?.httpStatusCode || errorResponse?.details?.httpStatusCode || errorResponse?.httpStatusCode
                const isConflict = httpStatusCode === 409 || 
                                 httpStatusCode === '409' ||
                                 error.message?.includes('409') || 
                                 error.message?.includes('Conflict') ||
                                 error.details?.status === 'Conflict' ||
                                 error.message?.toLowerCase().includes('already enrolled')
                
                if (isConflict) {
                    // 409 Conflict is EXPECTED - enrollment already exists, we'll find and use it
                    console.log('[importRecordToDHIS2] ⚠️ Enrollment 409 conflict (expected) - enrollment already exists, finding existing enrollment...')
                    
                    // Try to extract enrollment ID from error response
                    let extractedEnrollmentId = null
                    try {
                        // Parse error response to find reference
                        const parsedResponse = typeof errorResponse === 'string' ? JSON.parse(errorResponse) : errorResponse
                        
                        // Check multiple possible response structures
                        if (parsedResponse?.response?.importSummaries?.[0]?.reference) {
                            extractedEnrollmentId = parsedResponse.response.importSummaries[0].reference
                            } else if (parsedResponse?.importSummaries?.[0]?.reference) {
                                extractedEnrollmentId = parsedResponse.importSummaries[0].reference
                        }
                    } catch (e) {
                    }
                    
                    // Retry finding existing enrollment - wait for consistency
                    if (!extractedEnrollmentId) {
                        await new Promise(resolve => setTimeout(resolve, 500)) // Wait 500ms for consistency
                        enrollmentId = await findExistingEnrollment(engine, teiId, config.program.id)
                        if (enrollmentId) {
                            console.log('[importRecordToDHIS2] ✅ Found existing enrollment:', enrollmentId)
                        } else {
                            // If lookup still fails, try once more after a longer delay
                            await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1s
                            enrollmentId = await findExistingEnrollment(engine, teiId, config.program.id)
                            if (enrollmentId) {
                                console.log('[importRecordToDHIS2] ✅ Found existing enrollment (retry):', enrollmentId)
                            }
                        }
                    } else {
                        enrollmentId = extractedEnrollmentId
                        console.log('[importRecordToDHIS2] ✅ Extracted enrollment ID from error response:', enrollmentId)
                    }
                    
                    // If we still can't find it, but 409 indicates it exists, continue with event creation
                    // DHIS2 will handle the duplicate enrollment reference
                    if (!enrollmentId) {
                        // For enrollment, we can try to get it from the TEI's enrollments directly
                        try {
                            const teiResp = await engine.query({
                                tei: {
                                    resource: 'trackedEntityInstances',
                                    id: teiId,
                                    params: {
                                        fields: 'enrollments[enrollment,program]'
                                    }
                                }
                            })
                            const enrollments = teiResp?.tei?.enrollments || []
                            const programEnrollment = enrollments.find(e => e.program === config.program.id)
                            if (programEnrollment?.enrollment) {
                                enrollmentId = programEnrollment.enrollment
                                console.log('[importRecordToDHIS2] ✅ Found enrollment from TEI query:', enrollmentId)
                            }
                        } catch (e) {
                            console.warn('[importRecordToDHIS2] Failed to query TEI for enrollments:', e)
                        }
                        
                        if (!enrollmentId) {
                            console.error('[importRecordToDHIS2] ❌ Could not find existing enrollment after 409 conflict')
                            throw new Error(`Enrollment creation conflict: Enrollment exists for TEI ${teiId} but cannot be located.`)
                        }
                    }
                    
                    console.log('[importRecordToDHIS2] ✅ Using existing enrollment:', enrollmentId)
                } else {
                    // For non-conflict errors, check if response has error status
                    if (errorResponse?.response?.status === 'ERROR' || errorResponse?.response?.status === 'WARNING') {
                        const importSummary = errorResponse?.response?.importSummaries?.[0]
                        const errorDetails = importSummary?.description || error.message || 'Unknown error'
                        throw new Error(`Enrollment failed: ${errorDetails}`)
                    }
                    throw error
                }
            }
        } else {
        }

        // 3. Create event with data values (like manual input)
        const dataValues = createProgramStageDataValues(data, config)

        // Debug logging for risk screening values
        const riskScoreDv = dataValues.find(dv => dv.dataElement === config.mapping.programStageDataElements.riskScreeningScore)
        const riskResultDv = dataValues.find(dv => dv.dataElement === config.mapping.programStageDataElements.riskScreeningResult)
        console.log('[importRecordToDHIS2] Risk screening data values:', {
            riskScore: riskScoreDv,
            riskResult: riskResultDv,
            allDataValues: dataValues.length,
            riskScreeningResultInData: data.riskScreeningResult,
            riskScreeningScoreInData: data.riskScreeningScore
        })

        // Validate data values before sending
        const validDataValues = dataValues.filter(dv => {
            if (!dv.dataElement || !dv.value) {
                return false
            }
            return true
        })
        
        console.log('[importRecordToDHIS2] Valid data values:', validDataValues.length, 'of', dataValues.length)


        if (validDataValues.length > 0) {
            // First, try to find existing event for this enrollment/programStage
            let existingEventId = null
            try {
                const eventsResponse = await engine.query({
                    events: {
                        resource: 'events',
                        params: {
                            enrollment: enrollmentId,
                            program: config.program.id,
                            programStage: config.program.stageId,
                            fields: 'event,eventDate,status',
                            pageSize: 1,
                            order: 'eventDate:desc'
                        }
                    }
                })
                const events = eventsResponse?.events?.events || []
                if (events.length > 0) {
                    existingEventId = events[0].event
                    console.log('[importRecordToDHIS2] Found existing event:', existingEventId)
                }
            } catch (queryError) {
                console.log('[importRecordToDHIS2] No existing event found or query failed (will create new):', queryError.message)
            }
            
            // Use current date for event
            const eventDate = new Date().toISOString().split('T')[0]
            
            const eventPayload = {
                events: [{
                    trackedEntityInstance: teiId,
                    program: config.program.id,
                    programStage: config.program.stageId,
                    orgUnit: orgUnitId,
                    enrollment: enrollmentId,
                    eventDate: eventDate,
                    status: 'COMPLETED',
                    dataValues: validDataValues
                }]
            }
            
            // If existing event found, add event ID to payload for update
            if (existingEventId) {
                eventPayload.events[0].event = existingEventId
            }
            
            console.log('[importRecordToDHIS2] Event payload:', {
                programStage: config.program.stageId,
                program: config.program.id,
                dataValuesCount: validDataValues.length,
                riskScreeningResultInPayload: validDataValues.find(dv => 
                    dv.dataElement === config.mapping.programStageDataElements.riskScreeningResult
                ),
                riskScreeningScoreInPayload: validDataValues.find(dv => 
                    dv.dataElement === config.mapping.programStageDataElements.riskScreeningScore
                )
            })


            console.log('[importRecordToDHIS2] 📤 POSTING TO EVENTS API - This is where form data goes!')
            console.log('[importRecordToDHIS2] Event API endpoint: POST /api/events')
            console.log('[importRecordToDHIS2] Event payload details:', {
                trackedEntityInstance: teiId,
                program: config.program.id,
                programStage: config.program.stageId,
                enrollment: enrollmentId,
                dataValuesCount: validDataValues.length,
                allDataValues: validDataValues.map(dv => ({
                    dataElement: dv.dataElement,
                    value: String(dv.value).substring(0, 50)
                }))
            })
            
            let evtRes
            try {
                // DHIS2 events API: Include event ID in payload to update, omit to create
                // Always use 'create' type - DHIS2 will update if event ID is present
                if (existingEventId) {
                    console.log(`[importRecordToDHIS2] Updating existing event: ${existingEventId}...`)
                } else {
                    console.log(`[importRecordToDHIS2] Creating new event...`)
                }
                
                evtRes = await engine.mutate({
                    resource: 'events',
                    type: 'create', // Always use 'create' - DHIS2 updates if event ID is in payload
                    data: eventPayload
                })
                console.log(`[importRecordToDHIS2] ✅ SUCCESS - Event ${existingEventId ? 'updated' : 'created'} via /api/events`)
            } catch (eventError) {
                // Check if it's a 409 conflict (event already exists)
                const isConflict = eventError.details?.httpStatusCode === 409 || 
                                  eventError.message?.includes('409') ||
                                  eventError.details?.response?.status === 'ERROR'
                
                if (isConflict) {
                    console.warn('[importRecordToDHIS2] ⚠️ Event 409 conflict - event already exists')
                    
                    // Extract conflict details from error response
                    const conflictDetails = eventError.details?.response?.importSummaries?.[0]?.conflicts || []
                    const conflictMessages = conflictDetails.map(c => `${c.object || c.property || 'field'}: ${c.value || c.message || 'conflict'}`).join(', ')
                    console.log('[importRecordToDHIS2] Conflict details:', conflictMessages || 'No details available')
                    
                    // Remove event ID from payload to create a new event
                    delete eventPayload.events[0].event
                    
                    // Use a truly unique event date (current timestamp with milliseconds)
                    const now = new Date()
                    // Add random milliseconds to ensure uniqueness
                    const uniqueMs = now.getTime() + Math.floor(Math.random() * 10000)
                    const uniqueDate = new Date(uniqueMs)
                    eventPayload.events[0].eventDate = uniqueDate.toISOString().split('T')[0]
                    
                    // Also add a small time component to the date string if needed
                    // But since eventDate is just a date (YYYY-MM-DD), we need to ensure different dates
                    // If same day, we'll just accept that multiple events can exist on same day
                    
                    console.log('[importRecordToDHIS2] Creating new event with unique date:', eventPayload.events[0].eventDate)
                    
                    try {
                        evtRes = await engine.mutate({
                            resource: 'events',
                            type: 'create',
                            data: eventPayload
                        })
                        
                        // Check if the response indicates success
                        if (evtRes?.response?.status === 'SUCCESS' || evtRes?.response?.status === 'OK') {
                            console.log('[importRecordToDHIS2] ✅ Created new event with unique date (conflict resolved)')
                        } else {
                            // Even if status is not SUCCESS, check if we got an event ID
                            const eventId = evtRes?.response?.importSummaries?.[0]?.reference
                            if (eventId) {
                                console.log('[importRecordToDHIS2] ✅ Event created (got event ID):', eventId)
                            } else {
                                // Extract error details
                                const importSummary = evtRes?.response?.importSummaries?.[0]
                                const errorMsg = importSummary?.description || importSummary?.message || 'Event creation returned non-success status'
                                const conflicts = importSummary?.conflicts || []
                                if (conflicts.length > 0) {
                                    const conflictMsg = conflicts.map(c => `${c.object || c.property}: ${c.value || c.message}`).join(', ')
                                    throw new Error(`Event creation failed - conflicts: ${conflictMsg}`)
                                }
                                throw new Error(`Event creation failed: ${errorMsg}`)
                            }
                        }
                    } catch (retryError) {
                        console.error('[importRecordToDHIS2] ❌ FAILED - Event creation failed after conflict:', retryError)
                        
                        // Extract detailed error information
                        let errorDetails = retryError.message || 'Unknown error'
                        const errorResponse = retryError.details?.response || retryError.response
                        
                        if (errorResponse?.importSummaries?.[0]) {
                            const summary = errorResponse.importSummaries[0]
                            const conflicts = summary.conflicts || []
                            if (conflicts.length > 0) {
                                const conflictMsg = conflicts.map(c => `${c.object || c.property || 'field'}: ${c.value || c.message || 'conflict'}`).join(', ')
                                errorDetails = `Conflicts: ${conflictMsg}`
                            } else if (summary.description) {
                                errorDetails = summary.description
                            }
                        } else if (errorResponse?.status === 'ERROR' && errorResponse?.importSummaries?.[0]?.description) {
                            errorDetails = errorResponse.importSummaries[0].description
                        }
                        
                        throw new Error(`Event creation failed: ${errorDetails}`)
                    }
                } else {
                    console.error('[importRecordToDHIS2] ❌ FAILED - Event API error:', eventError)
                    const errorDetails = eventError.details?.response?.importSummaries?.[0]?.description || 
                                       eventError.message || 
                                       'Unknown error'
                    throw new Error(`Event creation API error: ${errorDetails}`)
                }
            }


            // Log event response for debugging
            console.log('[importRecordToDHIS2] Event creation response:', {
                status: evtRes?.response?.status,
                importSummary: evtRes?.response?.importSummaries?.[0],
                conflicts: evtRes?.response?.importSummaries?.[0]?.conflicts,
                eventId: evtRes?.response?.importSummaries?.[0]?.reference
            })

            if (evtRes?.response?.status === 'ERROR' || evtRes?.response?.status === 'WARNING') {
                const importSummary = evtRes?.response?.importSummaries?.[0]
                const errorDetails = importSummary?.description || 'Unknown error'

                // Check for specific conflict errors in events
                if (importSummary?.conflicts && importSummary.conflicts.length > 0) {
                    const conflictDetails = importSummary.conflicts.map(c => 
                        `${c.object || c.property || 'field'}: ${c.value || c.message || 'invalid value'}`
                    ).join(', ')
                    console.error('[importRecordToDHIS2] Event conflicts:', importSummary.conflicts)
                    throw new Error(`Event creation failed - conflicts: ${conflictDetails}`)
                }
                
                throw new Error(`Event creation failed: ${errorDetails}`)
            } else if (evtRes?.response?.status === 'SUCCESS') {
                // Event created successfully - log which data values were saved
                const savedEventId = evtRes?.response?.importSummaries?.[0]?.reference
                console.log('[importRecordToDHIS2] Event created successfully:', savedEventId)
                
                // Verify risk screening values were included
                const riskResultInPayload = validDataValues.find(dv => 
                    dv.dataElement === config.mapping.programStageDataElements.riskScreeningResult
                )
                const riskScoreInPayload = validDataValues.find(dv => 
                    dv.dataElement === config.mapping.programStageDataElements.riskScreeningScore
                )
                console.log('[importRecordToDHIS2] Risk screening in payload:', {
                    riskResult: riskResultInPayload,
                    riskScore: riskScoreInPayload
                })
            } else {
                throw new Error(`Event creation failed - unexpected status: ${evtRes?.response?.status}`)
            }
        }

        return {
            success: true,
            teiId,
            enrollmentId,
            message: 'Record imported successfully'
        }

    } catch (error) {
        return {
            success: false,
            error: error.message
        }
    }
}

/**
 * Create a hook for fetching form data
 */
export const useDHIS2FormData = () => {
    const engine = useDataEngine()
    
    const fetchFormData = async (programStageId) => {
        try {
            const { dataElements, dataElementOptions } = await fetchProgramStageDataElementsWithOptions(engine, programStageId)
            
            // Create a mapping of form field names to data element options
            const formFieldOptions = {}
            
            dataElements.forEach(psde => {
                const dataElement = psde.dataElement
                const options = dataElementOptions[dataElement.id] || []
                
                // Map data element names to form field options
                const elementName = dataElement.name.toLowerCase()
                
                if (elementName.includes('sex at birth') || elementName.includes('gender')) {
                    formFieldOptions.gender = options
                }
                if (elementName.includes('hiv test') && elementName.includes('past 6 months')) {
                    formFieldOptions.hivTest = options
                }
                if (elementName.includes('hiv test') && elementName.includes('result')) {
                    formFieldOptions.hivResult = options
                }
                if (elementName.includes('sti symptom')) {
                    formFieldOptions.stiSymptoms = options
                }
                if (elementName.includes('condom')) {
                    formFieldOptions.condomUse = options
                }
                if (elementName.includes('sexual partner')) {
                    formFieldOptions.sexualPartners = options
                }
                if (elementName.includes('anal sex')) {
                    formFieldOptions.analSex = options
                }
                if (elementName.includes('oral sex')) {
                    formFieldOptions.oralSex = options
                }
                if (elementName.includes('sex work')) {
                    formFieldOptions.sexWork = options
                }
                if (elementName.includes('paid for sex')) {
                    formFieldOptions.paidForSex = options
                }
                if (elementName.includes('received money for sex')) {
                    formFieldOptions.receivedMoneyForSex = options
                }
                if (elementName.includes('forced sex')) {
                    formFieldOptions.forcedSex = options
                }
                if (elementName.includes('drug use')) {
                    formFieldOptions.drugUse = options
                }
                if (elementName.includes('alcohol use')) {
                    formFieldOptions.alcoholUse = options
                }
                if (elementName.includes('needle sharing')) {
                    formFieldOptions.needleSharing = options
                }
                if (elementName.includes('chemsex')) {
                    formFieldOptions.chemsex = options
                }
                if (elementName.includes('group sex')) {
                    formFieldOptions.groupSex = options
                }
                if (elementName.includes('prep use')) {
                    formFieldOptions.prepUse = options
                }
                if (elementName.includes('art use')) {
                    formFieldOptions.artUse = options
                }
                if (elementName.includes('pregnancy')) {
                    formFieldOptions.pregnancy = options
                }
                if (elementName.includes('contraceptive')) {
                    formFieldOptions.contraceptiveUse = options
                }
                
                // Log all data elements for debugging
            })
            
            return {
                dataElements,
                dataElementOptions,
                formFieldOptions
            }
        } catch (error) {
            return {
                dataElements: [],
                dataElementOptions: {},
                formFieldOptions: {}
            }
        }
    }
    
    return { fetchFormData }
}
