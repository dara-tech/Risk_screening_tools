import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    size = 'md',
    showCloseButton = true,
    closeOnBackdrop = true,
    className = ''
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    if (!isOpen) return null

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4'
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={closeOnBackdrop ? onClose : undefined}
            />
            
            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div 
                    className={cn(
                        "relative w-full transform overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300 ease-out",
                        sizeClasses[size],
                        className
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    {title && (
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {title}
                            </h3>
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    )}
                    
                    {/* Content */}
                    <div className="px-6 py-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export { Modal }
