import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import { CiMail } from 'react-icons/ci';
import { FaClock, FaCopy, FaList, FaPlus } from 'react-icons/fa';
import { FaArrowLeftLong } from "react-icons/fa6";
import { toast } from 'sonner';

function InterviewLink({ interview_id, formData }) {

    const url = process.env.NEXT_PUBLIC_HOST_URL + '/' + interview_id;
    const GetInterviewUrl = () => {
        return url
    }

    const onCopyLink = async() => {
       await navigator.clipboard.writeText(url);
       toast('Link Copied')
    }
    return (
        <div className='flex flex-col items-center justify-center mt-10'>
            <Image src={'/check.png'} alt='check'
                width={200}
                height={200}
                className='w-[50px] h-[50px]' />
            <h2 className='font-bold text-lg mt-4'>Your AI Interview is Ready!</h2>
            <p className='mt-3'>Click the link below to start your AI-powered interview, or share it with someone you'd like to invite to take the interview.</p>
            <div className='w-full p-7 mt-6 rounded-xl bg-white'>
                <div className='flex justify-between items-center'>
                    <h2 className='font-bold'>Interview Link</h2>
                    <h2 className='p-1 px-2 text-primary bg-blue-50 rounded-xl'> Valid for 30 days</h2>
                </div>
                <div className='mt-3 flex gap-3 items-center'>
                    <Input defaultValue={GetInterviewUrl()} disabled={true} />
                    <Button onClick={() => onCopyLink()}> <FaCopy /> Copy Link </Button>
                </div>
                <hr className='my-5' />

                <div className='flex gap-5'>
                    <h2 className='text-sm text-gray-500 flex gap-2 items-center'><FaClock className='h-4 w-4' />{formData?.Duration}</h2>
                    <h2 className='text-sm text-gray-500 flex gap-2 items-center'><FaList className='h-4 w-4' />10 Questions</h2>
                    {/* <h2 className='text-sm text-gray-500 flex gap-2 items-center'><FaClock className = 'h-4 w-4'/>{formData?.Duration}</h2> */}
                </div>

            </div>
            <div className='mt-7 bg-white p-5 rounded-lg w-full'>
                <h2>Share Via</h2>
                <div className='flex gap-3 mt-2 w-full overflow-hidden'>
                    <Button variant='outline' className='flex-1 min-w-0'><CiMail /> Email</Button>
                    <Button variant='outline' className='flex-1 min-w-0'><CiMail /> Slack</Button>
                    <Button variant='outline' className='flex-1 min-w-0'><CiMail /> Whatsapp</Button>
                </div>

            </div>

            <div className='flex w-full gap-5 justify-between mt-6'>
                <Link href={'/dashboard'}>
                    <Button variant={'outline'}><FaArrowLeftLong />Back To DashBoard</Button>
                </Link>
                <Link href={'/dashboard/create-interview'}>
                    <Button><FaPlus /> Create New Interview </Button>
                </Link>
            </div>

        </div>
    )
}

export default InterviewLink