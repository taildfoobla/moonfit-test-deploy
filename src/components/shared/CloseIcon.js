import React from 'react'

const CloseIcon = ({className = ''}) => {
    return (
        <svg className={`cursor-pointer ${className}`} width="32" height="32" viewBox="0 0 32 32" fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="30" height="30" rx="6" stroke="white" strokeOpacity="0.2"
                  strokeWidth="2"/>
            <path d="M21.0625 10.9375L10.9375 21.0625" stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21.0625 21.0625L10.9375 10.9375" stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export default CloseIcon