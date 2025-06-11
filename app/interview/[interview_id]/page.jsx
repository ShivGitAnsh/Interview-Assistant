"use client"
import React, { useContext, useEffect, useState } from 'react'
import InterviewHeader from '../_components/InterviewHeader'
import Image from 'next/image'
import { CiClock1, CiVideoOn } from 'react-icons/ci'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useParams } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'
import { toast } from 'sonner'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import { useRouter } from 'next/navigation'
import { FiLoader } from 'react-icons/fi'

function Interview() {

    const { interview_id } = useParams();
    const [interviewData, setInterviewData] = useState();
    const [userName, setUserName] = useState();
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState();
    const {interviewInfo, setInterviewInfo} = useContext(InterviewDataContext);
    const router = useRouter();

    useEffect(() => {
        interview_id && GetInterviewDetails();
    }, [interview_id])

    const GetInterviewDetails = async () => {
        setLoading(true);
        try {
            let { data: interviews, error } = await supabase
                .from('interviews')
                .select("jobPosition,jobDescription,Duration,type")
                .eq("interview_id", interview_id)
            setInterviewData(interviews[0]);
            setLoading(false);
            if (interviews?.length == 0) {
                toast('Incorrect Interview Link')
                return;
            }
        } catch (e) {
            setLoading(false);
            toast('Incorrect Interview Link')
        }
    }
    const onJoinInterview = async() => {
        setLoading(true);
        let { data: interviews, error } = await supabase
            .from('interviews')
            .select('*')
            .eq('interview_id', interview_id);
            setInterviewInfo({
                userName:userName,
                userEmail:userEmail,
                interviewData:interviews[0],
            });
            router.push("/interview/"+interview_id+"/start")
            setLoading(false);
    }
    return (
        <div className='px-10 md:px-28 lg:px-48 xl:px-64 mt-7 '>
            <div className='flex flex-col justify-center items-center border rounded-lg bg-white
             p-7 lg:px-33 xl:px-52 mb-20'>
                <Image src={'/logo.png'} alt='logo' width={200} height={100} className='w-[140px]' />
                <h2 className='mt-3'>AI powered Interview Platform</h2>

                <Image src={'/interview.png'} alt='interview' width={500} height={500} className='w-[280px] my-6' />

                <h2 className='font-bold text-xl mt-2'>{interviewData?.jobPosition}</h2>
                <h2 className='flex gap-2 items-center text-gray-500 mt-3'><CiClock1 className='h-4 w-4' />{interviewData?.Duration}</h2>

                <div className='w-full'>
                    <h2>Enter Your Full Name</h2>
                    <Input placeholder='e.g. John Doe' onChange={(event) => setUserName(event.target.value)} />
                </div>
                <div className='w-full mt-2'>
                    <h2>Enter Your Email</h2>
                    <Input placeholder='john@email.com' onChange={(event) => setUserEmail(event.target.value)} />
                </div>
                <div className='p-3 bg-blue-100 flex gap-4 rounded-lg mt-3'>
                    <IoMdInformationCircleOutline className='text-primary' />
                    <div>
                        <h2 className='font-bold'>Before you begin</h2>
                        <ul>
                            <li className='text-sm text-primary'>- Test your camera and microphone</li>
                            <li className='text-sm text-primary'>- Ensure you have a stable internet connection</li>
                            <li className='text-sm text-primary'>- Find a quiet place for interview</li>
                        </ul>
                    </div>
                </div>

                <Button className='mt-5 w-full font-bold' disabled={loading || !userName ||!userEmail} onClick={() => onJoinInterview()}>
                    <CiVideoOn />{loading&& <FiLoader/>}Join Interview</Button>
            </div>
        </div>
    )
}

export default Interview