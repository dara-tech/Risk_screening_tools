import React, { useState, useRef, useEffect } from 'react'

const Tooltip = ({ children, content, position = 'top', className = '' }) => {
    const [isVisible, setIsVisible] = useState(false)
    const tooltipRef = useRef(null)
    const triggerRef = useRef(null)

    useEffect(() => {
        const handleMouseEnter = () => setIsVisible(true)
        const handleMouseLeave = () => setIsVisible(false)

        const trigger = triggerRef.current
        if (trigger) {
            trigger.addEventListener('mouseenter', handleMouseEnter)
            trigger.addEventListener('mouseleave', handleMouseLeave)

            return () => {
                trigger.removeEventListener('mouseenter', handleMouseEnter)
                trigger.removeEventListener('mouseleave', handleMouseLeave)
            }
        }
    }, [])

    const getPositionClasses = () => {
        switch (position) {
            case 'top':
                return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
            case 'bottom':
                return 'top-full left-1/2 transform -translate-x-1/2 mt-2'
            case 'left':
                return 'right-full top-1/2 transform -translate-y-1/2 mr-2'
            case 'right':
                return 'left-full top-1/2 transform -translate-y-1/2 ml-2'
            default:
                return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
        }
    }

    return (
        <div className="relative inline-block" ref={triggerRef}>
            {children}
            {isVisible && (
                <div
                    ref={tooltipRef}
                    className={`absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-none shadow-lg whitespace-nowrap ${getPositionClasses()} ${className}`}
                >
                    {content}
                    <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
                        position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
                        position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
                        position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
                        'right-full top-1/2 -translate-y-1/2 -mr-1'
                    }`} />
                </div>
            )}
        </div>
    )
}

export default Tooltip
