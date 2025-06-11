"use client"
import React, { useEffect, useState } from 'react'
import WelcomeContainer from './_components/WelcomeContainer'
import CreateOptions from './_components/CreateOptions'
import LatestInterviewsList from './_components/LatestInterviewsList'
import { useRouter } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'
import ProtectedRoute from '../_components/ProtectedRoute'



function Dashboard() {

  return (
    <div>
      {/* <WelcomeContainer/> */}
      <h2 className='my-3 font-bold text-2xl'>Dashboard</h2>
      <CreateOptions/>
      <LatestInterviewsList/>
    </div>
  )
}

export default Dashboard;