import React from 'react'
import DashboardProvider from './provider'
import ProtectedRoute from './_components/ProtectedRoute'

function DashboardLayout({ children }) {
    return (
        <ProtectedRoute>
         <div className='bg-secondary'>
            <DashboardProvider>
                <div className='p-3'>                  
                {children}
                </div>
            </DashboardProvider>
         </div>
        </ProtectedRoute>
        
    )
}

export default DashboardLayout