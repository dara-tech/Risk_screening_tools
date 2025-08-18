import React from 'react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { FiCheckCircle, FiActivity, FiEye } from 'react-icons/fi'

const FieldMappingStatus = ({ 
    programStageDetails, 
    fieldMappings, 
    loading, 
    selectedOrgUnit,
    onSimpleTest,
    onTestProgramStage,
    onDebugMappings,
    prepareTrackedEntityAttributes,
    formData,
    showToast
}) => {
    if (!programStageDetails) return null

    const handleDebugMappings = () => {
        const totalElements = programStageDetails.programStageDataElements?.length || 0
        const mappedCount = Object.keys(fieldMappings).length
        const unmappedCount = totalElements - mappedCount
        
        console.log('📊 MAPPING ANALYSIS:')
        console.log(`Total program stage data elements: ${totalElements}`)
        console.log(`Successfully mapped: ${mappedCount}`)
        console.log(`Unmapped: ${unmappedCount}`)
        console.log('✅ Mapped fields:', Object.keys(fieldMappings))
        
        if (unmappedCount > 0) {
            console.log('❌ Unmapped data elements:')
            programStageDetails.programStageDataElements?.forEach(psde => {
                const elementName = psde.dataElement.name.toLowerCase()
                const isMapped = Object.values(fieldMappings).some(mapping => mapping.id === psde.dataElement.id)
                if (!isMapped) {
                    console.log(`  - ${psde.dataElement.name} (${psde.dataElement.id})`)
                }
            })
        }
        
        // Show person mapping info
        const personAttributes = prepareTrackedEntityAttributes(formData)
        console.log('📊 PERSON MAPPING:')
        console.log(`Person attributes mapped: ${personAttributes.length}/10`)
        console.log('Person attributes:', personAttributes)
        
        showToast({
            title: 'Complete Mapping Analysis',
            description: `Program: ${mappedCount}/${totalElements} | Person: ${personAttributes.length}/10`,
            variant: (unmappedCount > 0 || personAttributes.length < 10) ? 'error' : 'success'
        })
    }

    return (
        <Card className="bg-white rounded-2xl border border-gray-100">
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <FiCheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                            <span className="text-sm sm:text-base font-semibold text-gray-900">
                                Program Stage: {programStageDetails.name}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                                Dynamic field mappings loaded from DHIS2
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs sm:text-sm">
                            {Object.keys(fieldMappings).length}/{programStageDetails.programStageDataElements?.length || 0} program stage
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs sm:text-sm">
                            10/10 person attributes
                        </Badge>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <Button
                            onClick={onSimpleTest}
                            disabled={loading || !selectedOrgUnit}
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                            ) : (
                                <FiCheckCircle className="w-4 h-4" />
                            )}
                            <span>{loading ? 'Testing...' : 'Simple Test'}</span>
                        </Button>
                        <Button
                            onClick={onTestProgramStage}
                            disabled={loading || !selectedOrgUnit}
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                            ) : (
                                <FiActivity className="w-4 h-4" />
                            )}
                            <span>{loading ? 'Testing...' : 'Test Database Post'}</span>
                        </Button>
                        <Button
                            onClick={handleDebugMappings}
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm"
                        >
                            <FiEye className="w-4 h-4" />
                            <span>Debug Mappings</span>
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Test database posting and debug field mappings
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default FieldMappingStatus
