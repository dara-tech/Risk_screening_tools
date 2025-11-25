import React from 'react'

const ToastContext = React.createContext({ showToast: () => {} })

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = React.useState([])

    const showToast = React.useCallback(({ title, description, variant = 'success', duration = 2800 }) => {
        const id = Math.random().toString(36).slice(2)
        setToasts(prev => [...prev, { id, title, description, variant }])
        window.setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, duration)
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 space-y-2">
                {toasts.map(t => (
                    <div key={t.id} className={`min-w-[200px] max-w-[320px] rounded-none shadow-md p-3 border text-sm ${
                        t.variant === 'success' ? 'bg-green-50 border-green-200' :
                        t.variant === 'error' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                        {t.title && (
                            <div className={`font-medium text-xs ${t.variant === 'success' ? 'text-green-800' : t.variant === 'error' ? 'text-red-800' : 'text-gray-800'}`}>
                                {t.title}
                            </div>
                        )}
                        {t.description && (
                            <div className={`mt-0.5 text-xs ${t.variant === 'success' ? 'text-green-700' : t.variant === 'error' ? 'text-red-700' : 'text-gray-700'}`}>
                                {t.description}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => React.useContext(ToastContext)

















