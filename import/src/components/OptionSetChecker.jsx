import React, { useState, useEffect } from 'react'
import { useDataEngine } from '@dhis2/app-runtime'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

const OptionSetChecker = () => {
    const [optionSets, setOptionSets] = useState([])
    const [prepDataElements, setPrepDataElements] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [prepRelated, setPrepRelated] = useState([])
    
    const engine = useDataEngine()

    const checkOptionSets = async () => {
        setLoading(true)
        setError(null)
        
        try {
            console.log('🔍 Fetching option sets from DHIS2...')
            
            // Get all option sets
            const response = await engine.query({
                optionSets: {
                    resource: 'optionSets',
                    params: {
                        fields: 'id,name,options[code,name]',
                        paging: false
                    }
                }
            })
            
            console.log('✅ Option Sets Response:', response)
            const allOptionSets = response.optionSets.optionSets || []
            setOptionSets(allOptionSets)
            
            // Look for PrEP-related option sets
            const prepRelatedSets = allOptionSets.filter(os => 
                os.name.toLowerCase().includes('prep') || 
                os.name.toLowerCase().includes('yes') ||
                os.name.toLowerCase().includes('no') ||
                os.name.toLowerCase().includes('boolean') ||
                os.name.toLowerCase().includes('true') ||
                os.name.toLowerCase().includes('false')
            )
            
            console.log('🎯 PrEP-related option sets found:', prepRelatedSets)
            setPrepRelated(prepRelatedSets)
            
        } catch (err) {
            console.error('❌ Error fetching option sets:', err)
            setError(`Failed to fetch option sets: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const checkDataElement = async (dataElementId, name) => {
        try {
            console.log(`🔍 Checking data element: ${name} (${dataElementId})`)
            
            const response = await engine.query({
                dataElement: {
                    resource: `dataElements/${dataElementId}`,
                    params: {
                        fields: 'id,name,valueType,optionSet[id,name,options[code,name]]'
                    }
                }
            })
            
            console.log(`✅ Data Element ${name}:`, response.dataElement)
            
            // If it has an option set, get the full option set details
            if (response.dataElement.optionSet) {
                console.log(`🎯 Data Element ${name} uses option set:`, response.dataElement.optionSet)
            }
            
            return response.dataElement
        } catch (err) {
            console.error(`❌ Error fetching data element ${dataElementId}:`, err)
            return null
        }
    }

    const checkSpecificOptionSet = async (optionSetId) => {
        try {
            console.log(`🔍 Checking specific option set: ${optionSetId}`)
            
            const response = await engine.query({
                optionSet: {
                    resource: `optionSets/${optionSetId}`,
                    params: {
                        fields: 'id,name,options[code,name]'
                    }
                }
            })
            
            console.log(`✅ Option Set Details:`, response.optionSet)
            return response.optionSet
        } catch (err) {
            console.error(`❌ Error fetching option set ${optionSetId}:`, err)
            return null
        }
    }

    const checkAllPrepDataElements = async () => {
        setLoading(true)
        setError(null)
        
        try {
            console.log('🔍 Checking all PrEP-related data elements...')
            
            const prepElements = [
                { id: 'LTf9Uj5JnqN', name: 'Currently on PrEP' },
                { id: 'ziEaDW60taC', name: 'Ever on PrEP' },
                { id: 'Q2KRbrYIKHM', name: 'Had Sex Past 6 Months' },
                { id: 'bls0dsZMoRO', name: 'Sex with HIV+ Partner' },
                { id: 'JhZONUgUE87', name: 'Sex without Condom' },
                { id: 'HnK9Yh1aWn1', name: 'STI Symptoms' }
            ]
            
            const results = {}
            
            for (const element of prepElements) {
                const data = await checkDataElement(element.id, element.name)
                if (data) {
                    results[element.id] = {
                        ...element,
                        dataElement: data
                    }
                }
            }
            
            setPrepDataElements(results)
            console.log('✅ All PrEP data elements checked:', results)
            
        } catch (err) {
            console.error('❌ Error checking PrEP data elements:', err)
            setError(`Failed to check PrEP data elements: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        console.log('📋 Copied to clipboard:', text)
    }

    useEffect(() => {
        checkOptionSets()
        checkAllPrepDataElements()
        
        // Specifically check the Ever on PrEP data element
        checkDataElement('ziEaDW60taC', 'Ever on PrEP').then(dataElement => {
            if (dataElement && dataElement.optionSet) {
                console.log('🎯 Ever on PrEP uses option set:', dataElement.optionSet)
                checkSpecificOptionSet(dataElement.optionSet.id)
            }
        })
    }, [])

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">DHIS2 API Option Sets Checker</h1>
                <p className="text-gray-600">Check option sets and data element configurations for PrEP fields</p>
            </div>
            
            <div className="flex gap-4 mb-6">
                <Button 
                    onClick={checkOptionSets}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {loading ? 'Loading...' : '🔄 Refresh Option Sets'}
                </Button>
                
                <Button 
                    onClick={checkAllPrepDataElements}
                    disabled={loading}
                    variant="outline"
                >
                    {loading ? 'Loading...' : '🔍 Check PrEP Data Elements'}
                </Button>
                
                <Button 
                    onClick={async () => {
                        const dataElement = await checkDataElement('ziEaDW60taC', 'Ever on PrEP');
                        if (dataElement && dataElement.optionSet) {
                            await checkSpecificOptionSet(dataElement.optionSet.id);
                        }
                    }}
                    disabled={loading}
                    variant="outline"
                    className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                >
                    {loading ? 'Loading...' : '🎯 Check Ever on PrEP Option Set'}
                </Button>
            </div>
            
            {error && (
                <Card className="mb-6 border-red-200 bg-red-50">
                    <CardContent className="p-4">
                        <div className="text-red-800 font-medium">❌ Error: {error}</div>
                    </CardContent>
                </Card>
            )}
            
            {/* PrEP Related Option Sets */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        🎯 PrEP-Related Option Sets ({prepRelated.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {prepRelated.length > 0 ? (
                        <div className="space-y-4">
                            {prepRelated.map(optionSet => (
                                <div key={optionSet.id} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-lg">{optionSet.name}</h4>
                                        <Badge variant="secondary">ID: {optionSet.id}</Badge>
                                    </div>
                                    {optionSet.options && (
                                        <div>
                                            <p className="text-sm font-medium mb-2">Options ({optionSet.options.length}):</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                {optionSet.options.map(option => (
                                                    <div key={option.code} className="flex items-center justify-between bg-white p-2 rounded border">
                                                        <span className="text-sm">{option.name}</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {option.code}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No PrEP-related option sets found</p>
                    )}
                </CardContent>
            </Card>

            {/* PrEP Data Elements */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        🔬 PrEP Data Elements Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {Object.keys(prepDataElements).length > 0 ? (
                        <div className="space-y-4">
                            {Object.values(prepDataElements).map(element => (
                                <div key={element.id} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-lg">{element.name}</h4>
                                        <div className="flex gap-2">
                                            <Badge variant="secondary">ID: {element.id}</Badge>
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => copyToClipboard(element.id)}
                                            >
                                                📋 Copy ID
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {element.dataElement && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">Value Type:</span>
                                                <Badge variant="outline">{element.dataElement.valueType}</Badge>
                                            </div>
                                            
                                            {element.dataElement.optionSet ? (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-sm font-medium">Option Set:</span>
                                                        <Badge variant="default">{element.dataElement.optionSet.name}</Badge>
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={() => copyToClipboard(element.dataElement.optionSet.id)}
                                                        >
                                                            📋 Copy Option Set ID
                                                        </Button>
                                                    </div>
                                                    
                                                    {element.dataElement.optionSet.options && (
                                                        <div>
                                                            <p className="text-sm font-medium mb-2">Available Options:</p>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                                {element.dataElement.optionSet.options.map(option => (
                                                                    <div key={option.code} className="flex items-center justify-between bg-white p-2 rounded border">
                                                                        <span className="text-sm">{option.name}</span>
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {option.code}
                                                                        </Badge>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-500 italic">
                                                    No option set assigned (Value Type: {element.dataElement.valueType})
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No PrEP data elements checked yet</p>
                    )}
                </CardContent>
            </Card>

            {/* All Option Sets */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        📋 All Option Sets ({optionSets.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {optionSets.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {optionSets.map(optionSet => (
                                <div key={optionSet.id} className="border rounded p-3 bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium">{optionSet.name}</h4>
                                        <Badge variant="outline" className="text-xs">ID: {optionSet.id}</Badge>
                                    </div>
                                    {optionSet.options && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">
                                                {optionSet.options.length} options
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {optionSet.options.slice(0, 5).map(option => (
                                                    <Badge key={option.code} variant="secondary" className="text-xs">
                                                        {option.name}
                                                    </Badge>
                                                ))}
                                                {optionSet.options.length > 5 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{optionSet.options.length - 5} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No option sets loaded</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default OptionSetChecker
