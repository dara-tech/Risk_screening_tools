import React from 'react'
import { Card, CardContent } from './ui/card'
import { FiCheckCircle, FiActivity, FiFileText } from 'react-icons/fi'
import { Shield, Calculator, User } from 'lucide-react'


const ProgressSteps = ({ currentStep, steps }) => {
    const getStepIcon = (stepId) => {
        switch (stepId) {
            case 1: return <User className="w-3 h-3" />
            case 2: return <Shield className="w-3 h-3" />
            case 3: return <FiActivity className="w-3 h-3" />
            case 4: return <Calculator className="w-3 h-3" />
            case 5: return <FiFileText className="w-3 h-3" />
            default: return <User className="w-3 h-3" />
        }
    }

    return (
        <div className="relative">
            {/* Background gradient line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 transform -translate-y-1/2 z-0" />
            
            {/* Progress line */}
            <div 
                className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transform -translate-y-1/2 z-10 transition-all duration-700 ease-out"
                style={{ 
                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                    maxWidth: '100%'
                }}
            />
            
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
                <CardContent className="p-3">
                    <div className="flex items-center justify-between relative z-20">
                        {steps.map((step, index) => {
                            const isActive = currentStep === step.id
                            const isCompleted = currentStep > step.id
                            const isUpcoming = currentStep < step.id
                            
                            return (
                                <div key={step.id} className="flex flex-col items-center relative group">
                                    {/* Step Circle */}
                                    <div className={`
                                        relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-out
                                        ${isCompleted 
                                            ? 'bg-green-500 border-green-500 shadow-lg shadow-green-200 scale-110' 
                                            : isActive 
                                                ? 'bg-blue-500 border-blue-500 shadow-lg shadow-blue-200 scale-110' 
                                                : 'bg-white border-gray-300 hover:border-gray-400 hover:scale-105'
                                        }
                                    `}>
                                        {isCompleted ? (
                                            <FiCheckCircle className="w-4 h-4 text-white" />
                                        ) : (
                                            <div className={`
                                                transition-all duration-300
                                                ${isActive ? 'text-white' : 'text-gray-500'}
                                            `}>
                                                {getStepIcon(step.id)}
                                            </div>
                                        )}
                                        
                                        {/* Pulse animation for active step */}
                                        {isActive && (
                                            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />
                                        )}
                                    </div>
                                    
                                    {/* Step Label */}
                                    <div className="mt-2 text-center">
                                        <span className={`
                                            text-xs font-medium transition-all duration-300
                                            ${isCompleted 
                                                ? 'text-green-600' 
                                                : isActive 
                                                    ? 'text-blue-600' 
                                                    : 'text-gray-500'
                                            }
                                        `}>
                                            {step.title}
                                        </span>
                                        
                                        {/* Step number for mobile */}
                                        <div className={`
                                            text-xs mt-0.5 transition-all duration-300
                                            ${isCompleted 
                                                ? 'text-green-500' 
                                                : isActive 
                                                    ? 'text-blue-500' 
                                                    : 'text-gray-400'
                                            }
                                        `}>
                                            {step.id}
                                        </div>
                                    </div>
                                    
                                    {/* Connection line */}
                                    {index < steps.length - 1 && (
                                        <div className="absolute top-4 left-full w-full h-0.5 bg-gray-200 transform -translate-y-1/2 z-0" />
                                    )}
                                    
                                    {/* Tooltip on hover */}
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                                        {step.title}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="mt-3 flex items-center justify-center">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>Step {currentStep} of {steps.length}</span>
                            <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                                />
                            </div>
                            <span>{Math.round((currentStep / steps.length) * 100)}%</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ProgressSteps
