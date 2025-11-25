import React from 'react'

const Loading = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-none border-2 border-gray-200 border-t-primary shadow-sm`}></div>
      {text && (
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{text}</p>
      )}
    </div>
  )
}

export { Loading }
