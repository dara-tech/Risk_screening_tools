import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Handle DHIS2 API errors and return user-friendly error messages
 * @param {Error} error - The error object
 * @param {string} context - Context of the operation (e.g., 'loading org units', 'fetching records')
 * @returns {string} User-friendly error message
 */
export const handleDHIS2Error = (error, context = 'operation') => {
    console.error(`Error in ${context}:`, error)
    
    let errorMessage = `Failed to ${context}`
    
    // Provide more specific error messages based on the error type
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = `Network error: Unable to connect to DHIS2 server. Please check your internet connection and server status.`
    } else if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
        errorMessage = `Authentication error: Please check your DHIS2 credentials.`
    } else if (error.message?.includes('403') || error.message?.includes('forbidden')) {
        errorMessage = `Access denied: You do not have permission to ${context}.`
    } else if (error.message?.includes('404')) {
        errorMessage = `Server error: DHIS2 API endpoint not found. Please check your server configuration.`
    } else if (error.message?.includes('timeout')) {
        errorMessage = `Request timeout: The server is taking too long to respond. Please try again.`
    } else if (error.message?.includes('CORS')) {
        errorMessage = `CORS error: Cross-origin request blocked. Please check your DHIS2 server configuration.`
    }
    
    return errorMessage
}

/**
 * Check if the application is running in development mode
 * @returns {boolean}
 */
export const isDevelopment = () => {
    return process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost'
}

/**
 * Get DHIS2 server URL from environment or default
 * @returns {string}
 */
export const getDHIS2ServerURL = () => {
    // In development, try to get from meta tag or use default
    if (isDevelopment()) {
        const metaTag = document.querySelector('meta[name="dhis2-base-url"]')
        if (metaTag && metaTag.content && metaTag.content !== '__DHIS2_BASE_URL__') {
            return metaTag.content
        }
        return 'http://localhost:8080'
    }
    
    // In production, get from meta tag
    const metaTag = document.querySelector('meta[name="dhis2-base-url"]')
    return metaTag?.content || window.location.origin
} 