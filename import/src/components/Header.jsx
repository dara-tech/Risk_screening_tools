import React from 'react'


const Header = ({ selectedOrgUnit, orgUnits, mode = 'create' }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#116b7b] to-[#1f547f] px-6 py-8">
                <div className="flex items-center justify-center gap-4">
                
                    <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                        វាយតម្លៃកម្រិតហានិភ័យ – នាំចូលទិន្នន័យ
                        {mode === 'edit' && <span className="block text-lg text-blue-200 mt-1">(ប្តូរ)</span>}
                        {mode === 'view' && <span className="block text-lg text-blue-200 mt-1">(មើល)</span>}
                    </h1>
                    <p className="text-blue-100 text-sm sm:text-base">
                        {mode === 'edit' ? 'កំពុងកែប្រែកំណត់ត្រាវាយតម្លៃ' : 
                         mode === 'view' ? 'កំពុងមើលព័ត៌មានលម្អិតនៃកំណត់ត្រាវាយតម្លៃ' : 
                         'ការវាយតម្លៃ និងជំនាញវាយតម្លៃកម្រិតហានិភ័យដ៏ទូលំទូលាយ'}
                    </p>
                    {selectedOrgUnit && (
                        <p className="text-sm text-blue-200 mt-2">
                            📍 {orgUnits.find(ou => ou.id === selectedOrgUnit)?.displayName || selectedOrgUnit}
                        </p>
                    )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
