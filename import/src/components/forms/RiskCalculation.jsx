import React, { useState, useCallback } from 'react'
import { FiTrendingUp, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'
import { Card } from '../ui/card'
import {  Calendar1, User, Calculator } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import SectionHeader from './SectionHeader'

const RiskCalculation = ({ 
    formData, 
    updateFormData, 
    calculateRiskScore, 
    hideHeaders = false 
}) => {
    const [riskScore, setRiskScore] = useState(0)
    const [riskLevel, setRiskLevel] = useState('Low')
    const [riskDetails, setRiskDetails] = useState([])

    const calculateRisk = useCallback(() => {
        if (typeof calculateRiskScore === 'function') {
            const result = calculateRiskScore(formData)
            setRiskScore(result.score)
            setRiskLevel(result.level)
            setRiskDetails(result.details || [])
        }
    }, [calculateRiskScore, formData])

    React.useEffect(() => {
        calculateRisk()
    }, [calculateRisk])

    const getRiskLevelColor = (level) => {
        switch (level) {
            case 'High': return 'bg-red-100 text-red-800 border-red-200'
            case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-200'
            case 'Low': return 'bg-green-100 text-green-800 border-green-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getRiskLevelIcon = (level) => {
        switch (level) {
            case 'High': return <FiAlertTriangle className="w-5 h-5" />
            case 'Medium': return <FiTrendingUp className="w-5 h-5" />
            case 'Low': return <FiCheckCircle className="w-5 h-5" />
            default: return <Calculator className="w-5 h-5" />
        }
    }

    const getProgressColor = (level) => {
        switch (level) {
            case 'High': return 'bg-red-500'
            case 'Medium': return 'bg-orange-500'
            case 'Low': return 'bg-green-500'
            default: return 'bg-gray-500'
        }
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {!hideHeaders && (
                <div className="text-center space-y-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                        <Calculator className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">លទ្ធផលវាយតម្លៃកម្រិតប្រឈម</h2>
                        <p className="text-gray-600 text-lg font-medium mt-2">Result of risk behavior screening</p>
                    </div>
                </div>
            )}

            {/* Risk Assessment Result */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                {!hideHeaders && (
                    <SectionHeader
                        title="លទ្ធផលវាយតម្លៃកម្រិតប្រឈម"
                        subtitle="Risk Assessment Result"
                        gradient="from-purple-500 to-pink-500"
                        badge="Result"
                    />
                )}

                <div className="space-y-6">
                    {/* Risk Result Summary */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                                <span className="text-4xl font-bold text-white">{riskScore}</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Risk Assessment Result</h3>
                                <p className="text-gray-600 text-lg">លទ្ធផលវាយតម្លៃកម្រិតប្រឈម</p>
                            </div>
                        </div>
                    </div>

                    {/* Risk Level Badge */}
                    <div className="flex justify-center">
                        <Badge className={`px-6 py-3 text-xl font-bold border-2 ${getRiskLevelColor(riskLevel)}`}>
                            <div className="flex items-center gap-3">
                                {getRiskLevelIcon(riskLevel)}
                                <span className="text-lg">{riskLevel} Risk Level</span>
                            </div>
                        </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Risk Level</span>
                            <span>{riskLevel}</span>
                        </div>
                        <Progress 
                            value={riskScore} 
                            max={100} 
                            className="h-3"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Low</span>
                            <span>Medium</span>
                            <span>High</span>
                        </div>
                    </div>

                    {/* Risk Details */}
                    {riskDetails.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900">Risk Factors Identified:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {riskDetails.map((detail, index) => (
                                    <Card key={index} className="p-4 border-l-4 border-orange-500">
                                        <div className="flex items-start gap-3">
                                            <FiAlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h5 className="font-medium text-gray-900">{detail.factor}</h5>
                                                <p className="text-sm text-gray-600">{detail.description}</p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Detailed Risk Assessment */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Risk Factors */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FiAlertTriangle className="w-5 h-5 text-orange-500" />
                                Risk Factors Identified
                            </h4>
                            {riskDetails.length > 0 ? (
                                <div className="space-y-3">
                                    {riskDetails.map((detail, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <div>
                                                <p className="font-medium text-gray-900">{detail.factor}</p>
                                                <p className="text-sm text-gray-600">{detail.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No specific risk factors identified</p>
                            )}
                        </div>

                        {/* Recommendations */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FiCheckCircle className="w-5 h-5 text-green-500" />
                                Recommendations
                            </h4>
                            <div className="space-y-3">
                                {riskLevel === 'High' && (
                                    <>
                                        <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                                            <p className="font-medium text-red-900">Immediate Actions Required:</p>
                                            <ul className="text-sm text-red-700 mt-2 space-y-1">
                                                <li>• Immediate STI/HIV testing</li>
                                                <li>• Consider PrEP if HIV negative</li>
                                                <li>• Regular condom use strongly advised</li>
                                                <li>• Consider counseling services</li>
                                            </ul>
                                        </div>
                                    </>
                                )}
                                {riskLevel === 'Medium' && (
                                    <>
                                        <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                                            <p className="font-medium text-yellow-900">Recommended Actions:</p>
                                            <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                                                <li>• Regular STI testing (every 3-6 months)</li>
                                                <li>• Consistent condom use</li>
                                                <li>• Consider PrEP if at risk</li>
                                                <li>• Regular health check-ups</li>
                                            </ul>
                                        </div>
                                    </>
                                )}
                                {riskLevel === 'Low' && (
                                    <>
                                        <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                                            <p className="font-medium text-green-900">Maintain Good Practices:</p>
                                            <ul className="text-sm text-green-700 mt-2 space-y-1">
                                                <li>• Continue safe sex practices</li>
                                                <li>• Regular health check-ups</li>
                                                <li>• Stay informed about sexual health</li>
                                                <li>• Annual STI screening</li>
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Next Steps:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Calendar1 className="w-6 h-6 text-blue-600" />
                                </div>
                                <h5 className="font-medium text-gray-900 mb-2">Schedule Testing</h5>
                                <p className="text-sm text-gray-600">Book your next STI/HIV test appointment</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FiCheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <h5 className="font-medium text-gray-900 mb-2">Safe Practices</h5>
                                <p className="text-sm text-gray-600">Continue or improve safe sex practices</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <User className="w-6 h-6 text-purple-600" />
                                </div>
                                <h5 className="font-medium text-gray-900 mb-2">Follow-up</h5>
                                <p className="text-sm text-gray-600">Schedule follow-up with healthcare provider</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RiskCalculation
