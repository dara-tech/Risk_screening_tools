import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { FiUser, FiActivity, FiCheckCircle, FiAlertTriangle, FiFileText, FiShield, FiTarget } from 'react-icons/fi'
import { Shield, Calculator, User, Activity, CheckCircle, AlertTriangle, FileText, Target, BarChart3 } from 'lucide-react'

const Summary = ({ formData, savedRecords, calculateRiskScore }) => {
    // Calculate risk data for display
    const riskData = calculateRiskScore ? calculateRiskScore() : {
        score: formData.riskScore || 0,
        riskLevel: formData.riskLevel || 'Low',
        riskFactors: formData.riskFactors || [],
        recommendations: formData.recommendations || []
    }
    
    const getRiskLevelColor = (level) => {
        switch (level) {
            case 'Very High': return 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
            case 'High': return 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
            case 'Medium': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
            case 'Low': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
            default: return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
        }
    }

    const getRiskLevelIcon = (level) => {
        switch (level) {
            case 'Very High': return <AlertTriangle className="w-6 h-6 text-red-600" />
            case 'High': return <AlertTriangle className="w-6 h-6 text-orange-600" />
            case 'Medium': return <AlertTriangle className="w-6 h-6 text-yellow-600" />
            case 'Low': return <CheckCircle className="w-6 h-6 text-green-600" />
            default: return <AlertTriangle className="w-6 h-6 text-gray-600" />
        }
    }

    const getRiskLevelGradient = (level) => {
        switch (level) {
            case 'Very High': return 'from-red-50 to-pink-50 border-red-200'
            case 'High': return 'from-orange-50 to-red-50 border-orange-200'
            case 'Medium': return 'from-yellow-50 to-orange-50 border-yellow-200'
            case 'Low': return 'from-green-50 to-emerald-50 border-green-200'
            default: return 'from-gray-50 to-slate-50 border-gray-200'
        }
    }

    const SummaryCard = ({ icon: Icon, title, subtitle, gradient = "from-blue-500 to-indigo-500", children }) => (
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-gray-900">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <span>{title}</span>
                        {subtitle && (
                            <p className="text-sm text-gray-500 font-normal mt-1">{subtitle}</p>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )

    const InfoRow = ({ label, value, className = "" }) => (
        <div className={`${className}`}>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</label>
            <p className="text-sm font-semibold text-gray-900">{value || 'Not provided'}</p>
        </div>
    )

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                    <FileText className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Screening Summary</h2>
                    <p className="text-gray-600 text-sm font-medium mt-1">Review all information before saving</p>
                </div>
            </div>

            {/* Risk Assessment Overview */}
            <div className={`bg-gradient-to-br ${getRiskLevelGradient(riskData.riskLevel)} rounded-2xl border p-8`}>
                <div className="text-center space-y-6">
                    <div className="flex items-center justify-center space-x-3">
                        {getRiskLevelIcon(riskData.riskLevel)}
                        <h3 className="text-xl font-bold text-gray-900">Risk Assessment Summary</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200">
                                <div className="text-3xl font-bold text-gray-900">
                                    {riskData.score}
                                </div>
                            </div>
                            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Risk Score</div>
                        </div>

                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200">
                                <Badge 
                                    className={`text-lg px-4 py-2 ${getRiskLevelColor(riskData.riskLevel)} border-0`}
                                >
                                    {riskData.riskLevel}
                                </Badge>
                            </div>
                            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Risk Level</div>
                        </div>

                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200">
                                <div className="text-3xl font-bold text-gray-900">
                                    {riskData.riskFactors?.length || 0}
                                </div>
                            </div>
                            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Risk Factors</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Client Information Summary */}
            <SummaryCard 
                icon={User} 
                title="Client Information" 
                subtitle="Demographic and personal details"
                gradient="from-blue-500 to-indigo-500"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoRow label="System ID" value={formData.systemId || 'Auto-generated'} />
                    <InfoRow label="UUIC" value={formData.uuic} />
                    <InfoRow label="Full Name" value={`${formData.familyName} ${formData.lastName}`} />
                    <InfoRow label="Sex" value={formData.sex} />
                    <InfoRow label="Date of Birth" value={formData.dateOfBirth} />
                    <InfoRow 
                        label="Location" 
                        value={`${formData.province}, ${formData.od}, ${formData.district}, ${formData.commune}`} 
                    />
                </div>
            </SummaryCard>

            {/* Key Risk Factors */}
            {riskData.riskFactors && riskData.riskFactors.length > 0 && (
                <SummaryCard 
                    icon={AlertTriangle} 
                    title="Key Risk Factors" 
                    subtitle="Identified risk factors"
                    gradient="from-red-500 to-pink-500"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {riskData.riskFactors.map((factor, index) => (
                            <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200 hover:border-red-300 transition-all duration-200">
                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="w-4 h-4 text-red-600" />
                                </div>
                                <span className="text-sm font-medium text-red-800">{factor}</span>
                            </div>
                        ))}
                    </div>
                </SummaryCard>
            )}

            {/* Recommendations */}
            {riskData.recommendations && riskData.recommendations.length > 0 && (
                <SummaryCard 
                    icon={Target} 
                    title="Recommendations" 
                    subtitle="Suggested interventions and actions"
                    gradient="from-green-500 to-emerald-500"
                >
                    <div className="space-y-3">
                        {riskData.recommendations.map((recommendation, index) => (
                            <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:border-green-300 transition-all duration-200">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Target className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="text-sm font-medium text-green-800">{recommendation}</span>
                            </div>
                        ))}
                    </div>
                </SummaryCard>
            )}

            {/* Clinical Data Summary */}
            <SummaryCard 
                icon={Activity} 
                title="Clinical Information" 
                subtitle="Medical and testing data"
                gradient="from-purple-500 to-pink-500"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoRow label="HIV Test Result" value={formData.hivTestResult} />
                    <InfoRow label="STI Symptoms" value={formData.stiSymptoms} />
                    <InfoRow label="Currently on PrEP" value={formData.currentlyOnPrep} />
                    <InfoRow label="Number of Partners" value={formData.numberOfSexualPartners} />
                    <InfoRow label="Sex without Condom" value={formData.sexWithoutCondom} />
                    <InfoRow label="Injected Drug/Shared Needle" value={formData.injectedDrugSharedNeedle} />
                    <InfoRow label="Syphilis Positive" value={formData.syphilisPositive} />
                    <InfoRow label="Last HIV Test Date" value={formData.lastHivTestDate} />
                    <InfoRow label="Risk Screening Result" value={formData.riskScreeningResult} />
                </div>
            </SummaryCard>

            {/* Data Quality Check */}
            <SummaryCard 
                icon={BarChart3} 
                title="Data Quality Check" 
                subtitle="Validation and completeness"
                gradient="from-indigo-500 to-purple-500"
            >
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-green-800">Basic information completed</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-green-800">Risk assessment completed</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-green-800">Clinical data recorded</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-green-800">Risk score calculated</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-green-800">Recommendations generated</span>
                    </div>
                </div>
            </SummaryCard>

            {/* Confirmation Message */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-emerald-800">Ready to Save</h3>
                        <p className="text-emerald-700 text-sm font-medium mt-1">
                            All information has been collected and validated. Click "Save Screening" to store this risk assessment in the system.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Summary
