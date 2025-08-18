import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Calculator, TrendingUp, AlertTriangle, CheckCircle, Info, BarChart3, Target, Shield } from 'lucide-react'

const RiskCalculation = ({ formData, updateFormData, calculateRiskScore }) => {
    const [riskData, setRiskData] = useState(null)
    const [showDetails, setShowDetails] = useState(false)

    useEffect(() => {
        const data = calculateRiskScore()
        setRiskData(data)
        // Only update form data if it's different to avoid infinite loops
        if (!riskData || JSON.stringify(data) !== JSON.stringify(riskData)) {
            updateFormData(data)
        }
    }, [formData, calculateRiskScore]) // Removed updateFormData from dependencies

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
            case 'Medium': return <Info className="w-6 h-6 text-yellow-600" />
            case 'Low': return <CheckCircle className="w-6 h-6 text-green-600" />
            default: return <Info className="w-6 h-6 text-gray-600" />
        }
    }

    const getProgressColor = (score) => {
        if (score >= 50) return 'bg-gradient-to-r from-red-500 to-pink-500'
        if (score >= 35) return 'bg-gradient-to-r from-orange-500 to-red-500'
        if (score >= 20) return 'bg-gradient-to-r from-yellow-500 to-orange-500'
        return 'bg-gradient-to-r from-green-500 to-emerald-500'
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

    if (!riskData) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="text-gray-600 font-medium">Calculating risk assessment...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
                    <Calculator className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Risk Calculation</h2>
                    <p className="text-gray-600 text-sm font-medium mt-1">Comprehensive STI and HIV risk assessment</p>
                </div>
            </div>

            {/* Risk Score Overview */}
            <div className={`bg-gradient-to-br ${getRiskLevelGradient(riskData.riskLevel)} rounded-2xl border p-8`}>
                <div className="text-center space-y-6">
                    <div className="flex items-center justify-center space-x-3">
                        {getRiskLevelIcon(riskData.riskLevel)}
                        <h3 className="text-xl font-bold text-gray-900">Risk Assessment Summary</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Risk Score */}
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200">
                                <div className="text-3xl font-bold text-gray-900">
                                    {riskData.score}
                                </div>
                            </div>
                            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Risk Score</div>
                            <div className="w-full">
                                <Progress 
                                    value={Math.min(riskData.score, 100)} 
                                    className="h-3 bg-gray-200 rounded-full overflow-hidden"
                                    style={{
                                        '--progress-color': getProgressColor(riskData.score)
                                    }}
                                />
                            </div>
                        </div>

                        {/* Risk Level */}
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

                        {/* Risk Factors Count */}
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200">
                                <div className="text-3xl font-bold text-gray-900">
                                    {riskData.riskFactors.length}
                                </div>
                            </div>
                            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Risk Factors</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Factors Breakdown */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-gray-900">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <span>Risk Factors Identified</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {riskData.riskFactors.length > 0 ? (
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
                        ) : (
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <p className="text-green-700 font-medium">No significant risk factors identified</p>
                                <p className="text-green-600 text-sm mt-1">Continue practicing safe behaviors</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-gray-900">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                            <Target className="w-5 h-5 text-white" />
                        </div>
                        <span>Recommendations</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {riskData.recommendations.length > 0 ? (
                            <div className="space-y-3">
                                {riskData.recommendations.map((recommendation, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-200">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Target className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="text-sm font-medium text-blue-800">{recommendation}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <p className="text-green-700 font-medium">No specific recommendations at this time</p>
                                <p className="text-green-600 text-sm mt-1">Continue with regular health check-ups</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Risk Analysis */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-lg font-semibold text-gray-900">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <span>Detailed Risk Analysis</span>
                        </div>
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-200"
                        >
                            {showDetails ? 'Hide Details' : 'Show Details'}
                        </button>
                    </CardTitle>
                </CardHeader>
                {showDetails && (
                    <CardContent>
                        <div className="space-y-6">
                            {/* Sexual Behavior Risk */}
                            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                                <h4 className="font-semibold text-red-900 mb-3 flex items-center space-x-2">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>Sexual Behavior Risk</span>
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-red-700">Multiple sexual partners (≥3):</span>
                                        <span className={formData.numberOfSexualPartners >= 3 ? 'text-red-600 font-semibold' : 'text-red-600'}>
                                            {formData.numberOfSexualPartners >= 3 ? 'Yes (+10 points)' : 'No'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-red-700">No condom use:</span>
                                        <span className={formData.sexWithoutCondom === 'true' ? 'text-red-600 font-semibold' : 'text-red-600'}>
                                            {formData.sexWithoutCondom === 'true' ? 'Yes (+15 points)' : 'No'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-red-700">Sex with HIV+ partner:</span>
                                        <span className={formData.sexWithHIVPartner === 'true' ? 'text-red-600 font-semibold' : 'text-red-600'}>
                                            {formData.sexWithHIVPartner === 'true' ? 'Yes (+20 points)' : 'No'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Clinical Risk */}
                            <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                                <h4 className="font-semibold text-orange-900 mb-3 flex items-center space-x-2">
                                    <Shield className="w-4 h-4" />
                                    <span>Clinical Risk</span>
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-orange-700">STI symptoms:</span>
                                        <span className={formData.stiSymptoms === 'true' ? 'text-orange-600 font-semibold' : 'text-orange-600'}>
                                            {formData.stiSymptoms === 'true' ? 'Yes (+15 points)' : 'No'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-orange-700">Syphilis positive:</span>
                                        <span className={formData.syphilisPositive === 'true' ? 'text-orange-600 font-semibold' : 'text-orange-600'}>
                                            {formData.syphilisPositive === 'true' ? 'Yes (+15 points)' : 'No'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-orange-700">HIV positive:</span>
                                        <span className={formData.hivTestResult === 'Positive' ? 'text-orange-600 font-semibold' : 'text-orange-600'}>
                                            {formData.hivTestResult === 'Positive' ? 'Yes (+25 points)' : 'No'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Substance Use Risk */}
                            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                                <h4 className="font-semibold text-yellow-900 mb-3 flex items-center space-x-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>Substance Use Risk</span>
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-yellow-700">Drug use before sex:</span>
                                        <span className={formData.alcoholDrugBeforeSex === 'true' ? 'text-yellow-600 font-semibold' : 'text-yellow-600'}>
                                            {formData.alcoholDrugBeforeSex === 'true' ? 'Yes (+12 points)' : 'No'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-yellow-700">Needle sharing:</span>
                                        <span className={formData.injectedDrugSharedNeedle === 'true' ? 'text-yellow-600 font-semibold' : 'text-yellow-600'}>
                                            {formData.injectedDrugSharedNeedle === 'true' ? 'Yes (+20 points)' : 'No'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-yellow-700">Chemsex:</span>
                                        <span className={formData.groupSexChemsex === 'true' ? 'text-yellow-600 font-semibold' : 'text-yellow-600'}>
                                            {formData.groupSexChemsex === 'true' ? 'Yes (+15 points)' : 'No'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Risk Level Explanation */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-gray-900">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <Info className="w-5 h-5 text-white" />
                        </div>
                        <span>Risk Level Explanation</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                            <h4 className="font-semibold text-red-800 mb-2">Very High Risk (50+ points)</h4>
                            <p className="text-sm text-red-700">
                                Immediate intervention recommended. High likelihood of STI/HIV exposure. 
                                Consider urgent testing, counseling, and prevention services.
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                            <h4 className="font-semibold text-orange-800 mb-2">High Risk (35-49 points)</h4>
                            <p className="text-sm text-orange-700">
                                Significant risk factors present. Regular testing and prevention 
                                counseling strongly recommended.
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                            <h4 className="font-semibold text-yellow-800 mb-2">Medium Risk (20-34 points)</h4>
                            <p className="text-sm text-yellow-700">
                                Some risk factors identified. Periodic testing and education recommended.
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2">Low Risk (0-19 points)</h4>
                            <p className="text-sm text-green-700">
                                Minimal risk factors. Continue safe practices and regular health check-ups.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default RiskCalculation
