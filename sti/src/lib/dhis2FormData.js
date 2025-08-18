import { useDataEngine } from '@dhis2/app-runtime'

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
        console.log('Fetched option sets:', optionSets.length)
        
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
        console.error('Error fetching option sets:', error)
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
        console.log('Fetched data elements:', dataElements.length)
        
        return dataElements
    } catch (error) {
        console.error('Error fetching data elements:', error)
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
        console.error('Error fetching options for data element:', error)
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
        
        console.log('Fetched program stage data elements with options:', dataElements.length)
        return {
            dataElements,
            dataElementOptions
        }
    } catch (error) {
        console.error('Error fetching program stage data elements:', error)
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
            console.warn(`No data element mapping found for field: ${fieldName}`)
            return []
        }
        
        // Fetch options for this data element
        const options = await getOptionsForDataElement(engine, dataElementId)
        return options
    } catch (error) {
        console.error(`Error getting options for field ${fieldName}:`, error)
        return []
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
                console.log(`Data Element: ${dataElement.name} (${dataElement.id}) - Options: ${options.length}`)
            })
            
            return {
                dataElements,
                dataElementOptions,
                formFieldOptions
            }
        } catch (error) {
            console.error('Error fetching form data:', error)
            return {
                dataElements: [],
                dataElementOptions: {},
                formFieldOptions: {}
            }
        }
    }
    
    return { fetchFormData }
}
