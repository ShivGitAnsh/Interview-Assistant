"use client"
import { useUser } from '@/app/provider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabaseClient'
import React, { useEffect, useState } from 'react'
import { CiVideoOn } from 'react-icons/ci';
import InterviewCard from '../dashboard/_components/InterviewCard';
import Link from 'next/link';

function ScheduledInterview() {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState()

    useEffect(() => {
      user && GetInterviewList();
    },[user])

    const GetInterviewList =async() => {
        const {data, error} = await supabase.from('interviews')
        .select('jobPosition,Duration,interview_id,interview-feedback(userEmail)')
        .eq('userEmail', user?.email)
        .order('id', {ascending : false});

        setInterviewList(data);
    }
  return (
    <div className='mt-5'>
        <h2 className = 'font-bold text-xl'>Interview List with Feedback</h2>
        {interviewList?.length == 0 &&
                <div className='p-5 flex flex-col gap-3 items-center bg-white mt-5'>
                    <CiVideoOn className='h-10 w-10 text-primary' />
                    <h2>You don't have any interview created!</h2>
                    <Link href = '/dashboard/create-interview'>
                    <Button>+ Create new Interview</Button>
                    </Link>
                </div>}
   
             {interviewList&&
                <div className='grid grid-cols-2 mt-5 xl:grid-cols-3 gap-5'>
                    {interviewList?.map((interview, index) => (
                        <InterviewCard interview = {interview} key = {index}
                         viewDetail={true}/>
                    ))}
                </div>

             }
    </div>
  )
}

export default ScheduledInterview