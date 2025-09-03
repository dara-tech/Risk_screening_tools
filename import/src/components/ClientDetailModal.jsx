import React from 'react'
import { FiX, FiMapPin, FiActivity, FiShield, FiDroplet, FiInfo, FiCheckCircle, FiXCircle, FiFileText, FiDatabase, FiAlertTriangle } from 'react-icons/fi'
import { User } from 'lucide-react'

const ClientDetailModal = ({ isOpen, onClose, record }) => {
    if (!isOpen || !record) return null

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatBoolean = (value) => {
        if (value === 'true' || value === true) return 'Yes'
        if (value === 'false' || value === false) return 'No'
        return 'Not specified'
    }

    const getRiskLevelColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'low': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
            case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200'
            case 'high': return 'bg-orange-50 text-orange-700 border-orange-200'
            case 'very high': return 'bg-red-50 text-red-700 border-red-200'
            default: return 'bg-slate-50 text-slate-700 border-slate-200'
        }
    }

    const riskFactors = [
        { key: 'sexWithHIVPartner', label: 'Sex with HIV+ Partner', severity: 'High', category: 'Sexual Risk' },
        { key: 'sexWithoutCondom', label: 'Sex without Condom', severity: 'Medium', category: 'Sexual Risk' },
        { key: 'stiSymptoms', label: 'STI Symptoms', severity: 'Medium', category: 'Health Status' },
        { key: 'syphilisPositive', label: 'Syphilis Positive', severity: 'High', category: 'Health Status' },
        { key: 'receiveMoneyForSex', label: 'Receive Money for Sex', severity: 'High', category: 'Behavioral Risk' },
        { key: 'paidForSex', label: 'Paid for Sex', severity: 'High', category: 'Behavioral Risk' },
        { key: 'injectedDrugSharedNeedle', label: 'Injected Drug/Shared Needle', severity: 'Very High', category: 'Substance Use' },
        { key: 'alcoholDrugBeforeSex', label: 'Alcohol/Drug Before Sex', severity: 'Medium', category: 'Substance Use' },
        { key: 'groupSexChemsex', label: 'Group Sex/Chemsex', severity: 'High', category: 'Behavioral Risk' },
        { key: 'abortion', label: 'Abortion', severity: 'Medium', category: 'Reproductive Health' },
        { key: 'forcedSex', label: 'Forced Sex', severity: 'Very High', category: 'Violence' },
        { key: 'noneOfAbove', label: 'None of Above', severity: 'Low', category: 'General' }
    ]

    const activeRiskFactors = riskFactors.filter(factor => record[factor.key] === 'true')
    const riskFactorCategories = [...new Set(activeRiskFactors.map(f => f.category))]

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden border border-gray-200">
                
                {/* Government-Style Header */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">
                                    National Client Profile
                                </h1>
                                <p className="text-blue-100">
                                    Comprehensive Health Screening Record
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-blue-100">Record ID: {record.systemId || record.id}</p>
                            <p className="text-sm text-blue-100">UUIC: {record.uuic || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Client Identity Bar */}
                <div className="bg-gray-50 border-b border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {[record.familyName, record.lastName].filter(Boolean).join(' ') || 'Unknown Client'}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {record.sex} • Age: {record.age || 'N/A'} • {record.genderIdentity || 'Gender not specified'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <FiX className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(95vh-200px)] p-8">
                    <div className="max-w-6xl mx-auto space-y-8">
                        
                        {/* Executive Summary */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                                <FiFileText className="w-5 h-5 mr-2" />
                                Executive Summary
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-white p-4 rounded-lg border border-blue-100">
                                    <div className="text-sm text-blue-600 font-medium mb-1">Risk Assessment</div>
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getRiskLevelColor(record.riskScreeningResult)}`}>
                                        {record.riskScreeningResult || 'Not assessed'}
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-blue-100">
                                    <div className="text-sm text-blue-600 font-medium mb-1">Risk Score</div>
                                    <div className="text-lg font-bold text-gray-900">{record.riskScreeningScore || 'Not calculated'}</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-blue-100">
                                    <div className="text-sm text-blue-600 font-medium mb-1">Active Risk Factors</div>
                                    <div className="text-lg font-bold text-gray-900">{activeRiskFactors.length}</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-blue-100">
                                    <div className="text-sm text-blue-600 font-medium mb-1">Last Screening</div>
                                    <div className="text-sm font-semibold text-gray-900">{formatDate(record.eventDate)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Personal Information */}
                            <div className="space-y-6">
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-blue-600" />
                                        Personal Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <p className="text-base text-gray-900 font-medium p-2 bg-gray-50 rounded border">
                                                {[record.familyName, record.lastName].filter(Boolean).join(' ') || 'Not available'}
                                            </p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                                                <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{record.sex || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender Identity</label>
                                                <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{record.genderIdentity || 'Not specified'}</p>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{formatDate(record.dateOfBirth)}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{record.age ? `${record.age} years` : 'Not calculated'}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Sex at Birth</label>
                                            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{record.sexAtBirth || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Geographic Information */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FiMapPin className="w-5 h-5 mr-2 text-green-600" />
                                        Geographic Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                                            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{record.province || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{record.district || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Commune</label>
                                            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{record.commune || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Operational District (OD)</label>
                                            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{record.od || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Risk Assessment & Factors */}
                            <div className="space-y-6">
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FiShield className="w-5 h-5 mr-2 text-orange-600" />
                                        Risk Assessment
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
                                            <div className={`inline-flex items-center px-4 py-2 rounded-lg text-base font-semibold border ${getRiskLevelColor(record.riskScreeningResult)}`}>
                                                {record.riskScreeningResult || 'Not assessed'}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Risk Score</label>
                                            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{record.riskScreeningScore || 'Not calculated'}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Screening Date</label>
                                            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{formatDate(record.eventDate)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Risk Factors by Category */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FiAlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                                        Risk Factors ({activeRiskFactors.length})
                                    </h3>
                                    {activeRiskFactors.length > 0 ? (
                                        <div className="space-y-4">
                                            {riskFactorCategories.map(category => {
                                                const categoryFactors = activeRiskFactors.filter(f => f.category === category)
                                                return (
                                                    <div key={category} className="border border-gray-200 rounded-lg p-4">
                                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">{category}</h4>
                                                        <div className="space-y-2">
                                                            {categoryFactors.map(({ key, label, severity }) => (
                                                                <div key={key} className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-100">
                                                                    <div className="flex items-center space-x-2">
                                                                        <FiCheckCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                                                        <span className="text-sm text-gray-700">{label}</span>
                                                                    </div>
                                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                                        severity === 'Very High' ? 'bg-red-100 text-red-700' :
                                                                        severity === 'High' ? 'bg-orange-100 text-orange-700' :
                                                                        severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                        'bg-green-100 text-green-700'
                                                                    }`}>
                                                                        {severity}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic p-4 bg-green-50 rounded border border-green-100">
                                            No risk factors identified - Client appears to be at low risk
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Clinical & Behavioral Data */}
                            <div className="space-y-6">
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FiActivity className="w-5 h-5 mr-2 text-purple-600" />
                                        Sexual Health Assessment
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Sexual Activity (Past 6 Months)</label>
                                            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{formatBoolean(record.hadSexPast6Months)}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Sexual Partners</label>
                                            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{record.numberOfSexualPartners || 'Not specified'}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Sexual Health Concerns</label>
                                            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{record.sexualHealthConcerns || 'Not specified'}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Past 6 Months Practices</label>
                                            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{record.past6MonthsPractices || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Partner Information */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-indigo-600" />
                                        Partner Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                                            <span className="text-sm text-gray-700">Male Partners</span>
                                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${record.partnerMale === 'true' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {formatBoolean(record.partnerMale)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                                            <span className="text-sm text-gray-700">Female Partners</span>
                                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${record.partnerFemale === 'true' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {formatBoolean(record.partnerFemale)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                                            <span className="text-sm text-gray-700">Transgender Women Partners</span>
                                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${record.partnerTGW === 'true' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {formatBoolean(record.partnerTGW)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* HIV Testing & Prevention */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FiDroplet className="w-5 h-5 mr-2 text-red-600" />
                                        HIV Testing & Prevention
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">HIV Test (Past 6 Months)</label>
                                            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{formatBoolean(record.hivTestPast6Months)}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">HIV Test Result</label>
                                            <div className={`inline-flex items-center px-4 py-2 rounded-lg text-base font-semibold border ${
                                                record.hivTestResult === 'Positive' ? 'bg-red-100 text-red-700 border-red-200' :
                                                record.hivTestResult === 'Negative' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                                'bg-gray-100 text-gray-700 border-gray-200'
                                            }`}>
                                                {record.hivTestResult || 'Not specified'}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last HIV Test Date</label>
                                            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{formatDate(record.lastHivTestDate)}</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Currently on PrEP</label>
                                                <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{formatBoolean(record.currentlyOnPrep)}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Ever on PrEP</label>
                                                <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{formatBoolean(record.everOnPrep)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Information */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FiDatabase className="w-5 h-5 mr-2 text-gray-600" />
                                System Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">System ID</label>
                                    <p className="text-sm font-mono text-gray-900 p-2 bg-white rounded border">{record.systemId || 'Not available'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">UUIC</label>
                                    <p className="text-sm font-mono text-gray-900 p-2 bg-white rounded border">{record.uuic || 'Not available'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Record ID</label>
                                    <p className="text-sm font-mono text-gray-900 p-2 bg-white rounded border">{record.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-100 border-t border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Last Updated:</span> {formatDate(record.eventDate)} • 
                            <span className="font-medium ml-2">Total Risk Factors:</span> {activeRiskFactors.length}
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Close Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClientDetailModal

