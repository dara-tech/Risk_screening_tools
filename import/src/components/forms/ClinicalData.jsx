import React, { useState, useCallback } from 'react'
import { FiActivity, FiDroplet, FiShield, FiTrendingUp, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import FieldWrapper from './FieldWrapper'
import SectionHeader from './SectionHeader'

const ClinicalData = ({ 
    formData, 
    updateFormData, 
    formOptions = {}, 
    hideHeaders = false, 
    kmLabels = {} 
}) => {
    const [focusedField, setFocusedField] = useState(null)

    const handleInputChange = useCallback((field, value) => {
        updateFormData({ [field]: value })
    }, [updateFormData])

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {!hideHeaders && (
                <div className="text-center space-y-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                        <FiActivity className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">ធ្លាប់រួមភេទ</h2>
                        <p className="text-gray-600 text-lg font-medium mt-2">Ever sex before - Questions 4-12</p>
                    </div>
                </div>
            )}



            {/* Questions 4-5: Sexual Activity */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                {!hideHeaders && (
                    <SectionHeader
                        icon={FiActivity}
                        title="ធ្លាប់រួមភេទ"
                        subtitle="Ever sex before"
                        gradient="from-green-500 to-emerald-500"
                        badge="Required"
                    />
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FieldWrapper
                        label={kmLabels.hadSexPast6Months || "តើធ្លាប់មានរួមភេទ (មាត់ ឬរន្ធគណិត ឬរន្ធយោនី) ក្នុងរយៈពេល៦ខែចុងក្រោយដែរឬទេ? / Have you had sex (Oral, Anal or vaginal) in the past 6 months?"}
                        tooltip="Whether the client has been sexually active in the past 6 months"
                        status={formData.hadSexPast6Months ? "success" : "default"}
                    >
                        <Select value={formData.hadSexPast6Months} onValueChange={(value) => handleInputChange('hadSexPast6Months', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-green-300 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-green-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-green-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.numberOfSexualPartners || "តើអ្នកមានដៃគូរួមភេទប៉ុន្មាននាក់? / How many sexual partners do you have?"}
                        tooltip="Total number of sexual partners in the past 6 months"
                        status={formData.numberOfSexualPartners ? "success" : "default"}
                    >
                        <Select value={formData.numberOfSexualPartners} onValueChange={(value) => handleInputChange('numberOfSexualPartners', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-green-300 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select number" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="0" className="hover:bg-green-50 py-3">0</SelectItem>
                                <SelectItem value="1" className="hover:bg-green-50 py-3">1</SelectItem>
                                <SelectItem value="2" className="hover:bg-green-50 py-3">2</SelectItem>
                                <SelectItem value="3" className="hover:bg-green-50 py-3">3</SelectItem>
                                <SelectItem value="4" className="hover:bg-green-50 py-3">4</SelectItem>
                                <SelectItem value="5" className="hover:bg-green-50 py-3">5</SelectItem>
                                <SelectItem value="6+" className="hover:bg-green-50 py-3">6+</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                </div>
            </div>

            {/* Questions 4.1-4.3: Partner Identity */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                {!hideHeaders && (
                    <SectionHeader
                        icon={FiActivity}
                        title="អត្តសញ្ញាណភេទដៃគូ"
                        subtitle="Partner's Sexual Identity"
                        gradient="from-blue-500 to-indigo-500"
                        badge="Required"
                    />
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FieldWrapper
                        label={kmLabels.partnerMale || "៤.១ អត្តសញ្ញាណភេទដៃគូរបស់អ្នកគឺប្រុស / Your partner's sexual identify is Male"}
                        tooltip="Whether the partner identifies as male"
                        status={formData.partnerMale ? "success" : "default"}
                    >
                        <Select value={formData.partnerMale} onValueChange={(value) => handleInputChange('partnerMale', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-blue-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-blue-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.partnerFemale || "៤.២ អត្តសញ្ញាណភេទដៃគូរបស់អ្នកគឺស្រី / Your partner's sexual identify is Female"}
                        tooltip="Whether the partner identifies as female"
                        status={formData.partnerFemale ? "success" : "default"}
                    >
                        <Select value={formData.partnerFemale} onValueChange={(value) => handleInputChange('partnerFemale', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-blue-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-blue-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.partnerTGW || "៤.៣ អត្តសញ្ញាណភេទដៃគូរបស់អ្នកគឺ TGW / Your partner's sexual identify is TGW"}
                        tooltip="Whether the partner identifies as TGW (Transgender Woman)"
                        status={formData.partnerTGW ? "success" : "default"}
                    >
                        <Select value={formData.partnerTGW} onValueChange={(value) => handleInputChange('partnerTGW', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-blue-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-blue-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                </div>
            </div>

            {/* Questions 6.1-6.10: Practices */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                {!hideHeaders && (
                    <SectionHeader
                        icon={FiDroplet}
                        title="ធ្លាប់អនុវត្តកំឡូង៦ខែចុងក្រោយ"
                        subtitle="Have had the following practice in the past 6 months?"
                        gradient="from-orange-500 to-red-500"
                        badge="Required"
                    />
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FieldWrapper
                        label={kmLabels.receiveMoneyForSex || "ទទួលបានលុយ ឬទំនិញសម្រាប់រួមភេទ / Receive money or goods for sex"}
                        tooltip="Sex work activities with multiple partners"
                        status={formData.receiveMoneyForSex ? "success" : "default"}
                    >
                        <Select value={formData.receiveMoneyForSex} onValueChange={(value) => handleInputChange('receiveMoneyForSex', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-orange-300 focus:ring-4 focus:ring-orange-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-orange-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-orange-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.paidForSex || "បង់លុយសម្រាប់រួមភេទ / Paid for sex"}
                        tooltip="Commercial sex activity with unknown partners"
                        status={formData.paidForSex ? "success" : "default"}
                    >
                        <Select value={formData.paidForSex} onValueChange={(value) => handleInputChange('paidForSex', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-orange-300 focus:ring-4 focus:ring-orange-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-orange-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-orange-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.sexWithHIVPartner || "រួមភេទជាមួយដៃគូដែលដឹងថាមានមេរោគអេដស៍ / Sex with known HIV+ partner(s)"}
                        tooltip="Direct exposure to HIV infection"
                        status={formData.sexWithHIVPartner ? "success" : "default"}
                    >
                        <Select value={formData.sexWithHIVPartner} onValueChange={(value) => handleInputChange('sexWithHIVPartner', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-orange-300 focus:ring-4 focus:ring-orange-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-orange-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-orange-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.sexWithoutCondom || "រួមភេទដោយមិនប្រើកុងដូម / Sex without a condom"}
                        tooltip="Unprotected sexual activity increases STI transmission risk"
                        status={formData.sexWithoutCondom ? "success" : "default"}
                    >
                        <Select value={formData.sexWithoutCondom} onValueChange={(value) => handleInputChange('sexWithoutCondom', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-orange-300 focus:ring-4 focus:ring-orange-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-orange-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-orange-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.stiSymptoms || "មានរោគសញ្ញារបស់ជំងឺឆ្លងតាមរយៈរួមភេទ / Have a STI symptom"}
                        tooltip="Any current symptoms of sexually transmitted infections"
                        status={formData.stiSymptoms ? "success" : "default"}
                    >
                        <Select value={formData.stiSymptoms} onValueChange={(value) => handleInputChange('stiSymptoms', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-orange-300 focus:ring-4 focus:ring-orange-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-orange-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-orange-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.abortion || "ធ្វើខ្សោះ / Abortion"}
                        tooltip="Pregnancy termination history"
                        status={formData.abortion ? "success" : "default"}
                    >
                        <Select value={formData.abortion} onValueChange={(value) => handleInputChange('abortion', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-orange-300 focus:ring-4 focus:ring-orange-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-orange-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-orange-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.alcoholDrugBeforeSex || "ផឹកគ្រឿងស្រវឹង/ថ្នាំមុនរួមភេទ / Alcohol/drug before sex"}
                        tooltip="Substance use affecting decision making"
                        status={formData.alcoholDrugBeforeSex ? "success" : "default"}
                    >
                        <Select value={formData.alcoholDrugBeforeSex} onValueChange={(value) => handleInputChange('alcoholDrugBeforeSex', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-orange-300 focus:ring-4 focus:ring-orange-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-orange-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-orange-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.groupSexChemsex || "រួមភេទជាក្រុម ឬរួមភេទជាមួយថ្នាំ / Joint high fun or group sex or chemsex"}
                        tooltip="Multiple partners or drug-enhanced sex"
                        status={formData.groupSexChemsex ? "success" : "default"}
                    >
                        <Select value={formData.groupSexChemsex} onValueChange={(value) => handleInputChange('groupSexChemsex', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-orange-300 focus:ring-4 focus:ring-orange-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-orange-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-orange-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.injectedDrugSharedNeedle || "ចាក់ថ្នាំ/ប្រើម្ជុលរួមគ្នា / Injected drug/shared needle"}
                        tooltip="Needle sharing risk for blood-borne infections"
                        status={formData.injectedDrugSharedNeedle ? "success" : "default"}
                    >
                        <Select value={formData.injectedDrugSharedNeedle} onValueChange={(value) => handleInputChange('injectedDrugSharedNeedle', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-orange-300 focus:ring-4 focus:ring-orange-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-orange-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-orange-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.noneOfAbove || "គ្មានអ្វីខាងលើ / None of the above"}
                        tooltip="If none of the risk factors apply"
                        status={formData.noneOfAbove ? "success" : "default"}
                    >
                        <Select value={formData.noneOfAbove} onValueChange={(value) => handleInputChange('noneOfAbove', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-orange-300 focus:ring-4 focus:ring-orange-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-orange-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-orange-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                </div>
            </div>

            {/* Question 7: Forced Sex */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                {!hideHeaders && (
                    <SectionHeader
                        icon={FiShield}
                        title="ធ្លាប់រងហឹង្សា"
                        subtitle="Forced or Violence"
                        gradient="from-red-500 to-pink-500"
                        badge="Required"
                    />
                )}
                
                <div className="grid grid-cols-1 gap-6">
                    <FieldWrapper
                        label={kmLabels.forcedSex || "តើធ្លាប់ត្រូវបានបង្ខំឱ្យរួមភេទទាស់នឹងឆន្ទៈរបស់អ្នកក្នុងរយៈពេល៦ខែចុងក្រោយដែរឬទេ? / Have you ever been forced to have sex against your wishes in past 6 months?"}
                        tooltip="History of sexual coercion or assault"
                        status={formData.forcedSex ? "success" : "default"}
                    >
                        <Select value={formData.forcedSex} onValueChange={(value) => handleInputChange('forcedSex', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-red-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-red-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                </div>
            </div>

            {/* Questions 9-10: PrEP */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                {!hideHeaders && (
                    <SectionHeader
                        icon={FiShield}
                        title="សេវាប្រីព"
                        subtitle="PrEP"
                        gradient="from-blue-500 to-indigo-500"
                        badge="Prevention"
                    />
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FieldWrapper
                        label={kmLabels.everOnPrep || "តើធ្លាប់ប្រើប្រីពដែរឬទេ? / Have you ever on PrEP"}
                        tooltip="Whether client has ever taken PrEP medication"
                        status={formData.everOnPrep ? "success" : "default"}
                    >
                        <Select value={formData.everOnPrep} onValueChange={(value) => handleInputChange('everOnPrep', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-blue-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-blue-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.currentlyOnPrep || "បច្ចុប្បន្នកំពុងប្រើប្រីព / Currently on PrEP"}
                        tooltip="Whether client is currently taking PrEP medication"
                        status={formData.currentlyOnPrep ? "success" : "default"}
                    >
                        <Select value={formData.currentlyOnPrep} onValueChange={(value) => handleInputChange('currentlyOnPrep', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-blue-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-blue-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                </div>
            </div>

            {/* Questions 11-12: HIV Testing */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                {!hideHeaders && (
                    <SectionHeader
                        icon={FiDroplet}
                        title="ធ្លាប់បានតេស្តមេរោគអេដស៍កំឡូង១២ខែចុងក្រោយ"
                        subtitle="Have test for HIV in the past 12 months?"
                        gradient="from-purple-500 to-pink-500"
                        badge="Critical"
                    />
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FieldWrapper
                        label={kmLabels.lastHivTestDate || "តើអ្នកបានតេស្តមេរោគអេដស៍លើកចុងក្រោយនៅពេលណា? / When did your last HIV test?"}
                        tooltip="Date of the most recent HIV test"
                        status={formData.lastHivTestDate ? "success" : "default"}
                    >
                        <Input
                            type="date"
                            value={formData.lastHivTestDate}
                            onChange={(e) => handleInputChange('lastHivTestDate', e.target.value)}
                            className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition-all duration-300 hover:border-gray-300"
                            onFocus={() => setFocusedField('lastHivTestDate')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.hivTestResult || "លទ្ធផលតេស្តមេរោគអេដស៍ប្រសិនបើអ្នកអាចប្រាប់បាន? / Result of HIV test if you can tell?"}
                        tooltip="Result of the most recent HIV test"
                        status={formData.hivTestResult ? "success" : "default"}
                    >
                        <Select value={formData.hivTestResult} onValueChange={(value) => handleInputChange('hivTestResult', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select result" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Negative" className="hover:bg-purple-50 py-3">Negative</SelectItem>
                                <SelectItem value="Positive" className="hover:bg-purple-50 py-3">Positive</SelectItem>
                                <SelectItem value="Unknown" className="hover:bg-purple-50 py-3">Unknown</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                </div>
            </div>


        </div>
    )
}

// Helper functions for risk assessment
const calculateRiskScore = (formData) => {
    let score = 0
    
    // Basic sexual activity
    if (formData.hadSexPast6Months === 'Yes') score += 5
    
    // Number of partners
    if (formData.numberOfSexualPartners === '1') score += 5
    else if (formData.numberOfSexualPartners === '2') score += 10
    else if (formData.numberOfSexualPartners === '3') score += 15
    else if (formData.numberOfSexualPartners === '4') score += 20
    else if (formData.numberOfSexualPartners === '5') score += 25
    else if (formData.numberOfSexualPartners === '6+') score += 30
    
    // High risk activities
    if (formData.receiveMoneyForSex === 'Yes') score += 25
    if (formData.paidForSex === 'Yes') score += 20
    if (formData.sexWithHIVPartner === 'Yes') score += 30
    if (formData.sexWithoutCondom === 'Yes') score += 20
    if (formData.stiSymptoms === 'Yes') score += 25
    if (formData.injectedDrugSharedNeedle === 'Yes') score += 30
    if (formData.alcoholDrugBeforeSex === 'Yes') score += 15
    if (formData.groupSexChemsex === 'Yes') score += 25
    if (formData.forcedSex === 'Yes') score += 10
    
    // HIV status
    if (formData.hivTestResult === 'Positive') score += 40
    else if (formData.hivTestResult === 'Unknown') score += 15
    
    return Math.min(score, 100) // Cap at 100
}

const calculateRiskLevel = (formData) => {
    const score = calculateRiskScore(formData)
    
    if (score >= 60) return 'High'
    else if (score >= 30) return 'Medium'
    else if (score >= 10) return 'Low'
    else return 'Very Low'
}

const getRiskLevelColor = (level) => {
    switch (level) {
        case 'High': return 'bg-red-100 text-red-800 border-red-200'
        case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-200'
        case 'Low': return 'bg-green-100 text-green-800 border-green-200'
        case 'Very Low': return 'bg-blue-100 text-blue-800 border-blue-200'
        default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
}

const getRiskLevelIcon = (level) => {
    switch (level) {
        case 'High': return <FiAlertTriangle className="w-5 h-5" />
        case 'Medium': return <FiTrendingUp className="w-5 h-5" />
        case 'Low': return <FiCheckCircle className="w-5 h-5" />
        case 'Very Low': return <FiShield className="w-5 h-5" />
        default: return <FiShield className="w-5 h-5" />
    }
}

const getRiskLevelText = (level) => {
    switch (level) {
        case 'High': return 'ខ្ពស់'
        case 'Medium': return 'មធ្យម'
        case 'Low': return 'ទាប'
        case 'Very Low': return 'ទាបណាស់'
        default: return 'មិនបានគណនា'
    }
}

const getRiskFactors = (formData) => {
    const factors = []
    
    if (formData.hadSexPast6Months === 'Yes') factors.push('ការរួមភេទក្នុងរយៈពេល៦ខែចុងក្រោយ / Sexual activity in past 6 months')
    if (formData.numberOfSexualPartners && formData.numberOfSexualPartners !== '0') factors.push('ដៃគូរួមភេទច្រើន / Multiple sexual partners')
    if (formData.receiveMoneyForSex === 'Yes') factors.push('សកម្មភាពផ្លូវភេទ / Sex work activities')
    if (formData.paidForSex === 'Yes') factors.push('សកម្មភាពផ្លូវភេទពាណិជ្ជកម្ម / Commercial sex activity')
    if (formData.sexWithHIVPartner === 'Yes') factors.push('រួមភេទជាមួយដៃគូផ្ទុកអេដស៍ / Sex with HIV+ partner')
    if (formData.sexWithoutCondom === 'Yes') factors.push('រួមភេទដោយមិនប្រើកុងដូម / Unprotected sex')
    if (formData.stiSymptoms === 'Yes') factors.push('មានរោគសញ្ញាជំងឺឆ្លងតាមរយៈរួមភេទ / STI symptoms present')
    if (formData.injectedDrugSharedNeedle === 'Yes') factors.push('ការប្រើម្ជុលរួមគ្នា / Needle sharing')
    if (formData.alcoholDrugBeforeSex === 'Yes') factors.push('ការប្រើគ្រឿងស្រវឹង/ថ្នាំមុនរួមភេទ / Substance use before sex')
    if (formData.groupSexChemsex === 'Yes') factors.push('រួមភេទជាក្រុម ឬរួមភេទជាមួយថ្នាំ / Group sex or chemsex')
    if (formData.forcedSex === 'Yes') factors.push('បទពិសោធន៍រួមភេទដោយបង្ខំ / Forced sex experience')
    
    return factors
}

const getRecommendations = (riskLevel) => {
    switch (riskLevel) {
        case 'High':
            return (
                <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                    <p className="font-medium text-red-900">សកម្មភាពដែលត្រូវធ្វើភ្លាមៗ / Immediate Actions Required:</p>
                    <ul className="text-sm text-red-700 mt-2 space-y-1">
                        <li>• ការធ្វើតេស្តជំងឺឆ្លងតាមរយៈរួមភេទ/អេដស៍ភ្លាមៗ / Immediate STI/HIV testing</li>
                        <li>• ពិចារណាប្រើប្រីពប្រសិនបើមិនមានអេដស៍ / Consider PrEP if HIV negative</li>
                        <li>• ការប្រើកុងដូមជាប្រចាំត្រូវបានណែនាំយ៉ាងខ្លាំង / Regular condom use strongly advised</li>
                        <li>• ពិចារណាសេវាការណែនាំ / Consider counseling services</li>
                    </ul>
                </div>
            )
        case 'Medium':
            return (
                <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <p className="font-medium text-yellow-900">សកម្មភាពដែលបានណែនាំ / Recommended Actions:</p>
                    <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                        <li>• ការធ្វើតេស្តជំងឺឆ្លងតាមរយៈរួមភេទជាប្រចាំ (រៀងរាល់៣-៦ខែ) / Regular STI testing (every 3-6 months)</li>
                        <li>• ការប្រើកុងដូមជាប្រចាំ / Consistent condom use</li>
                        <li>• ពិចារណាប្រើប្រីពប្រសិនបើមានហានិភ័យ / Consider PrEP if at risk</li>
                        <li>• ការពិនិត្យសុខភាពជាប្រចាំ / Regular health check-ups</li>
                    </ul>
                </div>
            )
        case 'Low':
            return (
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <p className="font-medium text-green-900">រក្សាការអនុវត្តល្អ / Maintain Good Practices:</p>
                    <ul className="text-sm text-green-700 mt-2 space-y-1">
                        <li>• បន្តការអនុវត្តរួមភេទដោយសុវត្ថិភាព / Continue safe sex practices</li>
                        <li>• ការពិនិត្យសុខភាពជាប្រចាំ / Regular health check-ups</li>
                        <li>• រក្សាការជួបដំណឹងអំពីសុខភាពផ្លូវភេទ / Stay informed about sexual health</li>
                        <li>• ការធ្វើតេស្តជំងឺឆ្លងតាមរយៈរួមភេទប្រចាំឆ្នាំ / Annual STI screening</li>
                    </ul>
                </div>
            )
        case 'Very Low':
            return (
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="font-medium text-blue-900">ការអនុវត្តល្អ / Good Practices:</p>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                        <li>• រក្សាការអនុវត្តរួមភេទដោយសុវត្ថិភាព / Maintain safe sex practices</li>
                        <li>• ការពិនិត្យសុខភាពជាប្រចាំ / Regular health check-ups</li>
                        <li>• ការធ្វើតេស្តជំងឺឆ្លងតាមរយៈរួមភេទប្រចាំឆ្នាំ / Annual STI screening</li>
                    </ul>
                </div>
            )
        default:
            return (
                <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                    <p className="font-medium text-gray-900">បំពេញការវាយតម្លៃដើម្បីទទួលបានអនុសាសន៍ / Complete the assessment to get recommendations</p>
                </div>
            )
    }
}

export default ClinicalData
