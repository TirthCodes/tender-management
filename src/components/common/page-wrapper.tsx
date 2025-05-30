import React from 'react'

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className='px-4'>
      {children}
    </div>  
  )
}
