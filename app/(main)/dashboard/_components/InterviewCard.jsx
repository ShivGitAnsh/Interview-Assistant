"use client"
import { Button } from '@/components/ui/button'
import moment from 'moment'
import React, { useState } from 'react'
import { FaCopy } from 'react-icons/fa'
import { IoSend } from 'react-icons/io5'
import { toast } from 'sonner'
import { FaArrowRight } from "react-icons/fa6";
import Link from 'next/link'
import EmailModal from './EmailModal'


function InterviewCard({interview, viewDetail=false}) {

    const [openModal, setOpenModal] = useState(false);


    const copyLink = () => {
        const url = process.env.NEXT_PUBLIC_HOST_URL+'/interview/'+interview?.interview_id;
       navigator.clipboard.writeText(url);
       toast('Copied')
    }

      const onSend = async (email) => {
    const link = process.env.NEXT_PUBLIC_HOST_URL + '/interview/' + interview?.interview_id;

    try {
      const response = await fetch('/api/send-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          link,
          jobPosition: interview?.jobPosition,
        }),
      });

      if (response.ok) {
        toast.success("Invite sent to " + email);
      } else {
        toast.error("Failed to send invite");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error occurred");
    }
  };

  return (
    <div className='p-5 bg-white rounded-lg border'>
        <div className='flex items-center justify-between'>
            <div className='h-[40px] w-[40px] bg-primary rounded-full'></div>
            <h2 className='text-sm'>{moment(interview?.createdat).format('DD MMM yyy')}</h2>
        </div>
        <h2 className='mt-3 font-bold text-lg'>{interview?.jobPosition}</h2>
        <h2 className='mt-2 text-sm flex justify-between text-gray-500'>{interview?.Duration}
          {interview['interview-feedback'] && <span className='text-green-700'>{interview['interview-feedback']?.length} Candidates</span>}
        </h2>
        {!viewDetail ? <div className='flex gap-3 w-full mt-5'>
          <Button variant = 'outline' className='w-1/2' onClick = {() => copyLink()}> <FaCopy />Copy Link</Button>
          <Button className='w-1/2' onClick={() => setOpenModal(true)}><IoSend/>Send</Button>
        </div>
        :
        <Link href={'/scheduled-interview/'+interview?.interview_id+"/details"}>
        <Button className="mt-5 w-full" variant = "outline">View Detail<FaArrowRight/></Button>
        </Link>
        }
        <EmailModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSend={onSend}
      />
    </div>
  )
}

export default InterviewCard