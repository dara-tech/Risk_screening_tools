import React, { useState } from 'react'
import { FiHash, FiCopy, FiRefreshCw } from 'react-icons/fi'

const UUICCalculator = () => {
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        sex: '',
        dateOfBirth: ''
    })
    const [uUIC, setUUIC] = useState('')
    const [copied, setCopied] = useState(false)

    const calculateUUIC = () => {
        const { lastName, firstName, sex, dateOfBirth } = formData

        if (!lastName || !firstName || !sex || !dateOfBirth) {
            setUUIC('')
            return
        }

        try {
            // Get first 2 characters of last name
            const lastNamePart = lastName.substring(0, 2).padEnd(2, ' ')
            
            // Get first 2 characters of first name
            const firstNamePart = firstName.substring(0, 2).padEnd(2, ' ')
            
            // Sex: 1 for Male, 2 for Female
            const sexPart = sex === 'Male' ? '1' : sex === 'Female' ? '2' : ''
            
            // Parse date of birth
            const date = new Date(dateOfBirth)
            const day = date.getDate().toString().padStart(2, '0')
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const year = date.getFullYear().toString().slice(-2) // Last 2 digits
            
            // Combine all parts
            const calculatedUUIC = `${lastNamePart}${firstNamePart}${sexPart}${day}${month}${year}`
            setUUIC(calculatedUUIC)
        } catch (error) {
            setUUIC('')
        }
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        calculateUUIC()
    }

    const handleCopy = async () => {
        if (uUIC) {
            try {
                await navigator.clipboard.writeText(uUIC)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            } catch (error) {
                console.error('Failed to copy:', error)
            }
        }
    }

    const handleReset = () => {
        setFormData({
            lastName: '',
            firstName: '',
            sex: '',
            dateOfBirth: ''
        })
        setUUIC('')
        setCopied(false)
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-t-lg">
                    <h1 className="text-xl font-bold flex items-center">
                        <FiHash className="w-6 h-6 mr-2" />
                        U-UIC Calculator
                    </h1>
                    <p className="text-blue-100 text-sm mt-1">
                        Universal Unique Identifier Calculator
                    </p>
                </div>

                {/* UUIC Format Explanation */}
                <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
                    <h2 className="text-sm font-semibold text-blue-900 mb-2">U-UIC Format:</h2>
                    <div className="grid grid-cols-6 gap-2 text-xs">
                        <div className="bg-white p-2 rounded border text-center">
                            <div className="font-medium text-blue-700">Last Name</div>
                            <div className="text-gray-600">2 chars</div>
                        </div>
                        <div className="bg-white p-2 rounded border text-center">
                            <div className="font-medium text-blue-700">First Name</div>
                            <div className="text-gray-600">2 chars</div>
                        </div>
                        <div className="bg-white p-2 rounded border text-center">
                            <div className="font-medium text-blue-700">Sex</div>
                            <div className="text-gray-600">1 digit</div>
                        </div>
                        <div className="bg-white p-2 rounded border text-center">
                            <div className="font-medium text-blue-700">Day</div>
                            <div className="text-gray-600">2 digits</div>
                        </div>
                        <div className="bg-white p-2 rounded border text-center">
                            <div className="font-medium text-blue-700">Month</div>
                            <div className="text-gray-600">2 digits</div>
                        </div>
                        <div className="bg-white p-2 rounded border text-center">
                            <div className="font-medium text-blue-700">Year</div>
                            <div className="text-gray-600">2 digits</div>
                        </div>
                    </div>
                    <div className="mt-3 text-xs text-blue-700">
                        <strong>Format:</strong> LastName FirstName Sex Day Month Year
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter last name"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">First 2 characters will be used</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name *
                            </label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter first name"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">First 2 characters will be used</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sex *
                            </label>
                            <select
                                value={formData.sex}
                                onChange={(e) => handleInputChange('sex', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select sex</option>
                                <option value="Male">Male (1)</option>
                                <option value="Female">Female (2)</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date of Birth *
                            </label>
                            <input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                        >
                            <FiHash className="w-4 h-4 mr-2" />
                            Calculate U-UIC
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
                        >
                            <FiRefreshCw className="w-4 h-4 mr-2" />
                            Reset
                        </button>
                    </div>
                </form>

                {/* Result */}
                {uUIC && (
                    <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Generated U-UIC
                        </h3>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="text-2xl font-mono text-gray-900 font-bold tracking-wider">
                                        {uUIC}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Format: {uUIC.substring(0, 2)} {uUIC.substring(2, 4)} {uUIC.substring(4, 5)} {uUIC.substring(5, 7)} {uUIC.substring(7, 9)} {uUIC.substring(9, 11)}
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handleCopy}
                                    className="ml-4 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                >
                                    <FiCopy className="w-4 h-4 mr-1" />
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="mt-4 grid grid-cols-6 gap-2 text-xs">
                            <div className="bg-blue-100 p-2 rounded text-center">
                                <div className="font-medium text-blue-900">{uUIC.substring(0, 2)}</div>
                                <div className="text-blue-700">Last Name</div>
                            </div>
                            <div className="bg-green-100 p-2 rounded text-center">
                                <div className="font-medium text-green-900">{uUIC.substring(2, 4)}</div>
                                <div className="text-green-700">First Name</div>
                            </div>
                            <div className="bg-purple-100 p-2 rounded text-center">
                                <div className="font-medium text-purple-900">{uUIC.substring(4, 5)}</div>
                                <div className="text-purple-700">Sex</div>
                            </div>
                            <div className="bg-orange-100 p-2 rounded text-center">
                                <div className="font-medium text-orange-900">{uUIC.substring(5, 7)}</div>
                                <div className="text-orange-700">Day</div>
                            </div>
                            <div className="bg-red-100 p-2 rounded text-center">
                                <div className="font-medium text-red-900">{uUIC.substring(7, 9)}</div>
                                <div className="text-red-700">Month</div>
                            </div>
                            <div className="bg-indigo-100 p-2 rounded text-center">
                                <div className="font-medium text-indigo-900">{uUIC.substring(9, 11)}</div>
                                <div className="text-indigo-700">Year</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UUICCalculator
