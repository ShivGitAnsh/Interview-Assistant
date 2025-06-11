"use client"
import { useUser } from '@/app/provider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabaseClient';
import React, { useEffect, useState } from 'react'
import { CiVideoOn } from "react-icons/ci";
import InterviewCard from './InterviewCard';
import moment from "moment"
import { toast } from 'sonner';
import Link from 'next/link';

function LatestInterviewsList() {
    const [interviewList, setInterviewList] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        user&&GetInterviewList();
    },[user])

    const GetInterviewList = async() => {
        let { data: interviews, error } = await supabase
            .from('interviews')
            .select('*')
            .eq('userEmail', user?.email)
            .order('id', {ascending:false})
            .limit(6);

            console.log(interviews);
            setInterviewList(interviews);
    }

    return (
        <div className='my-5'>
            <h2 className='font-bold text-2xl'>Previously Created Interviews</h2>
            {interviewList?.length == 0 &&
                <div className='p-5 flex flex-col gap-3 items-center bg-white mt-5'>
                    <CiVideoOn className='h-10 w-10 text-primary' />
                    <h2>You don't have any interview created!</h2>
                    <Link href={'/dashboard/create-interview'}>
                    <Button>+ Create new Interview</Button>
                    </Link>
                </div>}
   
             {interviewList&&
                <div className='grid grid-cols-2 mt-5 xl:grid-cols-3 gap-5'>
                    {interviewList.map((interview, index) => (
                        <InterviewCard interview = {interview} key = {index}/>
                    ))}
                </div>

             }
        </div>
    )
}

export default LatestInterviewsList