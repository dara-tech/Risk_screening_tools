import React from 'react'
import { Card, CardContent } from './ui/card'
import { FiUser, FiCheckCircle } from 'react-icons/fi'
import { Shield, Calculator } from 'lucide-react'

const ProgressSteps = ({ currentStep, steps }) => {
    return (
        <Card className="bg-white rounded-2xl border border-gray-100">
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200 ${
                                currentStep >= step.id 
                                    ? 'bg-blue-600 border-blue-600 text-white' 
                                    : 'bg-gray-100 border-gray-300 text-gray-500'
                            }`}>
                                {currentStep > step.id ? (
                                    <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                ) : (
                                    <div className="w-4 h-4 sm:w-5 sm:h-5">
                                        {step.icon}
                                    </div>
                                )}
                            </div>
                            <span className={`ml-2 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                                currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                                <span className="hidden sm:inline">{step.title}</span>
                                <span className="sm:hidden">{step.id}</span>
                            </span>
                            {index < steps.length - 1 && (
                                <div className={`hidden sm:block w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 transition-colors duration-200 ${
                                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default ProgressSteps
