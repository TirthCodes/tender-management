import React from 'react'

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className='lg:px-4'>
      {children}
    </div>  
  )
}
