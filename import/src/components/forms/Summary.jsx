import React, { useState, useCallback } from 'react'
import { FiCheckCircle, FiFileText, FiSave, FiEye } from 'react-icons/fi'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import SectionHeader from './SectionHeader'

const Summary = ({ 
    formData, 
    savedRecords, 
    calculateRiskScore, 
    hideHeaders = false 
}) => {
    const [showDetails, setShowDetails] = useState(false)

    const getRiskLevel = useCallback(() => {
        if (typeof calculateRiskScore === 'function') {
            const result = calculateRiskScore(formData)
            return result.level
        }
        return 'Unknown'
    }, [calculateRiskScore, formData])

    const getRiskLevelColor = (level) => {
        switch (level) {
            case 'High': return 'bg-red-100 text-red-800 border-red-200'
            case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-200'
            case 'Low': return 'bg-green-100 text-green-800 border-green-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getAnswerText = (value) => {
        if (value === 'true' || value === 'Yes') return 'Yes'
        if (value === 'false' || value === 'No') return 'No'
        return value || 'Not answered'
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {!hideHeaders && (
                <div className="text-center space-y-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-100">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                        <FiCheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">សេចក្តីសង្ខេប</h2>
                        <p className="text-gray-600 text-lg font-medium mt-2">Form Summary</p>
                    </div>
                </div>
            )}

            {/* Summary Overview */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                {!hideHeaders && (
                    <SectionHeader
                        icon={FiFileText}
                        title="សេចក្តីសង្ខេប"
                        subtitle="Form Summary"
                        gradient="from-emerald-500 to-teal-500"
                        badge="Summary"
                    />
                )}

                <div className="space-y-6">
                    {/* Risk Level Summary */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-3">
                            <FiCheckCircle className="w-6 h-6 text-blue-600" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Risk Assessment Complete</h3>
                                <p className="text-sm text-gray-600">All questions have been answered</p>
                            </div>
                        </div>
                        <Badge className={`px-3 py-1 text-sm font-semibold border ${getRiskLevelColor(getRiskLevel())}`}>
                            {getRiskLevel()} Risk
                        </Badge>
                    </div>

                    {/* Key Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">Assessment Details</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Assessment Date:</span>
                                    <span className="font-medium">{formatDate(formData.assessmentDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Organization Unit:</span>
                                    <span className="font-medium">{formData.orgUnit || 'Not selected'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Sexual Health Concerns:</span>
                                    <span className="font-medium">{getAnswerText(formData.sexualHealthConcerns)}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">Risk Factors</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Had sex past 6 months:</span>
                                    <span className="font-medium">{getAnswerText(formData.hadSexPast6Months)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Number of partners:</span>
                                    <span className="font-medium">{formData.numberOfSexualPartners || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Unprotected sex:</span>
                                    <span className="font-medium">{getAnswerText(formData.sexWithoutCondom)}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Detailed Responses */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold text-gray-900">Detailed Responses</h4>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDetails(!showDetails)}
                                className="flex items-center gap-2"
                            >
                                {showDetails ? <FiEye className="w-4 h-4" /> : <FiFileText className="w-4 h-4" />}
                                {showDetails ? 'Hide Details' : 'Show Details'}
                            </Button>
                        </div>

                        {showDetails && (
                            <div className="space-y-4">
                                {/* Basic Information */}
                                <Card className="p-4">
                                    <h5 className="font-semibold text-gray-900 mb-3">Basic Information</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Assessment Date:</span>
                                            <span className="ml-2 font-medium">{formatDate(formData.assessmentDate)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Organization Unit:</span>
                                            <span className="ml-2 font-medium">{formData.orgUnit || 'Not selected'}</span>
                                        </div>
                                    </div>
                                </Card>

                                {/* Sexual Health Concerns */}
                                <Card className="p-4">
                                    <h5 className="font-semibold text-gray-900 mb-3">Sexual Health Concerns</h5>
                                    <div className="text-sm">
                                        <span className="text-gray-600">Concerned about sexual health:</span>
                                        <span className="ml-2 font-medium">{getAnswerText(formData.sexualHealthConcerns)}</span>
                                    </div>
                                </Card>

                                {/* Sexual Activity */}
                                <Card className="p-4">
                                    <h5 className="font-semibold text-gray-900 mb-3">Sexual Activity</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Had sex past 6 months:</span>
                                            <span className="ml-2 font-medium">{getAnswerText(formData.hadSexPast6Months)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Number of partners:</span>
                                            <span className="ml-2 font-medium">{formData.numberOfSexualPartners || 'Not specified'}</span>
                                        </div>
                                    </div>
                                </Card>

                                {/* Risk Practices */}
                                <Card className="p-4">
                                    <h5 className="font-semibold text-gray-900 mb-3">Risk Practices</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Receive money for sex:</span>
                                            <span className="ml-2 font-medium">{getAnswerText(formData.receiveMoneyForSex)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Paid for sex:</span>
                                            <span className="ml-2 font-medium">{getAnswerText(formData.paidForSex)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Sex with HIV+ partner:</span>
                                            <span className="ml-2 font-medium">{getAnswerText(formData.sexWithHIVPartner)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Sex without condom:</span>
                                            <span className="ml-2 font-medium">{getAnswerText(formData.sexWithoutCondom)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">STI symptoms:</span>
                                            <span className="ml-2 font-medium">{getAnswerText(formData.stiSymptoms)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Abortion:</span>
                                            <span className="ml-2 font-medium">{getAnswerText(formData.abortion)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Alcohol/drugs before sex:</span>
                                            <span className="ml-2 font-medium">{getAnswerText(formData.alcoholDrugBeforeSex)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Group sex/chemsex:</span>
                                            <span className="ml-2 font-medium">{getAnswerText(formData.groupSexChemsex)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Injected drugs/shared needle:</span>
                                            <span className="ml-2 font-medium">{getAnswerText(formData.injectedDrugSharedNeedle)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">None of above:</span>
                                            <span className="ml-2 font-medium">{getAnswerText(formData.noneOfAbove)}</span>
                                        </div>
                                    </div>
                                </Card>

                                {/* Forced Sex */}
                                <Card className="p-4">
                                    <h5 className="font-semibold text-gray-900 mb-3">Forced or Violence</h5>
                                    <div className="text-sm">
                                        <span className="text-gray-600">Forced to have sex:</span>
                                        <span className="ml-2 font-medium">{getAnswerText(formData.forcedSex)}</span>
                                    </div>
                                </Card>

                                {/* PrEP */}
                                <Card className="p-4">
                                    <h5 className="font-semibold text-gray-900 mb-3">PrEP</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Ever on PrEP:</span>
                                            <span className="ml-2 font-medium">{getAnswerText(formData.everOnPrep)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Currently on PrEP:</span>
                                            <span className="ml-2 font-medium">{getAnswerText(formData.currentlyOnPrep)}</span>
                                        </div>
                                    </div>
                                </Card>

                                {/* HIV Testing */}
                                <Card className="p-4">
                                    <h5 className="font-semibold text-gray-900 mb-3">HIV Testing</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Last HIV test date:</span>
                                            <span className="ml-2 font-medium">{formatDate(formData.lastHivTestDate)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">HIV test result:</span>
                                            <span className="ml-2 font-medium">{formData.hivTestResult || 'Not specified'}</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
                        <Button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                                                    <FiSave className="w-4 h-4" />
                        Save Assessment
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                            <FiFileText className="w-4 h-4" />
                            Export PDF
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Summary
